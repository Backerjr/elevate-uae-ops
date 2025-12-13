import json
import os
import shutil
import glob
import time
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from contextlib import contextmanager
from pydantic import BaseModel, Field, field_validator, ValidationError


class PricingTier(BaseModel):
    tier_name: str
    price_aed: float
    currency: str = "AED"
    validity_start: Optional[str] = None
    validity_end: Optional[str] = None

    @field_validator('price_aed')
    @classmethod
    def validate_price(cls, v):
        if v < 0:
            raise ValueError('price_aed must be non-negative')
        return v


class Product(BaseModel):
    product_id: str
    product_name: str
    pricing: List[PricingTier]
    inclusions: List[str]
    active: bool = True
    supplier_name: Optional[str] = None
    destination_city: Optional[str] = None
    category: Optional[str] = None
    description_short: Optional[str] = None
    description_long: Optional[str] = None
    duration_hours: Optional[float] = None
    exclusions: Optional[List[str]] = None
    booking_policy: Optional[str] = None
    source_document: Optional[List[str]] = None

    @field_validator('pricing')
    @classmethod
    def validate_pricing(cls, v):
        if v is None:
            return []
        if len(v) == 0:
            return []
        return [PricingTier(**tier) if isinstance(tier, dict) else tier for tier in v]


class CatalogLock:
    STALE_LOCK_SECONDS = 30

    def __init__(self, db_path: str):
        self.db_path = db_path
        self.lock_path = f"{db_path}.lock"
        self.lock_acquired = False

    def __enter__(self):
        if os.path.exists(self.lock_path):
            lock_age = time.time() - os.path.getmtime(self.lock_path)
            if lock_age < self.STALE_LOCK_SECONDS:
                raise BlockingIOError(f"Database is locked by another process")
            os.remove(self.lock_path)

        with open(self.lock_path, 'w') as f:
            f.write(str(os.getpid()))
        self.lock_acquired = True
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.lock_acquired and os.path.exists(self.lock_path):
            os.remove(self.lock_path)
        return False


class CatalogManager:
    def __init__(self, db_path: str):
        self.db_path = db_path
        self.backup_dir = os.path.join(os.path.dirname(db_path), 'backups')
        os.makedirs(self.backup_dir, exist_ok=True)

    def _create_backup(self) -> Optional[str]:
        if not os.path.exists(self.db_path):
            return None

        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_path = os.path.join(self.backup_dir, f"products_{timestamp}.json")
        shutil.copy2(self.db_path, backup_path)
        return backup_path

    def _cleanup_old_backups(self, days: int = 7):
        cutoff = datetime.now() - timedelta(days=days)
        pattern = os.path.join(self.backup_dir, 'products_*.json')
        
        for backup_file in glob.glob(pattern):
            try:
                file_time = datetime.fromtimestamp(os.path.getmtime(backup_file))
                if file_time < cutoff:
                    os.remove(backup_file)
            except (OSError, ValueError):
                pass

    def _load_data(self) -> List[Dict[str, Any]]:
        if not os.path.exists(self.db_path):
            return []
        
        with open(self.db_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return data if isinstance(data, list) else []

    def _save_data(self, products: List[Dict[str, Any]]):
        tmp_path = f"{self.db_path}.tmp"
        
        with open(tmp_path, 'w', encoding='utf-8') as f:
            json.dump(products, f, indent=2, ensure_ascii=False)
            f.flush()
            os.fsync(f.fileno())
        
        os.replace(tmp_path, self.db_path)

    def upsert_batch(self, new_products: List[Dict[str, Any]]) -> int:
        validated_products = []
        for idx, product_data in enumerate(new_products):
            try:
                product = Product(**product_data)
                validated_products.append(product.model_dump())
            except ValidationError as e:
                product_id = product_data.get('product_id', f'index_{idx}')
                raise ValidationError.from_exception_data(
                    title=f"Validation failed for product: {product_id}",
                    line_errors=e.errors()
                )

        with CatalogLock(self.db_path):
            self._create_backup()
            
            existing_data = self._load_data()
            product_dict = {p['product_id']: p for p in existing_data}
            
            for product in validated_products:
                product_dict[product['product_id']] = product
            
            updated_list = list(product_dict.values())
            self._save_data(updated_list)
            
            self._cleanup_old_backups()
        
        return len(validated_products)
