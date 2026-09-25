#!/usr/bin/env bash
# Quickstart script to setup and run ShopGenie Django REST Backend

set -e

echo "=== ShopGenie Django REST Backend Setup ==="

# Create virtualenv if not exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtualenv
source venv/bin/activate

# Install requirements
echo "Installing dependencies..."
pip install -r requirements.txt

# Run migrations
echo "Running migrations..."
python manage.py makemigrations api
python manage.py migrate

# Seed data
echo "Seeding initial retail catalog..."
python manage.py seed_data

# Start server
echo "Starting Django server on http://localhost:8000 ..."
python manage.py runserver 0.0.0.0:8000
