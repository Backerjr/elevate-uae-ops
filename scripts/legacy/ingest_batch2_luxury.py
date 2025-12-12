#!/usr/bin/env python3
"""
Ingest "Batch 2" (Luxury & Adventure Camp Upgrades) JSONL records into the master catalog.

Defaults:
  - Uses the embedded JSONL payload BATCH_DATA below.
  - Writes to src/data/products.json relative to the repo root.

Behavior:
  - Validates each JSON line independently.
  - Upserts by product_id (refuse overwrite unless --replace is supplied).
  - Can optionally read JSONL from --input (file) instead of the embedded data.
  - Supports --dry-run to preview changes without writing.
"""

from __future__ import annotations

import argparse
import json
import sys
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Tuple

# Embedded Batch 2 data (validated upstream). Format: JSON Lines.
BATCH_DATA = '''{"product_id": "RaynaTours_VIPMajlisSharing", "product_name": "VIP Majlis \u2013 Sharing", "supplier_name": "Rayna Tours", "destination_city": "Dubai", "category": "Luxury", "description_short": "Shared VIP Majlis seating upgrade at Rayna\u2019s desert camp with premium comfort.", "description_long": "An upgraded seating experience at the desert camp offering premium cushions, enhanced comfort and a designated VIP area. Guests share the VIP Majlis section with other premium customers. Ideal for travelers who want a more exclusive ambiance than standard camp seating.", "duration_hours": null, "inclusions": ["Access to VIP seating area", "Premium seating set-up"], "exclusions": ["Food served at table (available separately)", "Private Majlis section", "Alcohol"], "pricing": [{"tier_name": "VIP Majlis \u2013 Sharing (Per Person)", "price_aed": 30, "currency": "AED", "validity_start": "2025-12-12", "validity_end": "2026-12-31"}], "booking_policy": "Seats are shared with other guests. Upgrade is non-refundable once redeemed. Availability is subject to camp occupancy.", "source_document": ["Rayna-Travel Desk-Learning Manual_V1.3.docx"]}
{"product_id": "RaynaTours_VIPMajlisPrivate", "product_name": "VIP Majlis \u2013 Private", "supplier_name": "Rayna Tours", "destination_city": "Dubai", "category": "Luxury", "description_short": "Private VIP Majlis seating with exclusive lounge-style comfort at the desert camp.", "description_long": "A fully private VIP Majlis arrangement reserved exclusively for the guest\u2019s group. This premium setup includes a more secluded space, upscale seating and an elevated level of comfort, ideal for families, couples and small groups seeking privacy within the camp environment.", "duration_hours": null, "inclusions": ["Private Majlis seating area", "Premium cushions and d\u00e9cor"], "exclusions": ["Food served at table (available separately)", "Alcoholic beverages"], "pricing": [{"tier_name": "VIP Majlis \u2013 Private (Per Group)", "price_aed": 150, "currency": "AED", "validity_start": "2025-12-12", "validity_end": "2026-12-31"}], "booking_policy": "Reserved exclusively per group. Non-refundable after confirmation unless canceled 24 hours before. Subject to availability.", "source_document": ["Rayna-Travel Desk-Learning Manual_V1.3.docx"]}
{"product_id": "RaynaTours_ShishaAtTable", "product_name": "Shisha at Table \u2013 Premium Upgrade", "supplier_name": "Rayna Tours", "destination_city": "Dubai", "category": "Culinary", "description_short": "Premium flavored shisha served directly at the guest\u2019s table at the camp.", "description_long": "An upgraded shisha service where premium flavored hookah is brought to the guest\u2019s Majlis seating table instead of using the standard shisha area. Provides added comfort and convenience for guests who prefer private or relaxed use within their seating zone.", "duration_hours": null, "inclusions": ["Premium flavored shisha served at table"], "exclusions": ["Multiple refills (additional charges may apply)", "VIP Majlis unless purchased"], "pricing": [{"tier_name": "Shisha at Table \u2013 Per Shisha", "price_aed": 50, "currency": "AED", "validity_start": "2025-12-12", "validity_end": "2026-12-31"}], "booking_policy": "Only permitted in designated seating areas. Guests must follow safety rules. Non-refundable once prepared.", "source_document": ["Rayna-Travel Desk-Learning Manual_V1.3.docx"]}
{"product_id": "RaynaTours_AlcoholCoupons", "product_name": "Alcohol Coupons", "supplier_name": "Rayna Tours", "destination_city": "Dubai", "category": "Culinary", "description_short": "Alcoholic beverage coupon redeemable at the desert camp bar.", "description_long": "Guests may purchase alcohol coupons that can be exchanged for selected alcoholic beverages at Rayna\u2019s camp bar, subject to availability and UAE regulations. Commonly redeemed for beer or house spirits as per the camp\u2019s menu.", "duration_hours": null, "inclusions": ["One alcoholic beverage coupon"], "exclusions": ["Multiple drinks unless more coupons purchased", "Premium branded alcohol"], "pricing": [{"tier_name": "1 Alcohol Coupon", "price_aed": 40, "currency": "AED", "validity_start": "2025-12-12", "validity_end": "2026-12-31"}], "booking_policy": "Only adults above legal drinking age can redeem coupons. Non-refundable once purchased. Alcohol service may be restricted on dry days.", "source_document": ["Rayna-Travel Desk-Learning Manual_V1.3.docx"]}
{"product_id": "RaynaTours_PremiumFoodUpgrade", "product_name": "Premium Dining Upgrade", "supplier_name": "Rayna Tours", "destination_city": "Dubai", "category": "Culinary", "description_short": "Upgrade from standard buffet to premium dining with enhanced BBQ and live grill selection.", "description_long": "A dining upgrade offering higher-quality dishes, enhanced live BBQ grill options and additional menu items compared to the standard safari buffet. Designed for guests who prefer a more refined culinary offering during the safari evening experience.", "duration_hours": null, "inclusions": ["Premium dinner menu", "Enhanced BBQ selection", "Live grill items"], "exclusions": ["VIP seating (sold separately)", "Alcoholic drinks"], "pricing": [{"tier_name": "Premium Dinner Upgrade \u2013 Per Person", "price_aed": 30, "currency": "AED", "validity_start": "2025-12-12", "validity_end": "2026-12-31"}], "booking_policy": "Upgrade applies to one evening dining session. Non-refundable once meal is prepared.", "source_document": ["Rayna-Travel Desk-Learning Manual_V1.3.docx"]}
{"product_id": "RaynaTours_FalconPhoto", "product_name": "Falcon Photo Experience", "supplier_name": "Rayna Tours", "destination_city": "Dubai", "category": "Cultural", "description_short": "Photo opportunity with a trained desert falcon inside the camp.", "description_long": "Guests can hold or pose with a trained falcon for a souvenir photo during the safari camp experience. The activity is managed by a professional falcon handler and typically takes place near a designated photo area.", "duration_hours": null, "inclusions": ["Falcon handling assistance", "Photo opportunity with falcon"], "exclusions": ["Printed photos (if offered separately)", "Hotel transfers"], "pricing": [{"tier_name": "Falcon Photo \u2013 Per Person", "price_aed": 10, "currency": "AED", "validity_start": "2025-12-12", "validity_end": "2026-12-31"}], "booking_policy": "Guests must follow handler instructions when holding the falcon. Non-refundable once performed.", "source_document": ["Rayna-Travel Desk-Learning Manual_V1.3.docx"]}
{"product_id": "RaynaTours_PhotoshootPackage", "product_name": "Professional Desert Photoshoot", "supplier_name": "Rayna Tours", "destination_city": "Dubai", "category": "Luxury", "description_short": "Professional photoshoot service at the desert camp with digital delivery options.", "description_long": "A premium photography service where a camp photographer takes curated photos of guests around scenic desert angles and designated photo spots. Edited images are delivered digitally or through printed packages depending on availability.", "duration_hours": null, "inclusions": ["Photographer service", "Multiple posed and candid shots"], "exclusions": ["Printed photos unless purchased", "Video packages unless offered"], "pricing": [{"tier_name": "Photoshoot Package \u2013 Base Rate", "price_aed": 20, "currency": "AED", "validity_start": "2025-12-12", "validity_end": "2026-12-31"}], "booking_policy": "Guests receive only the purchased photo count. Additional photos may require extra payment. Non-refundable once session begins.", "source_document": ["Rayna-Travel Desk-Learning Manual_V1.3.docx"]}
{"product_id": "RaynaTours_QuadBikeExperience", "product_name": "Quad Bike Desert Experience", "supplier_name": "Rayna Tours", "destination_city": "Dubai", "category": "Adventure", "description_short": "Quad bike self-drive experience in the Dubai desert with multiple duration and vehicle configurations.", "description_long": "A self-drive quad biking adventure offered at Rayna\u2019s desert camp area. Guests can choose between single or double quad bikes for either a 30-minute or 60-minute session. The activity is supervised by trained marshals and conducted in a designated safe riding zone separate from the main camp. Safety gear is provided and riders receive basic operation instructions before starting the experience.", "duration_hours": null, "inclusions": ["Safety briefing and instructions", "Helmet and basic protective gear", "Supervised quad biking in a designated desert zone", "Option for single or double bike"], "exclusions": ["Hotel transfers unless purchased with a safari", "Food and beverages", "Extended riding time beyond selected duration"], "pricing": [{"tier_name": "Quad Bike Single \u2013 30 Minutes", "price_aed": 150, "currency": "AED", "validity_start": "2025-12-12", "validity_end": "2026-12-31"}, {"tier_name": "Quad Bike Single \u2013 60 Minutes"""}'''

