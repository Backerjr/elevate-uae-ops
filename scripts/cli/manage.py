#!/usr/bin/env python3
"""
Unified CLI Tool for Catalog Management
========================================

A single entry point for all catalog administrative operations.

Usage:
    python3 manage.py ingest --file <path>
    python3 manage.py stats
    python3 manage.py backup
    python3 manage.py nuke

Author: Senior Systems Engineer
Version: 1.0.0
"""

import sys
import os
import json
import argparse
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any

project_root = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(project_root / 'src'))

try:
    from backend.lib.catalog_manager import CatalogManager, ValidationError
except ImportError as e:
    print(f"ERROR: Failed to import CatalogManager: {e}", file=sys.stderr)
    print("Ensure 'pydantic' is installed: pip install pydantic", file=sys.stderr)
    sys.exit(1)


DEFAULT_DB_PATH = "src/data/products.json"


class CatalogCLI:
    """Command-line interface for catalog management operations."""
    
    def __init__(self, db_path: str = DEFAULT_DB_PATH):
        self.db_path = os.path.join(project_root, db_path)
        self.manager = CatalogManager(db_path=self.db_path)
    
    def ingest(self, file_path: str) -> int:
        """
        Ingest products from a JSON or JSONL file.
        
        Args:
            file_path: Path to the data file
            
        Returns:
            Exit code (0 for success, 1 for error)
        """
        if not os.path.exists(file_path):
            print(f"ERROR: File not found: {file_path}", file=sys.stderr)
            return 1
        
        try:
            data = self._parse_file(file_path)
            
            if not data:
                print(f"WARNING: No products found in {file_path}", file=sys.stderr)
                return 1
            
            if not isinstance(data, list):
                print(f"ERROR: Expected a list of products, got {type(data).__name__}", file=sys.stderr)
                return 1
            
            print(f"📥 Ingesting {len(data)} product(s) from {os.path.basename(file_path)}...")
            
            count = self.manager.upsert_batch(data)
            
            print(f"✅ Successfully ingested {count} products from {os.path.basename(file_path)}")
            return 0
            
        except ValidationError as e:
            print(f"ERROR: Validation failed during ingestion:", file=sys.stderr)
            print(f"  {str(e)}", file=sys.stderr)
            return 1
        except json.JSONDecodeError as e:
            print(f"ERROR: Invalid JSON format in {file_path}:", file=sys.stderr)
            print(f"  Line {e.lineno}, Column {e.colno}: {e.msg}", file=sys.stderr)
            return 1
        except BlockingIOError:
            print(f"ERROR: Database is locked by another process", file=sys.stderr)
            print(f"  Please wait 30 seconds and try again", file=sys.stderr)
            return 1
        except Exception as e:
            print(f"ERROR: Unexpected error during ingestion:", file=sys.stderr)
            print(f"  {str(e)}", file=sys.stderr)
            return 1
    
    def _parse_file(self, file_path: str) -> List[Dict[str, Any]]:
        """
        Parse JSON or JSONL file.
        
        Supports:
        - JSON array: [{"product_id": "..."}, ...]
        - JSONL: One JSON object per line
        """
        file_ext = os.path.splitext(file_path)[1].lower()
        
        if file_ext == '.jsonl':
            return self._parse_jsonl(file_path)
        else:
            return self._parse_json(file_path)
    
    def _parse_json(self, file_path: str) -> List[Dict[str, Any]]:
        """Parse standard JSON file."""
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
            if isinstance(data, list):
                return data
            elif isinstance(data, dict):
                return [data]
            else:
                raise ValueError(f"Unsupported JSON structure: {type(data).__name__}")
    
    def _parse_jsonl(self, file_path: str) -> List[Dict[str, Any]]:
        """Parse JSONL file (one JSON object per line)."""
        products = []
        with open(file_path, 'r', encoding='utf-8') as f:
            for line_num, line in enumerate(f, 1):
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                try:
                    products.append(json.loads(line))
                except json.JSONDecodeError as e:
                    raise json.JSONDecodeError(
                        f"Invalid JSON on line {line_num}: {e.msg}",
                        e.doc, e.pos
                    )
        return products
    
    def stats(self) -> int:
        """
        Display catalog statistics.
        
        Returns:
            Exit code (0 for success, 1 for error)
        """
        try:
            if not os.path.exists(self.db_path):
                print("📊 Catalog Statistics")
                print("=" * 60)
                print("Status: Database not initialized")
                print(f"Expected location: {self.db_path}")
                print("\nRun 'python3 manage.py ingest --file <path>' to create it.")
                return 1
            
            data = self.manager._load_data()
            
            print("\n📊 Catalog Statistics")
            print("=" * 60)
            
            print(f"Total Products:      {len(data)}")
            
            if len(data) == 0:
                print("\nNo products in catalog.")
                return 0
            
            mod_time = os.path.getmtime(self.db_path)
            last_updated = datetime.fromtimestamp(mod_time)
            print(f"Last Updated:        {last_updated.strftime('%Y-%m-%d %H:%M:%S')}")
            
            file_size = os.path.getsize(self.db_path)
            print(f"Database Size:       {self._format_bytes(file_size)}")
            
            categories = {}
            cities = {}
            suppliers = {}
            active_count = 0
            
            for product in data:
                if product.get('active', True):
                    active_count += 1
                
                cat = product.get('category', 'Uncategorized')
                categories[cat] = categories.get(cat, 0) + 1
                
                city = product.get('destination_city', 'Unknown')
                cities[city] = cities.get(city, 0) + 1
                
                supplier = product.get('supplier_name', 'Unknown')
                suppliers[supplier] = suppliers.get(supplier, 0) + 1
            
            print(f"Active Products:     {active_count}")
            print(f"Inactive Products:   {len(data) - active_count}")
            
            print("\n📁 By Category:")
            for cat, count in sorted(categories.items(), key=lambda x: x[1], reverse=True):
                percentage = (count / len(data)) * 100
                print(f"  {cat:20s} {count:3d} ({percentage:5.1f}%)")
            
            print("\n🌍 By Destination:")
            for city, count in sorted(cities.items(), key=lambda x: x[1], reverse=True)[:5]:
                percentage = (count / len(data)) * 100
                print(f"  {city:20s} {count:3d} ({percentage:5.1f}%)")
            
            print("\n🏢 Top Suppliers:")
            for supplier, count in sorted(suppliers.items(), key=lambda x: x[1], reverse=True)[:5]:
                percentage = (count / len(data)) * 100
                print(f"  {supplier:30s} {count:3d} ({percentage:5.1f}%)")
            
            backup_dir = os.path.join(os.path.dirname(self.db_path), 'backups')
            if os.path.exists(backup_dir):
                backups = [f for f in os.listdir(backup_dir) if f.startswith('products_')]
                print(f"\n💾 Backups Available: {len(backups)}")
            
            print("=" * 60)
            print()
            
            return 0
            
        except Exception as e:
            print(f"ERROR: Failed to retrieve statistics:", file=sys.stderr)
            print(f"  {str(e)}", file=sys.stderr)
            return 1
    
    def backup(self) -> int:
        """
        Manually create a backup of the catalog.
        
        Returns:
            Exit code (0 for success, 1 for error)
        """
        try:
            if not os.path.exists(self.db_path):
                print("ERROR: Database does not exist. Nothing to backup.", file=sys.stderr)
                return 1
            
            print("💾 Creating backup...")
            
            backup_path = self.manager._create_backup()
            
            if backup_path:
                file_size = os.path.getsize(backup_path)
                print(f"✅ Backup created successfully")
                print(f"   Location: {backup_path}")
                print(f"   Size:     {self._format_bytes(file_size)}")
                return 0
            else:
                print("WARNING: Backup was not created (database may be empty)", file=sys.stderr)
                return 1
                
        except Exception as e:
            print(f"ERROR: Failed to create backup:", file=sys.stderr)
            print(f"  {str(e)}", file=sys.stderr)
            return 1
    
    def nuke(self, confirmed: bool = False) -> int:
        """
        Delete the catalog database (for testing/reset purposes).
        
        Args:
            confirmed: Whether the user has confirmed the action
            
        Returns:
            Exit code (0 for success, 1 for error)
        """
        if not os.path.exists(self.db_path):
            print("INFO: Database does not exist. Nothing to delete.")
            return 0
        
        if not confirmed:
            print("⚠️  WARNING: This will permanently delete the catalog database!")
            print(f"   Location: {self.db_path}")
            
            data = self.manager._load_data()
            print(f"   Products: {len(data)}")
            
            print("\nType 'CONFIRM' to proceed with deletion:")
            response = input("> ").strip()
            
            if response != "CONFIRM":
                print("❌ Deletion cancelled.")
                return 1
        
        try:
            print("🗑️  Deleting database...")
            os.remove(self.db_path)
            print(f"✅ Database deleted: {self.db_path}")
            
            lock_path = f"{self.db_path}.lock"
            if os.path.exists(lock_path):
                os.remove(lock_path)
                print(f"🔓 Lock file removed: {lock_path}")
            
            return 0
            
        except Exception as e:
            print(f"ERROR: Failed to delete database:", file=sys.stderr)
            print(f"  {str(e)}", file=sys.stderr)
            return 1
    
    def list_backups(self) -> int:
        """
        List all available backups.
        
        Returns:
            Exit code (0 for success, 1 for error)
        """
        try:
            backup_dir = os.path.join(os.path.dirname(self.db_path), 'backups')
            
            if not os.path.exists(backup_dir):
                print("INFO: No backup directory found.")
                return 0
            
            backups = sorted([f for f in os.listdir(backup_dir) if f.startswith('products_')])
            
            if not backups:
                print("INFO: No backups available.")
                return 0
            
            print(f"\n💾 Available Backups ({len(backups)} total)")
            print("=" * 80)
            print(f"{'Filename':<35} {'Created':<20} {'Size':>10}")
            print("-" * 80)
            
            for backup in backups:
                backup_path = os.path.join(backup_dir, backup)
                size = os.path.getsize(backup_path)
                mtime = datetime.fromtimestamp(os.path.getmtime(backup_path))
                
                print(f"{backup:<35} {mtime.strftime('%Y-%m-%d %H:%M:%S'):<20} {self._format_bytes(size):>10}")
            
            print("=" * 80)
            print()
            
            return 0
            
        except Exception as e:
            print(f"ERROR: Failed to list backups:", file=sys.stderr)
            print(f"  {str(e)}", file=sys.stderr)
            return 1
    
    @staticmethod
    def _format_bytes(bytes_num: int) -> str:
        """Format bytes to human-readable string."""
        for unit in ['B', 'KB', 'MB', 'GB']:
            if bytes_num < 1024.0:
                return f"{bytes_num:.1f} {unit}"
            bytes_num /= 1024.0
        return f"{bytes_num:.1f} TB"


