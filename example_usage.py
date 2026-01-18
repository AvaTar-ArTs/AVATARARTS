"""
Example usage of the environment configuration loader
"""

import os
from utils.env_loader import load_config, get_config

# Set the environment (usually done via ENVIRONMENT variable)
os.environ['ENVIRONMENT'] = 'development'

# Load all configurations for the current environment
config = load_config()
print("Loaded configuration:")
for key, value in config.items():
    print(f"  {key}: {value}")

# Get specific configuration values
db_host = get_config('DB_HOST', 'localhost')
debug_mode = get_config('DEBUG', False)
api_key = get_config('WEATHER_API_KEY')

print(f"\nDatabase host: {db_host}")
print(f"Debug mode: {debug_mode}")
print(f"Weather API key present: {bool(api_key)}")

# You can also create a loader for a specific environment
from utils.env_loader import EnvLoader

production_loader = EnvLoader('production')
prod_config = production_loader.load_all()
print(f"\nProduction DB host: {prod_config.get('DB_HOST', 'Not set')}")