DEFAULT_CATALOG_PATH = Path(__file__).resolve().parents[1] / "data" / "products.json"


class ValidationError(Exception):
    """Raised when batch ingestion encounters invalid data."""


@dataclass
class Args:
    input: Path | None
    catalog: Path
    replace: bool
    dry_run: bool


def parse_args() -> Args:
    parser = argparse.ArgumentParser(description="Ingest Batch 2 JSONL records into the catalog.")
    parser.add_argument(
        "--input",
        type=Path,
        help="Optional path to JSONL file. If omitted, uses embedded BATCH_DATA.",
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
        help="Allow replacing existing product_ids instead of failing.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Validate and show summary without writing to disk.",
    )
    ns = parser.parse_args()
    return Args(input=ns.input, catalog=ns.catalog, replace=ns.replace, dry_run=ns.dry_run)


def load_catalog(path: Path) -> List[Dict[str, Any]]:
    if not path.exists():
        return []
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise ValidationError(f"Catalog file is not valid JSON: {exc}") from exc
    if not isinstance(data, list):
        raise ValidationError("Catalog file must be a JSON array.")
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
        "duration_hours": record.get("duration_hours"),
        "inclusions": _require_str_list(record, "inclusions"),
        "exclusions": _require_str_list(record, "exclusions"),
        "pricing": validate_pricing(record.get("pricing")),
        "booking_policy": _require_str(record, "booking_policy"),
    }

    for extra_key, extra_val in record.items():
        if extra_key in product:
            continue
        product[extra_key] = extra_val

    return product


