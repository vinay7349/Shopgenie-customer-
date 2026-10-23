# Phase 4 Increment 4.3C — Customer Live API Verification Report

**Customer Flutter project:** `R:\shopGiene customer\Shopgenie-customer-\flutter_shopgenie\`
**Django backend (read-only):** `R:\shopgenie backend\shopgenie_unified\`
**Audit type:** Read-only inspection + reachability check — no files modified.

---

## 1. Files Inspected

| File | Purpose |
|------|---------|
| `lib/services/api_config.dart` | Central API base URL + endpoint paths |
| `lib/services/shop_api_service.dart` | Shop + product HTTP client (`fetchShops`, `fetchShopById`, `fetchProductsForShop`) |
| `lib/services/shop_service.dart` | Service wrapper + mock data + test seam |
| `lib/models/store_item.dart` | Shop model + `fromJson` parsing |
| `lib/models/product_item.dart` | Product model + `fromJson` parsing |
| `lib/screens/home_screen.dart` | Home screen shop discovery UI |
| `lib/screens/shop_detail_screen.dart` | Shop detail screen with live product fetching |
| `shopgenie/urls.py` | Django URL routing |
| `shops/urls.py` | Shop endpoint routes |
| `shops/views.py` | ShopViewSet logic |
| `shops/serializers.py` | ShopPublicSerializer fields |
| `products/urls.py` | Product endpoint routes |
| `products/views.py` | ProductViewSet logic |
| `products/serializers.py` | ProductPublicSerializer fields |
| `shopgenie/settings.py` | Django settings (DRF pagination, ALLOWED_HOSTS, DB) |

**Files changed:** None. This increment is strictly read-only verification.

---

## 2. API Configuration Findings

### Configured API Base URL

**File:** `lib/services/api_config.dart:12-36`

| Environment | Base URL | Notes |
|-------------|----------|-------|
| Android emulator (dev) | `http://10.0.2.2:8000/api` | `10.0.2.2` routes from emulator to host machine's localhost |
| Production | `https://api.shopgenie.example.com/api` | Placeholder — replace with real host before release |
| Physical Android device | Not configured | `10.0.2.2` does not route from a physical device; must set `overrideBaseUrl` to the host's LAN address |
| Windows desktop | `http://10.0.2.2:8000/api` | Falls through to `devBaseUrl` since `Platform.isAndroid` is false — works if backend is on `localhost:8000` |

### Endpoint Construction

| Endpoint | Path | Query Params | Auth Required |
|----------|------|--------------|---------------|
| Shop list | `GET /api/shops/` | `page`, `page_size`, `category`, `search` | No (public GET) |
| Shop detail | `GET /api/shops/<id>/` | None | No (public GET) |
| Product list | `GET /api/products/?shop=<id>` | `shop` | No (public GET via `IsAuthenticatedOrReadOnly`) |

All requests are routed through `ApiConfig` so the base URL lives in one place (`api_config.dart:62-66`).

### Configuration Issues Discovered

1. **`page_size` query param sent but likely ignored**: `fetchShops()` sends `page_size` (shop_api_service.dart:49), but DRF's `PageNumberPagination` does not accept `page_size` by default unless `max_page_size` is configured in REST_FRAMEWORK settings (settings.py:72-78 — no `max_page_size` present). The `page_size` param is harmless but has no effect; only `page` is honored.

2. **Physical device address not configured**: For physical Android testing, `overrideBaseUrl` (api_config.dart:39) must be set to the host's LAN address at app startup. `10.0.2.2` and `127.0.0.1` are both unreachable from a physical device.

3. **Windows desktop uses emulator URL**: Since `Platform.isAndroid` is false on Windows, `baseUrl` falls through to `devBaseUrl` (`http://10.0.2.2:8000/api`). This works only if the backend is reachable at `localhost:8000` from the Windows machine.

### Authentication for Public Discovery

