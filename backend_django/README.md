# ShopGenie Django REST Framework Backend

This is the production-ready **Django REST Framework** backend for **ShopGenie**, the hyper-local retail discovery and instant self-checkout platform, optimized for **PostgreSQL** (and compatible with SQLite for zero-setup local dev).

---

## Core Models (`backend_django/api/models.py`)

Designed with **PostgreSQL** native features:
- **JSONB**: Flexible metadata, user preferences, loyalty rewards catalogs, and payment gateway receipts.
- **NUMERIC(10,2) / NUMERIC(12,2)**: High-precision decimal fields for monetary calculations (wallet balances, prices, totals, taxes, and refunds).
- **B-Tree Indexes**: Rapid query execution on barcodes, customer phone numbers, categories, and foreign keys.

### 1. `User`
- **Table**: `shopgenie_users`
- **Fields**: `id`, `username`, `email`, `phone_number`, `full_name`, `role` (shopper, merchant, cashier, admin), `wallet_balance` (`DecimalField`), `avatar_url`, `preferences` (`JSONField`), `address`, `area`, `city`, `pincode`, `is_active`, `is_verified`.

### 2. `Shop`
- **Table**: `shopgenie_shops`
- **Fields**: `id`, `owner` (FK to `User`), `name`, `category`, `logo_url`, `cover_url`, `lat`, `lng`, `distance_m`, `rating`, `review_count`, `follower_count`, `product_count`, `is_open`, `hours`, `address`, `area`, `phone`, `supports_self_checkout`, `verified`, `payment_methods` (`JSONField`), `description`.

### 3. `Product`
- **Table**: `shopgenie_products`
- **Fields**: `id`, `shop` (FK to `Shop`), `name`, `category`, `price` (`DecimalField`), `mrp` (`DecimalField`), `discount_pct`, `stock`, `image_urls` (`JSONField`), `barcode` (`db_index=True` for camera scanner), `sku`, `description`, `featured`, `metadata` (`JSONField`).

### 4. `LoyaltyPoints` (with `LoyaltyCard` alias)
- **Table**: `shopgenie_loyalty_points`
- **Fields**: `id`, `user` (FK to `User`), `shop` (FK to `Shop`), `user_phone`, `points`, `lifetime_points`, `points_redeemed`, `next_reward_at`, `tier` (Bronze, Silver, Gold, Diamond), `barcode`, `available_rewards` (`JSONField`), `history` (`JSONField`).

### 5. `Transaction`
- **Table**: `shopgenie_transactions`
- **Fields**: `id`, `user` (FK to `User`), `shop` (FK to `Shop`), `order` (FK to `Order`), `transaction_type` (purchase, refund, wallet_topup, loyalty_cashback), `amount` (`DecimalField`), `fee`, `tax`, `payment_method` (upi, card, wallet, counter_cash, loyalty_points), `payment_gateway_ref`, `status` (initiated, pending, successful, failed, refunded), `currency`, `customer_phone`, `customer_email`, `metadata` (`JSONField`).

### Additional Models:
- `Order` & `OrderItem`: Self-checkout baskets and cryptographic Exit Pass QR code generation & cashier verification.
- `Offer`: Promotional vouchers and flash discounts.
- `FeedPost`: Hyperlocal social feed updates.
- `Notification`: Push notifications and customer alerts.

---

## Connecting to PostgreSQL

In `shopgenie_backend/settings.py`, the backend automatically connects to PostgreSQL if any of the following environment variables are provided:

### Method A: Single Database URL
```bash
export DATABASE_URL="postgresql://postgres:password@localhost:5432/shopgenie_db"
```

### Method B: Standard PostgreSQL Environment Variables
```bash
export POSTGRES_DB=shopgenie_db
export POSTGRES_USER=postgres
export POSTGRES_PASSWORD=your_secure_password
export POSTGRES_HOST=localhost
export POSTGRES_PORT=5432
```

If neither is provided, it falls back seamlessly to SQLite (`db.sqlite3`) for instant zero-dependency local execution.

---

## REST Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET / POST` | `/api/users/` | Customer, merchant, & cashier accounts and profiles |
| `GET / POST` | `/api/shops/` | List shops with category/area filtering & search |
| `GET` | `/api/shops/{id}/products/` | Products specific to a shop |
| `GET / POST` | `/api/products/` | Product catalog & inventory |
| `GET` | `/api/products/lookup_barcode/?barcode=...` | Instant barcode scan match |
| `GET / POST` | `/api/transactions/` | Financial ledger and settlement logs |
| `GET / POST` | `/api/orders/` | Place orders and generate Exit Pass QR |
| `POST` | `/api/orders/{id}/verify_exit_pass/` | Cashier verification of customer exit QR pass |
| `GET / POST` | `/api/loyalty/` | Loyalty points, reward redemption, tiers |
| `GET / POST` | `/api/offers/` | Flash offers and promo codes |
| `GET / POST` | `/api/feed/` | Hyperlocal neighborhood store feed |
| `GET` | `/admin/` | Django Admin Management Suite |

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
API runs on `http://localhost:8000/api/` with Django Admin at `http://localhost:8000/admin/`.