def read_batch_lines(path: Path | None) -> List[str]:
    if path:
        return path.read_text(encoding="utf-8").splitlines()
    return BATCH_DATA.splitlines()


def parse_batch(lines: List[str]) -> Tuple[List[Dict[str, Any]], List[str]]:
    products: List[Dict[str, Any]] = []
    errors: List[str] = []

    for idx, raw_line in enumerate(lines, start=1):
        line = raw_line.strip()
        if not line:
            continue
        try:
            obj = json.loads(line)
            product = validate_product(obj)
            products.append(product)
        except (json.JSONDecodeError, ValidationError) as exc:
            errors.append(f"Line {idx}: {exc}")
    return products, errors


def upsert_products(catalog: List[Dict[str, Any]], batch: List[Dict[str, Any]], replace: bool) -> Tuple[List[Dict[str, Any]], int, int]:
    added = 0
    replaced = 0
    catalog_by_id = {item.get("product_id"): item for item in catalog if "product_id" in item}

    for product in batch:
        pid = product["product_id"]
        if pid in catalog_by_id:
            if not replace:
                raise ValidationError(f"Product '{pid}' already exists. Use --replace to overwrite.")
            catalog_by_id[pid] = product
            replaced += 1
        else:
            catalog_by_id[pid] = product
            added += 1

    merged = sorted(catalog_by_id.values(), key=lambda item: item.get("product_id", ""))
    return merged, added, replaced


def write_catalog(path: Path, catalog: List[Dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp_path = path.with_suffix(path.suffix + ".tmp")
    tmp_path.write_text(json.dumps(catalog, indent=2, ensure_ascii=False, sort_keys=True), encoding="utf-8")
    tmp_path.replace(path)


def main() -> int:
    args = parse_args()

    lines = read_batch_lines(args.input)
    batch, errors = parse_batch(lines)

    if errors:
        for err in errors:
            print(f"[SKIP] {err}", file=sys.stderr)

    if not batch:
        print("[ERROR] No valid products parsed from batch input.", file=sys.stderr)
        return 1

    try:
        catalog = load_catalog(args.catalog)
        updated_catalog, added, replaced = upsert_products(catalog, batch, replace=args.replace)
    except ValidationError as exc:
        print(f"[ERROR] {exc}", file=sys.stderr)
        return 1
    except Exception as exc:  # pragma: no cover - defensive
        print(f"[UNEXPECTED] {exc}", file=sys.stderr)
        return 2

    if args.dry_run:
        print(f"[DRY-RUN] Parsed={len(batch)} Added={added} Replaced={replaced} Catalog would become {len(updated_catalog)} items.")
        return 0

    write_catalog(args.catalog, updated_catalog)
    print(f"[OK] Ingested batch: parsed={len(batch)} added={added} replaced={replaced} catalog_size={len(updated_catalog)} -> {args.catalog}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
