#!/usr/bin/env python
# src/scripts/ingest_batch3_culture.py

from __future__ import annotations

import json
import logging
import sys
from json.decoder import JSONDecodeError
from pathlib import Path
from typing import Any, Dict, List

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

# This script lives in: src/scripts/ingest_batch3_culture.py
# Master catalog lives in: src/data/products.json
SCRIPT_PATH = Path(__file__).resolve()
SRC_ROOT = SCRIPT_PATH.parents[1]
PRODUCTS_PATH = SRC_ROOT / "data" / "products.json"
BACKUP_PATH = SRC_ROOT / "data" / "products.backup.json"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)

# ---------------------------------------------------------------------------
# Batch 3 - Segment F (Culture, Museums & Viewing Decks)
# ---------------------------------------------------------------------------

BATCH_DATA: List[Dict[str, Any]] = [
    {
        "product_id": "Dubai_MuseumOfTheFuture",
        "product_name": "Museum of the Future – General Admission",
        "supplier_name": "Museum of the Future",
        "destination_city": "Dubai",
        "category": "Sightseeing",
        "description_short": "Timed-entry ticket to the Museum of the Future with access to all main exhibits.",
        "description_long": "A timed-entry admission ticket to the Museum of the Future, Dubai’s immersive museum showcasing speculative technologies, future environments and interactive stories. Guests explore multiple themed floors covering space, climate, wellness, artificial intelligence and more.",
        "duration_hours": 2,
        "inclusions": ["Timed-entry admission", "Access to all standard exhibits and immersive zones"],
        "exclusions": ["Guided tours unless specified", "Food and beverages", "Merchandise and souvenirs"],
        "pricing": [
            {
                "tier_name": "General Admission – Adult/Child",
                "price_aed": 149,
                "currency": "AED",
                "validity_start": "2025-12-12",
                "validity_end": "2026-12-31",
            }
        ],
        "booking_policy": "Tickets are strictly time-bound and non-refundable. Guests must arrive at the selected time slot. Children must be accompanied by an adult.",
        "source_document": ["Rayna-Travel Desk-Learning Manual_V1.3.docx"],
    },
    {
        "product_id": "Dubai_DubaiFrame",
        "product_name": "Dubai Frame – General Admission",
        "supplier_name": "Dubai Municipality",
        "destination_city": "Dubai",
        "category": "Sightseeing",
        "description_short": "Entry to Dubai Frame with access to sky glass bridge and galleries.",
        "description_long": "General admission ticket to Dubai Frame, featuring museum-style galleries about Dubai’s past and future, elevators to the top sky deck and a glass-floored bridge with panoramic urban views of Old and New Dubai.",
        "duration_hours": 1.5,
        "inclusions": ["Entry to Dubai Frame", "Access to sky bridge and galleries"],
        "exclusions": ["Hotel transfers", "Guided tour", "Food and beverages"],
        "pricing": [
            {
                "tier_name": "Adult – General Admission",
                "price_aed": 55,
                "currency": "AED",
                "validity_start": "2025-12-12",
                "validity_end": "2026-12-31",
            },
            {
                "tier_name": "Child – General Admission",
                "price_aed": 20,
                "currency": "AED",
                "validity_start": "2025-12-12",
                "validity_end": "2026-12-31",
            },
        ],
        "booking_policy": "Children must be accompanied by adults. Tickets are non-refundable once used. Access may be restricted during maintenance or special events.",
        "source_document": ["Rayna-Travel Desk-Learning Manual_V1.3.docx"],
    },
    {
        "product_id": "Dubai_GreenPlanet",
        "product_name": "The Green Planet – Bio-Dome Entry",
        "supplier_name": "Meraas",
        "destination_city": "Dubai",
        "category": "Family",
        "description_short": "Entry to The Green Planet indoor bio-dome with tropical rainforest ecosystem.",
        "description_long": "A general entry ticket to The Green Planet, an enclosed bio-dome recreating a tropical rainforest habitat with over 3,000 plants and animals. Guests walk through multiple levels observing exotic birds, reptiles and lush flora.",
        "duration_hours": 2,
        "inclusions": ["Entry to The Green Planet bio-dome", "Access to all standard viewing levels"],
        "exclusions": ["Animal encounters unless booked", "Hotel transfers", "Food and beverages"],
        "pricing": [
            {
                "tier_name": "Adult – General Entry",
                "price_aed": 140,
                "currency": "AED",
                "validity_start": "2025-12-12",
                "validity_end": "2026-12-31",
            },
            {
                "tier_name": "Child – General Entry",
                "price_aed": 120,
                "currency": "AED",
                "validity_start": "2025-12-12",
                "validity_end": "2026-12-31",
            },
        ],
        "booking_policy": "Children must be supervised at all times. Some areas may restrict flash photography. Tickets are non-refundable once used.",
        "source_document": ["Rayna-Travel Desk-Learning Manual_V1.3.docx"],
    },
    {
        "product_id": "Dubai_SkyViewsObservatory",
        "product_name": "Sky Views Observatory – Glass Slide & Edge Walk",
        "supplier_name": "Emaar",
        "destination_city": "Dubai",
        "category": "Adventure",
        "description_short": "Access to Sky Views Observatory with glass slide ride and optional edge walk.",
        "description_long": "A ticket to Sky Views Observatory located at Address Sky View, including access to the observation deck and one ride on the iconic glass slide. Guests may upgrade to add the Edge Walk experience for a hands-free outdoor walk on the tower’s ledge.",
        "duration_hours": 1.5,
        "inclusions": ["Access to Sky Views Observatory deck", "One glass slide ride (per ticket)"],
        "exclusions": ["Edge Walk unless selected", "Hotel transfers", "Food and beverages"],
        "pricing": [
            {
                "tier_name": "Observatory + Glass Slide",
                "price_aed": 85,
                "currency": "AED",
                "validity_start": "2025-12-12",
                "validity_end": "2026-12-31",
            },
            {
                "tier_name": "Edge Walk Upgrade",
                "price_aed": 504,
                "currency": "AED",
                "validity_start": "2025-12-12",
                "validity_end": "2026-12-31",
            },
        ],
        "booking_policy": "Edge Walk has strict height, weight and health restrictions. Guests must sign a waiver. Tickets are non-refundable after issuance.",
        "source_document": ["Rayna-Travel Desk-Learning Manual_V1.3.docx"],
    },
    {
        "product_id": "Dubai_AinDubai",
        "product_name": "Ain Dubai – Observation Wheel Experience",
        "supplier_name": "Bluewaters / Ain Dubai",
        "destination_city": "Dubai",
        "category": "Sightseeing",
        "description_short": "Observation wheel ride on Ain Dubai with enclosed air-conditioned cabins.",
        "description_long": "An observation experience on Ain Dubai, the giant wheel at Bluewaters Island, offering 360-degree views of the Dubai Marina skyline, Palm Jumeirah and JBR. Guests ride in shared, air-conditioned cabins with options for premium and private cabins.",
        "duration_hours": 0.75,
        "inclusions": ["One standard rotation on Ain Dubai", "Shared air-conditioned cabin"],
        "exclusions": ["Private cabin unless upgraded", "Food and beverages", "Hotel transfers"],
        "pricing": [
            {
                "tier_name": "Standard View – Shared Cabin",
                "price_aed": 130,
                "currency": "AED",
                "validity_start": "2025-12-12",
                "validity_end": "2026-12-31",
            },
            {
                "tier_name": "Premium View – Shared Cabin",
                "price_aed": 180,
                "currency": "AED",
                "validity_start": "2025-12-12",
                "validity_end": "2026-12-31",
            },
        ],
        "booking_policy": "Operational schedules may vary and are weather-dependent. Guests should arrive 30 minutes before departure. Tickets are non-refundable after issuance.",
        "source_document": ["Rayna-Travel Desk-Learning Manual_V1.3.docx"],
    },
    {
        "product_id": "AbuDhabi_EtihadTowerObservationDeck",
        "product_name": "Etihad Tower Observation Deck at 300",
        "supplier_name": "Etihad Towers",
        "destination_city": "Abu Dhabi",
        "category": "Sightseeing",
        "description_short": "Access to Observation Deck at 300 with panoramic Corniche views.",
        "description_long": "An admission ticket to Observation Deck at 300 located in Etihad Towers, offering elevated views of Abu Dhabi’s Corniche, Emirates Palace and the Arabian Gulf. Some tickets include a credit towards refreshments.",
        "duration_hours": 1.5,
        "inclusions": ["Observation deck entry"],
        "exclusions": ["Food and beverages unless credit included", "Hotel transfers"],
        "pricing": [
            {
                "tier_name": "General Admission",
                "price_aed": 95,
                "currency": "AED",
                "validity_start": "2025-12-12",
                "validity_end": "2026-12-31",
            }
        ],
        "booking_policy": "Dress code smart casual. Tickets may include partial F&B credit depending on contracted type. Non-refundable once used.",
        "source_document": ["Rayna-Travel Desk-Learning Manual_V1.3.docx"],
    },
    {
        "product_id": "AbuDhabi_QasrAlWatan",
        "product_name": "Qasr Al Watan – Presidential Palace Tour",
        "supplier_name": "Qasr Al Watan",
        "destination_city": "Abu Dhabi",
        "category": "Cultural",
        "description_short": "Entry to Qasr Al Watan with access to palace halls and gardens.",
        "description_long": "A cultural visit to Qasr Al Watan, the Presidential Palace of the UAE, showcasing grand halls, detailed Arabian architecture, exhibitions on governance, and manicured palace gardens. Evening shows may be available on selected days.",
        "duration_hours": 2,
        "inclusions": ["Palace and garden access", "Entry to exhibitions and great hall"],
        "exclusions": ["Hotel transfers", "Guided tour unless specified", "Meals and beverages"],
        "pricing": [
            {
                "tier_name": "Adult – Palace Entry",
                "price_aed": 65,
                "currency": "AED",
                "validity_start": "2025-12-12",
                "validity_end": "2026-12-31",
            },
            {
                "tier_name": "Child – Palace Entry",
                "price_aed": 30,
                "currency": "AED",
                "validity_start": "2025-12-12",
                "validity_end": "2026-12-31",
            },
        ],
        "booking_policy": "Modest clothing required (shoulders and knees covered). Security screening applies at entry. Tickets are non-refundable once used.",
        "source_document": ["Rayna-Travel Desk-Learning Manual_V1.3.docx"],
    },
    {
        "product_id": "AbuDhabi_Louvre",
        "product_name": "Louvre Abu Dhabi – General Admission",
        "supplier_name": "Louvre Abu Dhabi",
        "destination_city": "Abu Dhabi",
        "category": "Cultural",
        "description_short": "General admission to Louvre Abu Dhabi with access to permanent galleries and dome plaza.",
        "description_long": "An admission ticket to Louvre Abu Dhabi, a world-class art and civilization museum located on Saadiyat Island. Guests explore permanent collections, temporary exhibitions, the iconic floating dome and waterfront promenades.",
        "duration_hours": 3,
        "inclusions": ["General admission to Louvre Abu Dhabi", "Access to permanent galleries and main dome plaza"],
        "exclusions": ["Audio guide unless rented", "Meals and beverages", "Hotel transfers"],
        "pricing": [
            {
                "tier_name": "Adult – General Admission",
                "price_aed": 63,
                "currency": "AED",
                "validity_start": "2025-12-12",
                "validity_end": "2026-12-31",
            }
        ],
        "booking_policy": "Children and youth under certain ages may enter free depending on the policy. Tickets are non-refundable once used.",
        "source_document": ["Rayna-Travel Desk-Learning Manual_V1.3.docx"],
    },
    {
        "product_id": "AbuDhabi_SheikhZayedMosqueGuided",
        "product_name": "Sheikh Zayed Grand Mosque – Guided Visit",
        "supplier_name": "Local Mosque Authority / Tours",
        "destination_city": "Abu Dhabi",
        "category": "Cultural",
        "description_short": "Guided tour of Sheikh Zayed Grand Mosque with explanations of architecture and Islamic culture.",
        "description_long": "A guided visit to Sheikh Zayed Grand Mosque, one of the world’s largest mosques, featuring white marble domes, intricate floral inlays, chandeliers and reflective pools. The guide explains mosque etiquette, architectural symbols and Islamic traditions.",
        "duration_hours": 1.5,
        "inclusions": ["Mosque entry", "Live guide commentary"],
        "exclusions": ["Abaya rental if required", "Hotel transfers unless specified", "Meals and beverages"],
        "pricing": [
            {
                "tier_name": "Guided Visit – Per Person",
                "price_aed": 50,
                "currency": "AED",
                "validity_start": "2025-12-12",
                "validity_end": "2026-12-31",
            }
        ],
        "booking_policy": "Strict dress code applies (modest clothing, headscarf for women). Mosque access may be restricted during prayer times and official events. Tickets are non-refundable once used.",
        "source_document": ["Rayna-Travel Desk-Learning Manual_V1.3.docx"],
    },
    {
        "product_id": "Dubai_EtihadMuseum",
        "product_name": "Etihad Museum – General Entry",
        "supplier_name": "Etihad Museum",
        "destination_city": "Dubai",
        "category": "Cultural",
        "description_short": "Entry to Etihad Museum focusing on UAE unification history and founding leaders.",
        "description_long": "A museum entry ticket to Etihad Museum in Dubai, documenting the story of the UAE’s formation, the 1971 union, and the lives of the founding fathers through interactive exhibits, archives and multimedia installations.",
        "duration_hours": 2,
        "inclusions": ["Museum admission", "Access to all permanent exhibits"],
        "exclusions": ["Guided tours", "Hotel transfers", "Food and beverages"],
        "pricing": [
            {
                "tier_name": "Adult – General Entry",
                "price_aed": 25,
                "currency": "AED",
                "validity_start": "2025-12-12",
                "validity_end": "2026-12-31",
            }
        ],
        "booking_policy": "Tickets are non-refundable after use. Modest clothing recommended. Operating hours may change on public holidays.",
        "source_document": ["Rayna-Travel Desk-Learning Manual_V1.3.docx"],
    },
    {
        "product_id": "Dubai_AlFahidiDubaiMuseum",
        "product_name": "Al Fahidi Historical District & Dubai Museum Visit",
        "supplier_name": "Local Heritage Operator",
        "destination_city": "Dubai",
        "category": "Cultural",
        "description_short": "Self-guided exploration of Al Fahidi Historical District combined with entry to Dubai Museum or equivalent heritage exhibit.",
        "description_long": "A cultural experience around Al Fahidi Historical District, with its restored wind-tower houses, narrow lanes and courtyards, combined with entry to the historical museum or equivalent heritage exhibit detailing Dubai’s past as a trading port and pearl-diving center.",
        "duration_hours": 2.5,
        "inclusions": ["Entry to the heritage museum/exhibit", "Access to Al Fahidi historical walking area"],
        "exclusions": ["Guided walking tour unless specified", "Hotel transfers", "Meals and beverages"],
        "pricing": [
            {
                "tier_name": "Per Person – Museum Entry",
                "price_aed": 10,
                "currency": "AED",
                "validity_start": "2025-12-12",
                "validity_end": "2026-12-31",
            }
        ],
        "booking_policy": "Some heritage buildings may have varying schedules. Tickets are low-cost and non-refundable after use. Modest clothing is recommended during cultural visits.",
        "source_document": ["Rayna-Travel Desk-Learning Manual_V1.3.docx"],
    },
]

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def load_products(path: Path) -> List[Dict[str, Any]]:
    """Load existing products.json. Return empty list if file missing."""
    if not path.exists():
        logging.warning("Master catalog not found at %s. Starting with an empty list.", path)
        return []

    try:
        with path.open("r", encoding="utf-8") as f:
            data = json.load(f)
    except JSONDecodeError as e:
        logging.error("Failed to parse JSON from %s: %s", path, e)
        sys.exit(1)
    except OSError as e:
        logging.error("I/O error while reading %s: %s", path, e)
        sys.exit(1)

    if not isinstance(data, list):
        logging.error("Expected a list in %s but got %s", path, type(data).__name__)
        sys.exit(1)

    logging.info("Loaded %d existing products from %s", len(data), path)
    return data


