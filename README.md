# Elevate UAE Operations Platform

**Tourism Operations Management System**  
**Version:** 2.0.0  
**Status:** Production Ready ✅

## Overview

Professional tourism operations platform for managing product catalogs, pricing, bookings, and customer operations across UAE destinations (Dubai, Abu Dhabi, Sharjah).

## Architecture

- **Backend:** Python-based catalog management with Pydantic validation
- **Frontend:** React + TypeScript UI
- **CLI:** Unified `manage.py` tool for operations
- **Database:** JSON-based catalog with atomic writes & backups

## Quick Start

### Installation

```bash
# Clone repository
git clone <repository-url>
cd elevate-uae-ops

# Install Python dependencies
pip install -r requirements.txt

# Install Node dependencies (for frontend)
npm install

# Copy environment template
cp .env.example .env
```

### Usage

```bash
# Import products
python3 manage.py ingest --file data.json

# View statistics
python3 manage.py stats

# Create backup
python3 manage.py backup

# Run tests
python3 -m pytest tests/backend/

# Get help
python3 manage.py --help
```

## Documentation

- **[CLI Guide](docs/CLI_GUIDE.md)** - Command-line tool reference
- **[Test Suite](docs/TEST_SUITE.md)** - Testing documentation
- **[Test Certification](docs/TEST_CERTIFICATION.md)** - Production certification
- **[Legacy Docs](docs/legacy/)** - Historical documentation

## Project Structure

```
elevate-uae-ops/
├── src/
│   ├── backend/        # Python backend (catalog management)
│   ├── frontend/       # React frontend (UI)
│   └── data/           # Product catalog & backups
├── scripts/            # Operational tools & CLI
├── tests/              # Test suite (36 tests, 100% pass)
├── docs/               # Documentation
└── manage.py           # CLI tool entry point
```

## Features

### Core Library
- ✅ Pydantic validation with strict schema enforcement
- ✅ File-level concurrency control (locking)
- ✅ Atomic write operations (crash-safe)
- ✅ Automated backup system (7-day retention)
- ✅ Idempotent upsert operations

### CLI Tool
- ✅ `ingest` - Import products from JSON/JSONL
- ✅ `stats` - View catalog statistics
- ✅ `backup` - Create manual backups
- ✅ `list-backups` - Show all backups
- ✅ `nuke` - Reset database (with confirmation)

### Test Suite
- ✅ 36 tests (100% pass rate)
- ✅ 31 unit tests + 5 integration tests
- ✅ Edge case coverage
- ✅ Performance validated (~0.15s)

## Current Status

**Database:** 12 products across 4 categories  
**Test Coverage:** 100% pass rate  
**Documentation:** Complete  
**Production Ready:** ✅ Certified

## Support

**Documentation:** See `docs/` directory  
**Issues:** File via GitHub Issues  
**CLI Help:** `python3 manage.py --help`

## Commit & Branching Conventions

- Use conventional commit prefixes: `feat`, `fix`, `chore`, `docs`, `test`, `ci`, `build`, `refactor`, `perf`, `revert`.
- Keep subject lines under 72 characters and use imperative mood (e.g., `feat: add booking CTA`).
- Prefer feature branches named `feature/<short-description>` or `fix/<short-description>`; squash-merge to keep history clean.
- Run `npm run lint` and `npm test` (and `npm run format` if you touched frontend code) before opening a PR.

---

**Last Updated:** 2025-12-12  
**Maintained by:** Engineering Team
