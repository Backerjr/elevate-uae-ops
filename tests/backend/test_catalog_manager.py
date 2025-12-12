#!/usr/bin/env python3

import unittest
import json
import os
import sys
import tempfile
import shutil
import time
from pathlib import Path
from unittest.mock import patch, MagicMock, mock_open
from datetime import datetime, timedelta

project_root = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(project_root / 'src'))

from backend.lib.catalog_manager import CatalogManager, CatalogLock, Product, ValidationError


class TestCatalogManagerInitialization(unittest.TestCase):
    """Test suite for CatalogManager initialization and setup."""
    
    def setUp(self):
        self.temp_dir = tempfile.mkdtemp()
        self.db_path = os.path.join(self.temp_dir, 'products.json')
        self.manager = CatalogManager(db_path=self.db_path)
    
    def tearDown(self):
        if os.path.exists(self.temp_dir):
            shutil.rmtree(self.temp_dir)
    
    def test_creates_backup_directory(self):
        """Test that backup directory is created during initialization."""
        backup_dir = os.path.join(self.temp_dir, 'backups')
        self.assertTrue(os.path.exists(backup_dir))
        self.assertTrue(os.path.isdir(backup_dir))
    
    def test_handles_nonexistent_database(self):
        """Test that manager handles non-existent database gracefully."""
        data = self.manager._load_data()
        self.assertEqual(data, [])
        self.assertIsInstance(data, list)


class TestCatalogManagerAtomicWrites(unittest.TestCase):
    """Test suite for atomic write operations."""
    
    def setUp(self):
        self.temp_dir = tempfile.mkdtemp()
        self.db_path = os.path.join(self.temp_dir, 'products.json')
        self.manager = CatalogManager(db_path=self.db_path)
    
    def tearDown(self):
        if os.path.exists(self.temp_dir):
            shutil.rmtree(self.temp_dir)
    
    def test_writes_to_temp_file_first(self):
        """Test that data is written to .tmp file before final file."""
        test_data = [{"product_id": "TEST_001", "name": "Test Product"}]
        
        with patch('os.replace') as mock_replace:
            self.manager._save_data(test_data)
            
            tmp_path = f"{self.db_path}.tmp"
            mock_replace.assert_called_once_with(tmp_path, self.db_path)
    
    def test_atomic_replace_operation(self):
        """Test that os.replace is used for atomic swap."""
        test_data = [{"product_id": "TEST_001", "name": "Test Product"}]
        
        self.manager._save_data(test_data)
        
        self.assertTrue(os.path.exists(self.db_path))
        self.assertFalse(os.path.exists(f"{self.db_path}.tmp"))
        
        with open(self.db_path, 'r') as f:
            saved_data = json.load(f)
        self.assertEqual(saved_data, test_data)
    
    def test_fsync_called_during_save(self):
        """Test that fsync is called to ensure data persistence."""
        test_data = [{"product_id": "TEST_001"}]
        
        with patch('os.fsync') as mock_fsync:
            self.manager._save_data(test_data)
            self.assertTrue(mock_fsync.called)