def main():
    """Main entry point for the CLI tool."""
    
    parser = argparse.ArgumentParser(
        description='Unified Catalog Management CLI',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Ingest products from a JSON file
  python3 manage.py ingest --file data/batch1.json
  
  # Ingest from JSONL format
  python3 manage.py ingest --file data/products.jsonl
  
  # View catalog statistics
  python3 manage.py stats
  
  # Create a manual backup
  python3 manage.py backup
  
  # List all backups
  python3 manage.py list-backups
  
  # Reset the database (with confirmation)
  python3 manage.py nuke

For more information, see the documentation.
        """
    )
    
    parser.add_argument(
        '--db-path',
        default=DEFAULT_DB_PATH,
        help=f'Path to the catalog database (default: {DEFAULT_DB_PATH})'
    )
    
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    ingest_parser = subparsers.add_parser(
        'ingest',
        help='Ingest products from a JSON or JSONL file'
    )
    ingest_parser.add_argument(
        '--file',
        required=True,
        help='Path to the JSON or JSONL file containing products'
    )
    
    subparsers.add_parser(
        'stats',
        help='Display catalog statistics and metrics'
    )
    
    subparsers.add_parser(
        'backup',
        help='Manually create a backup of the catalog'
    )
    
    subparsers.add_parser(
        'list-backups',
        help='List all available backups'
    )
    
    nuke_parser = subparsers.add_parser(
        'nuke',
        help='[DANGER] Delete the catalog database'
    )
    nuke_parser.add_argument(
        '--yes',
        action='store_true',
        help='Skip confirmation prompt'
    )
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return 1
    
    cli = CatalogCLI(db_path=args.db_path)
    
    if args.command == 'ingest':
        return cli.ingest(args.file)
    
    elif args.command == 'stats':
        return cli.stats()
    
    elif args.command == 'backup':
        return cli.backup()
    
    elif args.command == 'list-backups':
        return cli.list_backups()
    
    elif args.command == 'nuke':
        return cli.nuke(confirmed=args.yes)
    
    else:
        print(f"ERROR: Unknown command: {args.command}", file=sys.stderr)
        return 1


if __name__ == '__main__':
    try:
        exit_code = main()
        sys.exit(exit_code)
    except KeyboardInterrupt:
        print("\n\n⚠️  Operation cancelled by user", file=sys.stderr)
        sys.exit(130)
    except Exception as e:
        print(f"\n❌ FATAL ERROR: {str(e)}", file=sys.stderr)
        sys.exit(1)