def backup_products(src: Path, dest: Path) -> None:
    """Create a simple JSON backup copy of the current products file."""
    if not src.exists():
        logging.info("No existing catalog at %s, skipping backup.", src)
        return

    try:
        text = src.read_text(encoding="utf-8")
        dest.write_text(text, encoding="utf-8")
        logging.info("Backup created at %s", dest)
    except OSError as e:
        # Non-fatal: log and continue
        logging.warning("Failed to create backup %s: %s", dest, e)


def upsert_batch(
    existing_products: List[Dict[str, Any]],
    batch: List[Dict[str, Any]],
) -> List[Dict[str, Any]]:
    """
    Idempotent upsert by product_id.

    - If product_id exists: replace old entry with batch version.
    - If product_id does not exist: append new entry.
    - Result: unique product_id across entire list.
    """
    index_by_id: Dict[str, Dict[str, Any]] = {}

    # Index current products
    for prod in existing_products:
        pid = prod.get("product_id")
        if not pid:
            logging.warning("Skipping product without product_id: %r", prod)
            continue
        index_by_id[pid] = prod

    # Apply batch (replace or insert)
    for prod in batch:
        pid = prod.get("product_id")
        if not pid:
            logging.warning("Skipping batch entry without product_id: %r", prod)
            continue

        if pid in index_by_id:
            logging.info("Updating existing product_id=%s", pid)
        else:
            logging.info("Inserting new product_id=%s", pid)

        index_by_id[pid] = prod

    merged = list(index_by_id.values())
    logging.info(
        "Upsert complete. Total products after merge: %d (batch size: %d)",
        len(merged),
        len(batch),
    )
    return merged


def save_products(path: Path, products: List[Dict[str, Any]]) -> None:
    """Write the merged product list back to products.json."""
    try:
        with path.open("w", encoding="utf-8") as f:
            json.dump(products, f, ensure_ascii=False, indent=2)
        logging.info("Updated master catalog written to %s", path)
    except OSError as e:
        logging.error("Failed to write catalog to %s: %s", path, e)
        sys.exit(1)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    logging.info("Starting Batch 3 - Segment F ingestion into %s", PRODUCTS_PATH)

    existing = load_products(PRODUCTS_PATH)
    backup_products(PRODUCTS_PATH, BACKUP_PATH)
    merged = upsert_batch(existing, BATCH_DATA)
    save_products(PRODUCTS_PATH, merged)

    logging.info("Ingestion completed successfully.")


if __name__ == "__main__":
    main()