Confirmed from backend source:
- **Shop list/detail**: `ShopViewSet.permission_classes = [IsPublicReadOrAuthenticated]` (views.py:28) — GET allowed for all, including unauthenticated.
- **Product list**: `ProductViewSet.permission_classes = [IsAuthenticatedOrReadOnly]` (products/views.py:19) — GET (SAFE_METHODS) allowed for all, including unauthenticated.
- No token, password, or credential is needed for public shop/product discovery.

---

## 3. Backend Reachability

**Result: BACKEND NOT RUNNING**

```
WARNING: TCP connect to (127.0.0.1 : 8000) failed
TcpTestSucceeded : False
```

The Django development server is not listening on port 8000. Live HTTP endpoint verification could not be performed.

### Command to Start the Backend

From the backend directory (`R:/shopgenie backend/shopgenie_unified`):

```bash
cd "R:/shopgenie backend/shopgenie_unified"
python manage.py runserver 0.0.0.0:8000
```

**Prerequisites:** A PostgreSQL database must be running on `localhost:5432` (settings.py:51-52, default DB_HOST=localhost, DB_PORT=5432). The `.env` file contains DB credentials (not inspected, per safety rules).

**ALLOWED_HOSTS**: `localhost,127.0.0.1` (settings.py:10). The emulator's `10.0.2.2` maps to the host, so the host's own address must be in ALLOWED_HOSTS for emulator access — `localhost`/`127.0.0.1` covers this.

No services were started, stopped, or reconfigured, per safety rules.

---

## 4. Live Endpoint Testing

**Status: NOT PERFORMED** — backend is not running.

No GET requests were made to `/api/shops/` or `/api/products/?shop=<id>`. No response format validation, no shop count, no product parsing verification was possible against a live server.

### Expected Response Contracts (from source inspection, not live testing)

**Shop list** (`GET /api/shops/`):
```json
{
  "count": int,
  "next": "url|null",
  "previous": "url|null",
  "results": [
    {
      "id": int,
      "name": string,
      "category": string,
      "description": string,
      "address": string,
      "phone": string,
      "business_hours": string,
      "hours": string (alias for business_hours),
      "rating": string (Decimal, e.g. "4.50"),
      "status": string
    }
  ]
}
```
Paginated via DRF `PageNumberPagination` (PAGE_SIZE=20). Filterable by `category`, `status`; searchable by `name`, `category`; orderable by `name`, `category`, `created_at`, `rating`.

**Shop detail** (`GET /api/shops/<id>/`):
Single `ShopPublicSerializer` object (not paginated), same fields as above.

**Product list** (`GET /api/products/?shop=<id>`):
```json
{
  "count": int,
  "next": "url|null",
  "previous": "url|null",
  "results": [
    {
      "id": int,
      "shop": int,
      "store_id": string (shop.id),
      "store_name": string (shop.name),
      "name": string,
      "category": string,
      "brand": string,
      "size": string,
      "description": string,
      "mrp": string (Decimal),
      "selling_price": string (Decimal),
      "price": string (alias for selling_price),
      "stock_quantity": string (Decimal, 3 dp),
      "unit": string,
      "image_url": string
    }
  ]
}
```
Filtered by `shop` query param. Public visibility: `status=PUBLISHED AND shop__status=PUBLISHED`. `cost_price` is NOT in `ProductPublicSerializer` — not exposed to customers.

---

## 5. Customer App UI Verification

**Status: NOT VERIFIED** — backend not running, no emulator or physical device available.

| Check | Status | Reason |
|-------|--------|--------|
| Home screen displays real shops | NOT VERIFIED | No live backend |
| Shop detail displays API products | NOT VERIFIED | No live backend |
| Prices and MRP displayed correctly | NOT VERIFIED | No live backend |
| Empty responses show empty state | NOT VERIFIED | No live backend |
| Network failures show retry | NOT VERIFIED | No live backend |
| Add to Bag works with live products | NOT VERIFIED | No live backend |