class TestCatalogLocking(unittest.TestCase):
    """Test suite for file locking mechanism."""
    
    def setUp(self):
        self.temp_dir = tempfile.mkdtemp()
        self.db_path = os.path.join(self.temp_dir, 'products.json')
        self.lock_path = f"{self.db_path}.lock"
    
    def tearDown(self):
        if os.path.exists(self.temp_dir):
            shutil.rmtree(self.temp_dir)
    
    def test_creates_lock_file(self):
        """Test that lock file is created when acquiring lock."""
        with CatalogLock(self.db_path):
            self.assertTrue(os.path.exists(self.lock_path))
    
    def test_removes_lock_file_on_exit(self):
        """Test that lock file is removed when context exits."""
        with CatalogLock(self.db_path):
            pass
        self.assertFalse(os.path.exists(self.lock_path))
    
    def test_raises_blocking_error_on_active_lock(self):
        """Test that BlockingIOError is raised when lock is active."""
        with open(self.lock_path, 'w') as f:
            f.write(str(os.getpid()))
        
        time.sleep(0.1)
        
        with self.assertRaises(BlockingIOError) as context:
            with CatalogLock(self.db_path):
                pass
        
        self.assertIn("locked", str(context.exception).lower())
        
        os.remove(self.lock_path)
    
    def test_overrides_stale_lock(self):
        """Test that stale locks (>30s old) are automatically removed."""
        with open(self.lock_path, 'w') as f:
            f.write("12345")
        
        old_time = time.time() - 35
        os.utime(self.lock_path, (old_time, old_time))
        
        with CatalogLock(self.db_path):
            self.assertTrue(os.path.exists(self.lock_path))
        
        self.assertFalse(os.path.exists(self.lock_path))
    
    def test_lock_contains_process_id(self):
        """Test that lock file contains the current process ID."""
        with CatalogLock(self.db_path):
            with open(self.lock_path, 'r') as f:
                lock_pid = f.read().strip()
            self.assertEqual(lock_pid, str(os.getpid()))


class TestCatalogManagerIdempotency(unittest.TestCase):
    """Test suite for idempotent upsert operations."""
    
    def setUp(self):
        self.temp_dir = tempfile.mkdtemp()
        self.db_path = os.path.join(self.temp_dir, 'products.json')
        self.manager = CatalogManager(db_path=self.db_path)
    
    def tearDown(self):
        if os.path.exists(self.temp_dir):
            shutil.rmtree(self.temp_dir)
    
    def test_prevents_duplicate_products(self):
        """Test that inserting the same product twice doesn't create duplicates."""
        product_data = {
            "product_id": "TEST_001",
            "product_name": "Test Product",
            "pricing": [{"tier_name": "Standard", "price_aed": 100}],
            "inclusions": ["Item 1"]
        }
        
        self.manager.upsert_batch([product_data])
        self.manager.upsert_batch([product_data])
        
        data = self.manager._load_data()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['product_id'], "TEST_001")
    
    def test_updates_existing_product(self):
        """Test that upserting updates existing products."""
        original_product = {
            "product_id": "TEST_001",
            "product_name": "Original Name",
            "pricing": [{"tier_name": "Standard", "price_aed": 100}],
            "inclusions": ["Item 1"]
        }
        
        updated_product = {
            "product_id": "TEST_001",
            "product_name": "Updated Name",
            "pricing": [{"tier_name": "Standard", "price_aed": 150}],
            "inclusions": ["Item 1", "Item 2"]
        }
        
        self.manager.upsert_batch([original_product])
        self.manager.upsert_batch([updated_product])
        
        data = self.manager._load_data()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['product_name'], "Updated Name")
        self.assertEqual(data[0]['pricing'][0]['price_aed'], 150)
    
    def test_batch_insert_multiple_products(self):
        """Test inserting multiple products in a single batch."""
        products = [
            {
                "product_id": f"TEST_{i:03d}",
                "product_name": f"Product {i}",
                "pricing": [{"tier_name": "Standard", "price_aed": 100 * i}],
                "inclusions": ["Item"]
            }
            for i in range(1, 6)
        ]
        
        count = self.manager.upsert_batch(products)
        
        self.assertEqual(count, 5)
        data = self.manager._load_data()
        self.assertEqual(len(data), 5)


