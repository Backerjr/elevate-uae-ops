"""
Centralized Configuration Management
Load settings from environment variables with sensible defaults.
"""

import os
from pathlib import Path

# Project Root
PROJECT_ROOT = Path(__file__).resolve().parents[3]

# Environment
APP_ENV = os.getenv('APP_ENV', 'development')
DEBUG = os.getenv('DEBUG', 'true').lower() == 'true'

# Database Configuration
CATALOG_DB_PATH = os.getenv(
    'CATALOG_DB_PATH',
    str(PROJECT_ROOT / 'src' / 'data' / 'products.json')
)
BACKUP_DIR = Path(CATALOG_DB_PATH).parent / 'backups'
BACKUP_RETENTION_DAYS = int(os.getenv('BACKUP_RETENTION_DAYS', '7'))

# File Locking
LOCK_STALE_TIMEOUT = 30  # seconds

# API Configuration (Future)
API_HOST = os.getenv('API_HOST', '0.0.0.0')
API_PORT = int(os.getenv('API_PORT', '8000'))
API_SECRET_KEY = os.getenv('API_SECRET_KEY', 'dev-secret-key-change-in-production')

# Logging
LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
