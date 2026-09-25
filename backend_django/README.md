# ShopGenie Django REST Framework Backend

This is the production-ready **Django REST Framework** backend for **ShopGenie**, the hyper-local retail discovery and instant self-checkout platform.

## Features

- **Hyper-Local Shops API (`/api/shops/`)**:
  - Filter by category, area, supports_self_checkout, and search query.
  - Nested shop products endpoint (`/api/shops/{id}/products/`).
- **Catalog & Barcode Scan API (`/api/products/`)**:
  - Barcode lookup action (`/api/products/lookup_barcode/?barcode=...`).
  - Search across item names and descriptions.
- **Flash Offers API (`/api/offers/`)**:
  - Live discounts, promo codes, and expiration status.
- **Orders & QR Exit Passes (`/api/orders/`)**:
  - Order creation with breakdown (tax, discount, loyalty points).
  - Exit pass verification action (`POST /api/orders/{id}/verify_exit_pass/`).
- **Loyalty Program (`/api/loyalty/`)**:
  - Loyalty tiers, rewards, points history, and point accumulation actions.
- **Community Feed (`/api/feed/`)**:
  - Local discovery feed posts with like endpoint.
- **Django Admin (`/admin/`)**:
  - Full management panel for managing retailers, inventories, barcodes, and orders.
- **CORS Configured**: Pre-configured with `django-cors-headers` to support React Vite frontend seamlessly.

---

## Quick Start (Local)

### 1. Requirements
- Python 3.10+
- `pip`

### 2. Setup and Run
Run the automated startup script:
```bash
cd backend_django
chmod +x run_django.sh
./run_django.sh
```

Or manually:
```bash
cd backend_django
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py makemigrations api
python manage.py migrate
python manage.py seed_data
python manage.py createsuperuser  # Optional, for admin access
python manage.py runserver 0.0.0.0:8000
```

---

## Quick Start (Docker)

```bash
cd backend_django
docker-compose up --build
```
The API will be available at: `http://localhost:8000/api/`

---

## Connecting with ShopGenie Frontend

In your frontend root `.env`:
```env
VITE_DJANGO_API_URL=http://localhost:8000/api
```
When running locally, Vite proxies requests from `/api/*` to `http://localhost:8000/api/*`.
