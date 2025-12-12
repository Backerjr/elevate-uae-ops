#!/usr/bin/env python3
"""
Integration Test: End-to-End CatalogManager Workflow
Tests the complete lifecycle from ingestion to retrieval with real-world scenarios.
"""

import unittest
import json
import os
import sys
import tempfile
import shutil
from pathlib import Path

project_root = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(project_root / 'src'))

from backend.lib.catalog_manager import CatalogManager, ValidationError


class TestCatalogManagerIntegration(unittest.TestCase):
    """Integration tests simulating real production workflows."""
    
    def setUp(self):
        self.temp_dir = tempfile.mkdtemp()
        self.db_path = os.path.join(self.temp_dir, 'products.json')
        self.manager = CatalogManager(db_path=self.db_path)
    
    def tearDown(self):
        if os.path.exists(self.temp_dir):
            shutil.rmtree(self.temp_dir)
    
    def test_complete_ingestion_workflow(self):
        """Test: Complete product ingestion workflow."""
        print("\n🔵 Test: Complete Ingestion Workflow")
        
        batch_1 = [
            {
                "product_id": "Dubai_MuseumOfTheFuture",
                "product_name": "Museum of the Future",
                "pricing": [{"tier_name": "Adult", "price_aed": 149}],
                "inclusions": ["General admission"]
            },
            {
                "product_id": "Dubai_BurjKhalifa",
                "product_name": "Burj Khalifa At The Top",
                "pricing": [{"tier_name": "Level 124", "price_aed": 159}],
                "inclusions": ["Fast-track entry"]
            }
        ]
        
        count = self.manager.upsert_batch(batch_1)
        self.assertEqual(count, 2)
        print(f"  ✓ Inserted {count} products (Batch 1)")
        
        data = self.manager._load_data()
        self.assertEqual(len(data), 2)
        print(f"  ✓ Verified database contains {len(data)} products")
        
        batch_2 = [
            {
                "product_id": "Dubai_MuseumOfTheFuture",
                "product_name": "Museum of the Future - Updated",
                "pricing": [{"tier_name": "Adult", "price_aed": 175}],
                "inclusions": ["General admission", "Audio guide"]
            },
            {
                "product_id": "AbuDhabi_Louvre",
                "product_name": "Louvre Abu Dhabi",
                "pricing": [{"tier_name": "Adult", "price_aed": 63}],
                "inclusions": ["Museum access"]
            }
        ]
        
        count = self.manager.upsert_batch(batch_2)
        self.assertEqual(count, 2)
        print(f"  ✓ Upserted {count} products (Batch 2)")
        
        data = self.manager._load_data()
        self.assertEqual(len(data), 3)
        print(f"  ✓ Total products: {len(data)} (1 updated, 1 new)")
        
        museum_product = [p for p in data if p['product_id'] == 'Dubai_MuseumOfTheFuture'][0]
        self.assertEqual(museum_product['pricing'][0]['price_aed'], 175)
        self.assertEqual(len(museum_product['inclusions']), 2)
        print("  ✓ Update verified: Price changed from 149 to 175 AED")
        
        backup_dir = os.path.join(self.temp_dir, 'backups')
        backups = os.listdir(backup_dir)
        self.assertGreater(len(backups), 0)
        print(f"  ✓ Backups created: {len(backups)} backup file(s)")
        
        print("  ✅ Workflow completed successfully\n")
    
    def test_concurrent_access_simulation(self):
        """Test: Simulated concurrent access with locking."""
        print("\n🔵 Test: Concurrent Access (Locking)")
        
        product = {
            "product_id": "TEST_CONCURRENT",
            "product_name": "Test Product",
            "pricing": [{"tier_name": "Standard", "price_aed": 100}],
            "inclusions": ["Item"]
        }
        
        self.manager.upsert_batch([product])
        print("  ✓ Initial product created")
        
        lock_path = f"{self.db_path}.lock"
        with open(lock_path, 'w') as f:
            f.write(str(os.getpid()))
        print("  ✓ Lock file created (simulating concurrent process)")
        
        try:
            self.manager.upsert_batch([product])
            self.fail("Should have raised BlockingIOError")
        except BlockingIOError:
            print("  ✓ BlockingIOError raised as expected")
        
        os.remove(lock_path)
        print("  ✓ Lock released")
        
        self.manager.upsert_batch([product])
        print("  ✓ Write succeeded after lock release")
        print("  ✅ Concurrent access handled correctly\n")
    
    def test_data_validation_and_rollback(self):
        """Test: Validation failure doesn't corrupt database."""
        print("\n🔵 Test: Validation & Rollback")
        
        valid_product = {
            "product_id": "VALID_001",
            "product_name": "Valid Product",
            "pricing": [{"tier_name": "Standard", "price_aed": 100}],
            "inclusions": ["Item"]
        }
        
        self.manager.upsert_batch([valid_product])
        print("  ✓ Valid product inserted")
        
        data_before = self.manager._load_data()
        backup_dir = os.path.join(self.temp_dir, 'backups')
        backups_before = len(os.listdir(backup_dir))
        
        invalid_product = {
            "product_id": "INVALID_001",
            "product_name": "Invalid Product",
            "pricing": [{"tier_name": "Standard", "price_aed": -50}],
            "inclusions": ["Item"]
        }
        
        try:
            self.manager.upsert_batch([invalid_product])
            self.fail("Should have raised ValidationError")
        except ValidationError as e:
            print(f"  ✓ ValidationError raised: Negative price rejected")
        
        data_after = self.manager._load_data()
        backups_after = len(os.listdir(backup_dir))
        
        self.assertEqual(len(data_after), 1)
        self.assertEqual(data_after[0]['product_id'], 'VALID_001')
        print("  ✓ Database unchanged after validation failure")
        
        self.assertEqual(backups_after, backups_before)
        print("  ✓ No backup created for failed operation")
        print("  ✅ Data integrity preserved\n")
    
    def test_multi_tier_pricing_scenario(self):
        """Test: Real-world multi-tier pricing."""
        print("\n🔵 Test: Multi-Tier Pricing")
        
        complex_product = {
            "product_id": "Dubai_BurjKhalifa_Multilevel",
            "product_name": "Burj Khalifa - All Levels",
            "supplier_name": "Emaar",
            "destination_city": "Dubai",
            "category": "Sightseeing",
            "pricing": [
                {"tier_name": "Level 124 - Adult", "price_aed": 159, "currency": "AED"},
                {"tier_name": "Level 124 - Child", "price_aed": 120, "currency": "AED"},
                {"tier_name": "Level 148 - Adult", "price_aed": 378, "currency": "AED"},
                {"tier_name": "Level 148 - Child", "price_aed": 300, "currency": "AED"},
                {"tier_name": "VIP Lounge - Adult", "price_aed": 769, "currency": "AED"}
            ],
            "inclusions": ["Fast-track entry", "Multimedia presentation"],
            "exclusions": ["Hotel transfers", "Food and beverages"]
        }
        
        count = self.manager.upsert_batch([complex_product])
        self.assertEqual(count, 1)
        print(f"  ✓ Product with {len(complex_product['pricing'])} pricing tiers inserted")
        
        data = self.manager._load_data()
        saved_product = data[0]
        
        self.assertEqual(len(saved_product['pricing']), 5)
        print("  ✓ All pricing tiers preserved")
        
        vip_tier = saved_product['pricing'][4]
        self.assertEqual(vip_tier['tier_name'], "VIP Lounge - Adult")
        self.assertEqual(vip_tier['price_aed'], 769)
        print(f"  ✓ VIP tier correctly saved: {vip_tier['price_aed']} AED")
        
        self.assertEqual(saved_product['supplier_name'], "Emaar")
        self.assertEqual(saved_product['category'], "Sightseeing")
        print("  ✓ Optional metadata fields preserved")
        print("  ✅ Complex pricing structure handled correctly\n")
    
    def test_backup_and_recovery(self):
        """Test: Backup creation and data recovery."""
        print("\n🔵 Test: Backup & Recovery")
        
        original_product = {
            "product_id": "BACKUP_TEST",
            "product_name": "Original Version",
            "pricing": [{"tier_name": "Standard", "price_aed": 100}],
            "inclusions": ["Item 1"]
        }
        
        self.manager.upsert_batch([original_product])
        print("  ✓ Original product created")
        
        updated_product = {
            "product_id": "BACKUP_TEST",
            "product_name": "Updated Version",
            "pricing": [{"tier_name": "Standard", "price_aed": 150}],
            "inclusions": ["Item 1", "Item 2"]
        }
        
        self.manager.upsert_batch([updated_product])
        print("  ✓ Product updated")
        
        backup_dir = os.path.join(self.temp_dir, 'backups')
        backups = sorted([f for f in os.listdir(backup_dir) if f.startswith('products_')])
        self.assertGreater(len(backups), 0)
        print(f"  ✓ Backups created: {len(backups)}")
        
        backup_path = os.path.join(backup_dir, backups[0])
        with open(backup_path, 'r') as f:
            backup_data = json.load(f)
        
        self.assertEqual(backup_data[0]['product_name'], "Original Version")
        self.assertEqual(backup_data[0]['pricing'][0]['price_aed'], 100)
        print("  ✓ Backup contains original version (100 AED)")
        
        current_data = self.manager._load_data()
        self.assertEqual(current_data[0]['product_name'], "Updated Version")
        self.assertEqual(current_data[0]['pricing'][0]['price_aed'], 150)
        print("  ✓ Current database has updated version (150 AED)")
        
        shutil.copy2(backup_path, self.db_path)
        recovered_data = self.manager._load_data()
        self.assertEqual(recovered_data[0]['product_name'], "Original Version")
        print("  ✓ Successfully recovered from backup")
        print("  ✅ Backup and recovery working correctly\n")


def run_integration_tests():
    """Run the integration test suite."""
    print("\n" + "="*60)
    print("  CATALOGMANAGER INTEGRATION TEST SUITE")
    print("="*60)
    
    loader = unittest.TestLoader()
    suite = loader.loadTestsFromTestCase(TestCatalogManagerIntegration)
    
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    print("\n" + "="*60)
    print(f"  RESULTS: {result.testsRun} tests")
    print(f"  ✅ Passed: {result.testsRun - len(result.failures) - len(result.errors)}")
    print(f"  ❌ Failed: {len(result.failures) + len(result.errors)}")
    print("="*60 + "\n")
    
    return result


if __name__ == '__main__':
    result = run_integration_tests()
    sys.exit(0 if result.wasSuccessful() else 1)