class TestCatalogManagerValidation(unittest.TestCase):
    """Test suite for Pydantic schema validation."""
    
    def setUp(self):
        self.temp_dir = tempfile.mkdtemp()
        self.db_path = os.path.join(self.temp_dir, 'products.json')
        self.manager = CatalogManager(db_path=self.db_path)
    
    def tearDown(self):
        if os.path.exists(self.temp_dir):
            shutil.rmtree(self.temp_dir)
    
    def test_rejects_negative_price(self):
        """Test that negative prices are rejected."""
        invalid_product = {
            "product_id": "TEST_INVALID",
            "product_name": "Invalid Product",
            "pricing": [{"tier_name": "Standard", "price_aed": -50}],
            "inclusions": ["Item"]
        }
        
        with self.assertRaises(ValidationError):
            self.manager.upsert_batch([invalid_product])
    
    def test_database_not_corrupted_on_validation_failure(self):
        """Test that DB remains intact when validation fails."""
        valid_product = {
            "product_id": "TEST_VALID",
            "product_name": "Valid Product",
            "pricing": [{"tier_name": "Standard", "price_aed": 100}],
            "inclusions": ["Item"]
        }
        self.manager.upsert_batch([valid_product])
        
        invalid_product = {
            "product_id": "TEST_INVALID",
            "product_name": "Invalid Product",
            "pricing": [{"tier_name": "Standard", "price_aed": -50}],
            "inclusions": ["Item"]
        }
        
        try:
            self.manager.upsert_batch([invalid_product])
        except ValidationError:
            pass
        
        data = self.manager._load_data()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['product_id'], "TEST_VALID")
    
    def test_requires_product_id(self):
        """Test that product_id is required."""
        invalid_product = {
            "product_name": "No ID Product",
            "pricing": [{"tier_name": "Standard", "price_aed": 100}],
            "inclusions": ["Item"]
        }
        
        with self.assertRaises(ValidationError):
            self.manager.upsert_batch([invalid_product])
    
    def test_requires_pricing_list(self):
        """Test that pricing list is required."""
        invalid_product = {
            "product_id": "TEST_NO_PRICING",
            "product_name": "No Pricing Product",
            "inclusions": ["Item"]
        }
        
        with self.assertRaises(ValidationError):
            self.manager.upsert_batch([invalid_product])
    
    def test_requires_inclusions_list(self):
        """Test that inclusions list is required."""
        invalid_product = {
            "product_id": "TEST_NO_INCLUSIONS",
            "product_name": "No Inclusions Product",
            "pricing": [{"tier_name": "Standard", "price_aed": 100}]
        }
        
        with self.assertRaises(ValidationError):
            self.manager.upsert_batch([invalid_product])
    
    def test_validates_pricing_tier_structure(self):
        """Test that pricing tiers are properly validated."""
        valid_product = {
            "product_id": "TEST_PRICING",
            "product_name": "Test Pricing",
            "pricing": [
                {
                    "tier_name": "Standard",
                    "price_aed": 100,
                    "currency": "AED",
                    "validity_start": "2025-01-01",
                    "validity_end": "2025-12-31"
                }
            ],
            "inclusions": ["Item"]
        }
        
        count = self.manager.upsert_batch([valid_product])
        self.assertEqual(count, 1)
        
        data = self.manager._load_data()
        self.assertEqual(data[0]['pricing'][0]['currency'], "AED")
    
    def test_default_active_flag(self):
        """Test that active flag defaults to True."""
        product = {
            "product_id": "TEST_ACTIVE",
            "product_name": "Test Active Default",
            "pricing": [{"tier_name": "Standard", "price_aed": 100}],
            "inclusions": ["Item"]
        }
        
        self.manager.upsert_batch([product])
        data = self.manager._load_data()
        self.assertTrue(data[0]['active'])