The client-side code is implemented and unit-tested (see Section 6), but actual end-to-end verification against a running Django server was not possible.

---

## 6. Regression Tests

### flutter test

```
All tests passed!
```

**Total: 70 passed, 0 failed**

| Test File | Tests | Status |
|-----------|-------|--------|
| `test/model_compat_test.dart` | 10 | PASS |
| `test/product_api_service_test.dart` | 26 | PASS |
| `test/shop_api_service_test.dart` | 28 | PASS |
| `test/shop_detail_screen_test.dart` | 6 | PASS |

No real network requests are made — all HTTP calls use `MockHttpClient` stubs extending `http.BaseClient`, with `ShopService.setHttpClientForTesting()` as the injection seam.

### flutter analyze

```
9 issues found (ran in 4.2s)
```

**Zero errors.** All 9 are pre-existing warnings/infos, none introduced by this increment:

| File | Line | Diagnostic | Severity | Status |
|------|------|------------|----------|--------|
| `lib/screens/map_screen.dart` | 566 | `prefer_const_constructors` | info | Pre-existing |
| `lib/screens/map_screen.dart` | 568 | `prefer_const_literals_to_create_immutables` | info | Pre-existing |
| `lib/widgets/ai_detection_overlay.dart` | 360 | Unreachable switch default clause | warning | Pre-existing |
| `lib/widgets/ai_detection_overlay.dart` | 403 | Unreachable switch default clause | warning | Pre-existing |
| `test/product_api_service_test.dart` | 405 | `prefer_const_constructors` | info | False positive (non-const ctor) |
| `test/shop_api_service_test.dart` | 264 | `prefer_const_constructors` | info | Pre-existing false positive |
| `test/shop_api_service_test.dart` | 470 | `prefer_const_constructors` | info | Pre-existing false positive |
| `test/shop_api_service_test.dart` | 475 | `prefer_const_constructors` | info | Pre-existing false positive |
| `test/shop_detail_screen_test.dart` | 252 | `prefer_const_constructors` | info | False positive (non-const ctor) |

---

## 7. Unverified Items and Blockers

| Item | Status | Reason |
|------|--------|--------|
| Live `/api/shops/` GET | BLOCKED | Backend not running |
| Live `/api/products/?shop=<id>` GET | BLOCKED | Backend not running |
| Home screen with real shops | BLOCKED | No live backend |
| Shop detail with live products | BLOCKED | No live backend |
| Price/MRP display verification | BLOCKED | No live backend |
| Empty state verification | BLOCKED | No live backend |
| Retry on network failure | BLOCKED | No live backend |
| Add to Bag with live products | BLOCKED | No live backend |
| Android emulator connectivity | NOT TESTED | No emulator available |
| Physical Android device connectivity | NOT TESTED | No device available |
| Windows desktop localhost connectivity | NOT TESTED | Backend not running |

### To Complete Verification

1. Start a PostgreSQL database (per `.env` DB settings).
2. Run `python manage.py runserver 0.0.0.0:8000` from `R:/shopgenie backend/shopgenie_unified`.
3. Verify `GET http://localhost:8000/api/shops/` returns paginated shop data.
4. Verify `GET http://localhost:8000/api/products/?shop=<id>` returns products for a real shop ID.
5. Run the Flutter app on an emulator/device pointing at the backend and confirm shop/product screens render live data.

---

## 8. Confirmations

- ✅ Django backend was not modified (read-only inspection only)
- ✅ Database schemas and migrations were not touched
- ✅ No database resets, deletions, or seeding
- ✅ Shop Owner app was not modified
- ✅ No Smart Bag, checkout, payment, or billing integration
- ✅ No passwords, tokens, or .env contents exposed
- ✅ No live API calls replaced with mock-data fallbacks
- ✅ Live verification NOT claimed — backend was unavailable
- ✅ No files were changed in this increment
