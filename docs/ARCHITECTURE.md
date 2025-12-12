# System Architecture

## Overview

Elevate UAE Operations Platform follows Clean Architecture principles with clear separation between backend (Python) and frontend (React).

## Components

### Backend (`src/backend/`)

**Core Library (`lib/`)**
- `catalog_manager.py` - Product catalog management
  - Pydantic validation
  - File locking (concurrency control)
  - Atomic writes
  - Automated backups

**Configuration (`config/`)**
- `settings.py` - Centralized configuration
- Environment variable management
- Path resolution

**API (Future) (`api/`)**
- REST endpoints
- GraphQL schema
- Authentication

### Frontend (`src/frontend/`)

React + TypeScript interface for:
- Product browsing
- Quote calculation
- Booking management
- Script library
- Tour recommendations

### Data (`src/data/`)

- `products.json` - Master catalog (production)
- `backups/` - Automated backups (7-day retention)
- `archive/` - Long-term storage

## Design Decisions

### Why JSON Database?

- **Simplicity:** No external database required
- **Portability:** Easy backup/restore
- **Atomic Operations:** Single-file transactions
- **Version Control:** Changes trackable in Git

### Why File Locking?

- **Concurrency Safety:** Prevents race conditions
- **Process Isolation:** Multiple CLI instances safe
- **Stale Detection:** 30-second timeout

### Why Pydantic?

- **Runtime Validation:** Type safety at data ingestion
- **Schema Evolution:** Easy migrations
- **Documentation:** Self-documenting models

## Data Flow

```
CLI/API Request
    ↓
CatalogManager
    ↓
[Lock Acquisition]
    ↓
Pydantic Validation
    ↓
[Create Backup]
    ↓
Atomic Write (tmp → fsync → replace)
    ↓
[Lock Release]
    ↓
Response
```

## Future Enhancements

- REST API layer (FastAPI)
- PostgreSQL migration path
- Redis caching
- Event streaming
- Elasticsearch integration
- GraphQL endpoint
- WebSocket support
- Multi-tenant architecture

## Testing Strategy

- **Unit Tests:** Individual component validation
- **Integration Tests:** End-to-end workflows
- **Performance Tests:** Benchmarking operations
- **Edge Cases:** Error handling, Unicode, etc.

## Security Considerations

- Environment-based configuration
- No hardcoded credentials
- File-level access control
- Backup encryption (future)
- API authentication (future)

---

**Version:** 2.0.0  
**Last Updated:** 2025-12-12