class TestCatalogManagerBackups(unittest.TestCase):
    """Test suite for automated backup functionality."""
    
    def setUp(self):
        self.temp_dir = tempfile.mkdtemp()
        self.db_path = os.path.join(self.temp_dir, 'products.json')
        self.manager = CatalogManager(db_path=self.db_path)
        self.backup_dir = os.path.join(self.temp_dir, 'backups')
    
    def tearDown(self):
        if os.path.exists(self.temp_dir):
            shutil.rmtree(self.temp_dir)
    
    def test_creates_backup_before_write(self):
        """Test that backup is created before writing."""
        initial_product = {
            "product_id": "TEST_001",
            "product_name": "Initial Product",
            "pricing": [{"tier_name": "Standard", "price_aed": 100}],
            "inclusions": ["Item"]
        }
        self.manager.upsert_batch([initial_product])
        
        update_product = {
            "product_id": "TEST_002",
            "product_name": "Second Product",
            "pricing": [{"tier_name": "Standard", "price_aed": 200}],
            "inclusions": ["Item"]
        }
        self.manager.upsert_batch([update_product])
        
        backups = os.listdir(self.backup_dir)
        self.assertGreater(len(backups), 0)
        self.assertTrue(any('products_' in b for b in backups))
    
    def test_backup_file_naming_convention(self):
        """Test that backup files follow naming convention."""
        product = {
            "product_id": "TEST_001",
            "product_name": "Test",
            "pricing": [{"tier_name": "Standard", "price_aed": 100}],
            "inclusions": ["Item"]
        }
        self.manager.upsert_batch([product])
        self.manager.upsert_batch([product])
        
        backups = os.listdir(self.backup_dir)
        for backup in backups:
            self.assertTrue(backup.startswith('products_'))
            self.assertTrue(backup.endswith('.json'))
    
    def test_cleans_old_backups(self):
        """Test that backups older than 7 days are removed."""
        for i in range(3):
            backup_file = os.path.join(self.backup_dir, f'products_old_{i}.json')
            with open(backup_file, 'w') as f:
                json.dump([], f)
        
        old_time = time.time() - (8 * 24 * 60 * 60)
        for backup in os.listdir(self.backup_dir):
            backup_path = os.path.join(self.backup_dir, backup)
            os.utime(backup_path, (old_time, old_time))
        
        self.manager._cleanup_old_backups(days=7)
        
        remaining_backups = os.listdir(self.backup_dir)
        self.assertEqual(len(remaining_backups), 0)
    
    def test_backup_contains_valid_data(self):
        """Test that backup files contain valid JSON data."""
        product = {
            "product_id": "TEST_BACKUP",
            "product_name": "Backup Test",
            "pricing": [{"tier_name": "Standard", "price_aed": 100}],
            "inclusions": ["Item"]
        }
        self.manager.upsert_batch([product])
        
        update = {
            "product_id": "TEST_BACKUP",
            "product_name": "Updated",
            "pricing": [{"tier_name": "Standard", "price_aed": 150}],
            "inclusions": ["Item"]
        }
        self.manager.upsert_batch([update])
        
        backups = [f for f in os.listdir(self.backup_dir) if f.startswith('products_')]
        if backups:
            backup_path = os.path.join(self.backup_dir, backups[0])
            with open(backup_path, 'r') as f:
                backup_data = json.load(f)
            self.assertIsInstance(backup_data, list)
            if backup_data:
                self.assertEqual(backup_data[0]['product_id'], "TEST_BACKUP")


