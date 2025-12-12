# 🛠️ Catalog Management CLI Tool

**File:** `manage.py`  
**Version:** 1.0.0  
**Author:** Senior Systems Engineer  

## Overview

`manage.py` is the unified command-line interface for all catalog management operations. It provides a single entry point for administrative tasks, replacing ad-hoc scripts with a consistent, production-ready tool.

---

## Installation

### Prerequisites
```bash
pip install pydantic
```

### Make Executable (Optional)
```bash
chmod +x manage.py
```

---

## Commands

### 1. `ingest` - Import Products

Import products from JSON or JSONL files into the catalog.

**Usage:**
```bash
python3 manage.py ingest --file <path>
```

**Supported Formats:**

#### JSON Array
```json
[
  {
    "product_id": "Dubai_DesertSafari",
    "product_name": "Desert Safari with BBQ",
    "pricing": [
      {"tier_name": "Adult", "price_aed": 250}
    ],
    "inclusions": ["Pickup", "BBQ Dinner"]
  }
]
```

#### JSONL (JSON Lines)
```jsonl
{"product_id": "Product_001", "product_name": "Product 1", "pricing": [{"tier_name": "Standard", "price_aed": 100}], "inclusions": ["Entry"]}
{"product_id": "Product_002", "product_name": "Product 2", "pricing": [{"tier_name": "Premium", "price_aed": 200}], "inclusions": ["Entry", "Guide"]}
```

**Examples:**
```bash
# Import from JSON file
python3 manage.py ingest --file data/batch1.json

# Import from JSONL file
python3 manage.py ingest --file data/products.jsonl

# Import from remote location
python3 manage.py ingest --file /tmp/new_products.json
```

**Output:**
```
📥 Ingesting 11 product(s) from batch1.json...
✅ Successfully ingested 11 products from batch1.json
```

---

### 2. `stats` - View Statistics

Display comprehensive catalog statistics and metrics.

**Usage:**
```bash
python3 manage.py stats
```

**Output:**
```
📊 Catalog Statistics
============================================================
Total Products:      13
Last Updated:        2025-12-12 14:01:10
Database Size:       17.0 KB
Active Products:     13
Inactive Products:   0

📁 By Category:
  Cultural               5 ( 38.5%)
  Sightseeing            4 ( 30.8%)
  Adventure              2 ( 15.4%)

🌍 By Destination:
  Dubai                  9 ( 69.2%)
  Abu Dhabi              4 ( 30.8%)

🏢 Top Suppliers:
  Museum of the Future             1 (  7.7%)
  Dubai Municipality               1 (  7.7%)

💾 Backups Available: 2
============================================================
```

---

### 3. `backup` - Create Backup

Manually create a timestamped backup of the catalog.

**Usage:**
```bash
python3 manage.py backup
```

**Output:**
```
💾 Creating backup...
✅ Backup created successfully
   Location: /path/to/backups/products_20251212_140051.json
   Size:     16.5 KB
```

---

### 4. `list-backups` - List All Backups

Display all available backups with metadata.

**Usage:**
```bash
python3 manage.py list-backups
```

**Output:**
```
💾 Available Backups (2 total)
================================================================================
Filename                            Created                    Size
--------------------------------------------------------------------------------
products_20251212_135521.json       2025-12-12 12:08:16     16.2 KB
products_20251212_140051.json       2025-12-12 13:55:21     16.5 KB
================================================================================
```

---

### 5. `nuke` - Delete Database

**⚠️ DANGER ZONE:** Permanently delete the catalog database.

**Usage:**
```bash
python3 manage.py nuke
```

**Interactive Mode:**
```
⚠️  WARNING: This will permanently delete the catalog database!
   Location: /path/to/products.json
   Products: 13

Type 'CONFIRM' to proceed with deletion:
> CONFIRM

🗑️  Deleting database...
✅ Database deleted
```

**Non-Interactive:**
```bash
python3 manage.py nuke --yes
```

---

## Quick Reference

```bash
# Import products
python3 manage.py ingest --file data.json

# View statistics
python3 manage.py stats

# Create backup
python3 manage.py backup

# List backups
python3 manage.py list-backups

# Reset database
python3 manage.py nuke
```

---

## Error Handling

### Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Error |
| 130 | Interrupted (Ctrl+C) |

### Common Errors

**File Not Found:**
```
ERROR: File not found: /path/to/file.json
```

**Invalid JSON:**
```
ERROR: Invalid JSON format in file.json:
  Line 5, Column 12: Expecting ',' delimiter
```

**Validation Error:**
```
ERROR: Validation failed during ingestion:
  pricing.0.price_aed must be non-negative
```

**Database Locked:**
```
ERROR: Database is locked by another process
  Please wait 30 seconds and try again
```

---

## Best Practices

1. **Always backup before major changes**
   ```bash
   python3 manage.py backup
   python3 manage.py ingest --file large_import.json
   ```

2. **Check statistics after import**
   ```bash
   python3 manage.py ingest --file data.json
   python3 manage.py stats
   ```

3. **Validate JSON before import**
   ```bash
   jq empty data.json && python3 manage.py ingest --file data.json
   ```

---

**Version:** 1.0.0  
**Last Updated:** December 12, 2025
