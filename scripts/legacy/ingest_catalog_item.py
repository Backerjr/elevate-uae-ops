#!/usr/bin/env python3
"""
Utility to ingest a validated product record into the Tour Catalog JSON store.

Default catalog path: src/data/products.json (relative to repo root).
Reads a single JSON object from --input or stdin, validates fields, and upserts
by product_id (fails on duplicates unless --replace is provided).
"""

from __future__ import annotations

import argparse
import json
import sys
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List

DEFAULT_CATALOG_PATH = Path(__file__).resolve().parents[1] / "data" / "products.json"


class ValidationError(Exception):
    """Raised when incoming data fails validation."""


@dataclass
class Args:
    input: Path | None
    catalog: Path
    replace: bool


def parse_args() -> Args:
    parser = argparse.ArgumentParser(description="Ingest a single catalog product record (JSON).")
    parser.add_argument(
        "--input",
        type=Path,
        help="Path to JSON file containing the product record. Reads stdin if omitted.",
    )
    parser.add_argument(
        "--catalog",
        type=Path,
        default=DEFAULT_CATALOG_PATH,
        help=f"Catalog JSON path (default: {DEFAULT_CATALOG_PATH})",
    )
    parser.add_argument(
        "--replace",
        action="store_true",
        help="Allow replacing an existing product with the same product_id.",
    )
    ns = parser.parse_args()
    return Args(input=ns.input, catalog=ns.catalog, replace=ns.replace)


def load_catalog(path: Path) -> List[Dict[str, Any]]:
    if not path.exists():
        return []
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise ValidationError(f"Catalog file is not valid JSON: {exc}") from exc
    if not isinstance(data, list):
        raise ValidationError("Catalog file must contain a JSON array of products.")
    return data


def _require_str(record: Dict[str, Any], key: str) -> str:
    if key not in record or not isinstance(record[key], str) or not record[key].strip():
        raise ValidationError(f"'{key}' is required and must be a non-empty string.")
    return record[key].strip()


def _require_number(record: Dict[str, Any], key: str) -> float:
    if key not in record or not isinstance(record[key], (int, float)):
        raise ValidationError(f"'{key}' is required and must be a number.")
    return float(record[key])


def _require_str_list(record: Dict[str, Any], key: str) -> List[str]:
    value = record.get(key, [])
    if value is None:
        return []
    if not isinstance(value, list) or not all(isinstance(item, str) for item in value):
        raise ValidationError(f"'{key}' must be a list of strings.")
    return value


def _validate_date(date_text: str) -> str:
    try:
        datetime.strptime(date_text, "%Y-%m-%d")
    except ValueError as exc:
        raise ValidationError(f"Date '{date_text}' must be in YYYY-MM-DD format.") from exc
    return date_text


def validate_pricing(pricing: Any) -> List[Dict[str, Any]]:
    if not isinstance(pricing, list) or not pricing:
        raise ValidationError("'pricing' must be a non-empty list.")

    parsed: List[Dict[str, Any]] = []
    for idx, tier in enumerate(pricing):
        if not isinstance(tier, dict):
            raise ValidationError(f"Pricing item at index {idx} must be an object.")
        for field in ["tier_name", "currency", "validity_start", "validity_end"]:
            if field not in tier or not isinstance(tier[field], str) or not tier[field].strip():
                raise ValidationError(f"Pricing item {idx} '{field}' must be a non-empty string.")
        if "price_aed" not in tier or not isinstance(tier["price_aed"], (int, float)):
            raise ValidationError(f"Pricing item {idx} 'price_aed' must be numeric.")

        parsed.append(
            {
                "tier_name": tier["tier_name"].strip(),
                "price_aed": round(float(tier["price_aed"]), 2),
                "currency": tier["currency"].strip(),
                "validity_start": _validate_date(tier["validity_start"].strip()),
                "validity_end": _validate_date(tier["validity_end"].strip()),
            }
        )
    return parsed


def validate_product(record: Any) -> Dict[str, Any]:
    if not isinstance(record, dict):
        raise ValidationError("Input must be a JSON object.")

    product = {
        "product_id": _require_str(record, "product_id"),
        "product_name": _require_str(record, "product_name"),
        "supplier_name": _require_str(record, "supplier_name"),
        "destination_city": _require_str(record, "destination_city"),
        "category": _require_str(record, "category"),
        "description_short": _require_str(record, "description_short"),
        "description_long": _require_str(record, "description_long"),
        "duration_hours": _require_number(record, "duration_hours"),
        "inclusions": _require_str_list(record, "inclusions"),
        "exclusions": _require_str_list(record, "exclusions"),
        "pricing": validate_pricing(record.get("pricing")),
        "booking_policy": _require_str(record, "booking_policy"),
    }

    # Preserve any additional metadata fields without trusting types.
    for extra_key, extra_val in record.items():
        if extra_key in product:
            continue
        product[extra_key] = extra_val

    return product


def upsert_product(catalog: List[Dict[str, Any]], product: Dict[str, Any], replace: bool) -> List[Dict[str, Any]]:
    product_id = product["product_id"]
    for idx, existing in enumerate(catalog):
        if existing.get("product_id") == product_id:
            if not replace:
                raise ValidationError(f"Product with id '{product_id}' already exists. Use --replace to overwrite.")
            catalog[idx] = product
            break
    else:
        catalog.append(product)

    return sorted(catalog, key=lambda item: item.get("product_id", ""))


def write_catalog(path: Path, catalog: List[Dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp_path = path.with_suffix(path.suffix + ".tmp")
    tmp_path.write_text(json.dumps(catalog, indent=2, ensure_ascii=False, sort_keys=True), encoding="utf-8")
    tmp_path.replace(path)


def read_input(input_path: Path | None) -> str:
    if input_path:
        return input_path.read_text(encoding="utf-8")
    data = sys.stdin.read()
    if not data.strip():
        raise ValidationError("No input provided. Pass --input or pipe JSON to stdin.")
    return data


def main() -> int:
    args = parse_args()
    try:
        raw = read_input(args.input)
        record = json.loads(raw)
        product = validate_product(record)
        catalog = load_catalog(args.catalog)
        updated = upsert_product(catalog, product, replace=args.replace)
        write_catalog(args.catalog, updated)
    except (ValidationError, json.JSONDecodeError) as exc:
        print(f"[ERROR] {exc}", file=sys.stderr)
        return 1
    except Exception as exc:  # pragma: no cover - defensive
        print(f"[UNEXPECTED] {exc}", file=sys.stderr)
        return 2

    print(f"[OK] Ingested product '{product['product_id']}' into {args.catalog}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