class TestCatalogManagerEdgeCases(unittest.TestCase):
    """Test suite for edge cases and error handling."""
    
    def setUp(self):
        self.temp_dir = tempfile.mkdtemp()
        self.db_path = os.path.join(self.temp_dir, 'products.json')
        self.manager = CatalogManager(db_path=self.db_path)
    
    def tearDown(self):
        if os.path.exists(self.temp_dir):
            shutil.rmtree(self.temp_dir)
    
    def test_handles_empty_batch(self):
        """Test that empty batch is handled gracefully."""
        count = self.manager.upsert_batch([])
        self.assertEqual(count, 0)
    
    def test_handles_unicode_characters(self):
        """Test that Unicode characters in product data are preserved."""
        product = {
            "product_id": "TEST_UNICODE",
            "product_name": "Museum – Culture & Art 文化",
            "pricing": [{"tier_name": "Standard", "price_aed": 100}],
            "inclusions": ["Entry to museum", "Guide en français"]
        }
        
        self.manager.upsert_batch([product])
        data = self.manager._load_data()
        
        self.assertEqual(data[0]['product_name'], "Museum – Culture & Art 文化")
        self.assertIn("français", data[0]['inclusions'][1])
    
    def test_validates_batch_with_mixed_valid_invalid(self):
        """Test that entire batch fails if any product is invalid."""
        mixed_batch = [
            {
                "product_id": "TEST_VALID_1",
                "product_name": "Valid",
                "pricing": [{"tier_name": "Standard", "price_aed": 100}],
                "inclusions": ["Item"]
            },
            {
                "product_id": "TEST_INVALID",
                "product_name": "Invalid",
                "pricing": [{"tier_name": "Standard", "price_aed": -50}],
                "inclusions": ["Item"]
            },
            {
                "product_id": "TEST_VALID_2",
                "product_name": "Valid",
                "pricing": [{"tier_name": "Standard", "price_aed": 200}],
                "inclusions": ["Item"]
            }
        ]
        
        with self.assertRaises(ValidationError):
            self.manager.upsert_batch(mixed_batch)
        
        data = self.manager._load_data()
        self.assertEqual(len(data), 0)
    
    def test_zero_price_allowed(self):
        """Test that zero price is allowed (free products)."""
        free_product = {
            "product_id": "TEST_FREE",
            "product_name": "Free Product",
            "pricing": [{"tier_name": "Free", "price_aed": 0}],
            "inclusions": ["Free entry"]
        }
        
        count = self.manager.upsert_batch([free_product])
        self.assertEqual(count, 1)
        
        data = self.manager._load_data()
        self.assertEqual(data[0]['pricing'][0]['price_aed'], 0)


class TestProductModel(unittest.TestCase):
    """Test suite for Product Pydantic model."""
    
    def test_product_model_validation(self):
        """Test that Product model validates correctly."""
        product_data = {
            "product_id": "TEST_MODEL",
            "product_name": "Test Product",
            "pricing": [{"tier_name": "Standard", "price_aed": 100}],
            "inclusions": ["Item 1", "Item 2"]
        }
        
        product = Product(**product_data)
        self.assertEqual(product.product_id, "TEST_MODEL")
        self.assertTrue(product.active)
    
    def test_pricing_tier_validation(self):
        """Test that PricingTier validates correctly."""
        product_data = {
            "product_id": "TEST_TIER",
            "product_name": "Test",
            "pricing": [
                {
                    "tier_name": "Adult",
                    "price_aed": 150,
                    "currency": "AED"
                }
            ],
            "inclusions": ["Entry"]
        }
        
        product = Product(**product_data)
        self.assertEqual(product.pricing[0].tier_name, "Adult")
        self.assertEqual(product.pricing[0].currency, "AED")
    
    def test_optional_fields_default_to_none(self):
        """Test that optional fields default to None."""
        minimal_product = {
            "product_id": "TEST_MINIMAL",
            "product_name": "Minimal",
            "pricing": [{"tier_name": "Standard", "price_aed": 100}],
            "inclusions": ["Item"]
        }
        
        product = Product(**minimal_product)
        self.assertIsNone(product.supplier_name)
        self.assertIsNone(product.category)
        self.assertIsNone(product.description_short)


def run_test_suite():
    """Run the complete test suite with detailed output."""
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    
    suite.addTests(loader.loadTestsFromTestCase(TestCatalogManagerInitialization))
    suite.addTests(loader.loadTestsFromTestCase(TestCatalogManagerAtomicWrites))
    suite.addTests(loader.loadTestsFromTestCase(TestCatalogLocking))
    suite.addTests(loader.loadTestsFromTestCase(TestCatalogManagerIdempotency))
    suite.addTests(loader.loadTestsFromTestCase(TestCatalogManagerValidation))
    suite.addTests(loader.loadTestsFromTestCase(TestCatalogManagerBackups))
    suite.addTests(loader.loadTestsFromTestCase(TestCatalogManagerEdgeCases))
    suite.addTests(loader.loadTestsFromTestCase(TestProductModel))
    
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    return result


if __name__ == '__main__':
    result = run_test_suite()
    sys.exit(0 if result.wasSuccessful() else 1)
