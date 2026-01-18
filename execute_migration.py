import csv
import os
import shutil
from pathlib import Path

def expand_path(path_str):
    if path_str.startswith('~'):
        return os.path.expanduser(path_str)
    if path_str.startswith('.'):
        return os.path.abspath(path_str)
    return path_str

def migrate_files():
    csv_path = os.path.expanduser('~/MASTER_BEFORE_AFTER_MIGRATION.csv')
    log_path = 'migration_log.txt'
    
    with open(log_path, 'w') as log_file:
        with open(csv_path, 'r') as f:
            reader = csv.DictReader(f)
            count = 0
            success = 0
            skipped = 0
            
            for row in reader:
                count += 1
                # Clean up paths
                source_orig = row['Before_Path']
                dest_orig = row['After_Path']
                
                # Handle relative paths from CSV source
                if source_orig.startswith('./'):
                    # Try relative to home first
                    source_path = os.path.join(os.path.expanduser('~'), source_orig[2:])
                else:
                    source_path = expand_path(source_orig)
                    
                dest_path = expand_path(dest_orig)
                
                # Check if source exists
                if not os.path.exists(source_path):
                    # Try finding it relative to current dir just in case
                    if os.path.exists(os.path.abspath(source_orig)):
                        source_path = os.path.abspath(source_orig)
                    else:
                        msg = f"SKIP: Source not found: {source_path}"
                        print(msg)
                        log_file.write(msg + '\n')
                        skipped += 1
                        continue
                
                # Create destination directory
                dest_dir = os.path.dirname(dest_path)
                try:
                    os.makedirs(dest_dir, exist_ok=True)
                except Exception as e:
                    msg = f"ERROR: Creating dir {dest_dir}: {str(e)}"
                    print(msg)
                    log_file.write(msg + '\n')
                    continue

                # Move file
                try:
                    shutil.move(source_path, dest_path)
                    msg = f"SUCCESS: Moved {source_path} -> {dest_path}"
                    # print(msg) # Reduce verbosity
                    log_file.write(msg + '\n')
                    success += 1
                except Exception as e:
                    msg = f"ERROR: Moving {source_path}: {str(e)}"
                    print(msg)
                    log_file.write(msg + '\n')

            print(f"\nMigration Complete.")
            print(f"Total entries: {count}")
            print(f"Successfully moved: {success}")
            print(f"Skipped (not found): {skipped}")
            print(f"Log written to {log_path}")

if __name__ == '__main__':
    migrate_files()
