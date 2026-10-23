# Phase 4 Increment 4.3 — Customer Product Discovery API Audit

**Customer Flutter project:** `R:\shopGiene customer\Shopgenie-customer-\flutter_shopgenie\`
**Django backend (read-only):** `R:\shopgenie backend\shopgenie_unified\`
**Audit type:** Read-only inspection — no files modified.

---

## 1. Current Mock-Data Flow (Customer App)

### Where shop detail products come from
**File:** `lib/screens/shop_detail_screen.dart:39`
```dart
final storeProducts = ShopService.getProductsForStore(widget.store.id);
```

### Mock product lists used
**File:** `lib/services/shop_service.dart`
- `sampleProducts` — `List<ProductItem>` (lines 125–225): 6 hardcoded `ProductItem` instances with `storeId` values '1' and '2'. Used by `getProductsForStore()`.
- `sampleRecognizedProducts` — `List<Product>` (lines 227–300): 6 hardcoded `Product` instances used for AI product recognition (not shown on shop detail screen).
- `sampleStores` — `List<StoreItem>` (lines 27–123): 5 hardcoded stores.

### How the selected shop ID is passed to the detail screen
**File:** `lib/screens/shop_detail_screen.dart:8,39`
- `ShopDetailScreen` receives a `StoreItem store` via its constructor (line 8).
- `widget.store.id` (a `String`) is passed to `ShopService.getProductsForStore()` (line 39).
- The `StoreItem` is passed from the shop listing (home screen line 715, map screen line 448) via `onSelectStore(store)`.

### Current product model fields and types
**File:** `lib/models/product_item.dart:1–35`
```dart
class ProductItem {
  final String id;            // product id
  final String storeId;       // owning shop id
  final String storeName;     // owning shop name
  final String name;          // product name
  final String brand;         // brand
  final String category;      // category
  final String size;          // size
  final double price;         // selling price
  final double mrp;           // maximum retail price
  final String emoji;         // display emoji
  final double stock;         // stock quantity
  final String description;   // product description
  final bool inStock;         // availability flag
  final double confidence;    // AI confidence score
}
```

**File:** `lib/models/product.dart:1–87` (AI recognition model — not used on shop detail screen)
- Fields: id, name, brand, category, size, price, image, emoji, confidence, storeId, storeName
- `fromJson` handles `price` from either `price` or `selling_price` key (line 35); `storeId` from `store_id` or `shop` key (line 39)

### Existing loading, error, empty, retry behavior for products
**None.** Product data is loaded synchronously from mock data:
- `shop_service.dart:358–360` — `getProductsForStore()` returns `sampleProducts.where(...)` synchronously.
- No `Future`, no loading indicator, no error state, no retry button.
- Empty state exists only as static text ("Point camera at shelf items to identify with AI Product Scan!") when `storeProducts.isEmpty` (shop_detail_screen.dart:240–250), but this is for the mock-empty case, not an API error.

### Whether a product API service already exists
**No.** There is no `ProductApiService`, no `fetchProductsForShop()`, and no product-related HTTP client. The `ShopApiService` (`lib/services/shop_api_service.dart`) only covers shop endpoints (`/shops/`, `/shops/<id>/`). `ApiConfig` has reserved but unused product endpoint constants:
- `api_config.dart:50` — `productsEndpoint = '/products/'`
- `api_config.dart:51` — `productsRecognizeEndpoint = '/products/recognize/'`

---

## 2. Backend Product API Contract (Django, Read-Only)

### URL routing
**File:** `shopgenie/urls.py:7` — `path("api/products/", include("products.urls"))`
**File:** `products/urls.py:5–9` — `DefaultRouter` registers `ProductViewSet` at `""` with basename `"product"`, producing:
- `GET /api/products/` → list
- `GET /api/products/<pk>/` → detail
- `POST /api/products/` → create (owner/worker only)
- `PATCH/PUT /api/products/<pk>/` → update (owner/worker only)
- `DELETE /api/products/<pk>/` → delete (owner/worker only)

### Endpoint that can filter products by shop ID
**File:** `products/views.py:22` — `filterset_fields = ["shop", "category"]`
- `GET /api/products/?shop=<shop_id>` filters by shop.
- `GET /api/products/?category=<category>` filters by category.
- `GET /api/products/?search=<term>` searches name/category.
- `GET /api/products/?ordering=<field>` orders by name/category/mrp/selling_price/created_at.

### Exact response structure (paginated)
**File:** `shopgenie/settings.py:72–78` — DRF config:
```python
"DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
"PAGE_SIZE": 20,
```
Response shape:
```json
{
  "count": int,
  "next": "url|null",
  "previous": "url|null",
  "results": [ ... ]
}
```
Confirmed by backend test `products/tests.py:153–158` (`test_pagination`).

### Exact field names and types (public response)
**File:** `products/serializers.py:5–13` — `ProductPublicSerializer`:
```python
class ProductPublicSerializer(serializers.ModelSerializer):
    store_id = serializers.CharField(source="shop.id", read_only=True)
    store_name = serializers.CharField(source="shop.name", read_only=True)
    price = serializers.DecimalField(source="selling_price", max_digits=12, decimal_places=2, read_only=True)
    class Meta:
        model = Product
        fields = ["id", "shop", "store_id", "store_name", "name", "category", "brand", "size",
                  "description", "mrp", "selling_price", "price", "stock_quantity", "unit", "image_url"]
```

**File:** `products/models.py:5–32` — `Product` model:
| Model Field | Django Type | Public Serializer Output Type |
|---|---|---|
| id | BigAutoField (PK) | int |
| shop | ForeignKey → Shop | int (shop pk) |
| store_id | source=shop.id | string (CharField) |
| store_name | source=shop.name | string |
| name | CharField(200) | string |
| category | CharField(100) | string |
| brand | CharField(100, blank) | string |
| size | CharField(50, blank) | string |
| description | TextField(blank) | string |
| mrp | DecimalField(12,2) | string (e.g. "10.00") |
| selling_price | DecimalField(12,2) | string (e.g. "8.00") |
| price | alias for selling_price | string (e.g. "8.00") |
| stock_quantity | DecimalField(12,3) | string (e.g. "5.000") |
| unit | CharField(10, choices PIECE/KG/GRAM/LITER) | string |
| image_url | URLField(blank) | string |
| status | CharField(20, choices) | NOT in public fields |
| created_at | DateTimeField | NOT in public fields |
| updated_at | DateTimeField | NOT in public fields |

**Not in public response:** `cost_price` (confirmed by test `products/tests.py:43–51` and `123–126`), `status`, `created_at`, `updated_at`.

### Public visibility rules
**File:** `products/views.py:35–42` — `get_queryset()`:
- Unauthenticated customers see only: `Product.objects.filter(status=Product.Status.PUBLISHED, shop__status=Shop.Status.PUBLISHED)`
- Shop owners/workers see their own shop's products regardless of status.
- Detail endpoint returns 404 for products in draft/suspended shops (confirmed by `products/tests.py:105–111`).

### Authentication requirements
**File:** `products/views.py:19` — `permission_classes = [permissions.IsAuthenticatedOrReadOnly]`
- `GET` (list/detail): **No authentication required** — public read.
- `POST/PATCH/PUT/DELETE`: Authentication + owner/worker permission required.

**File:** `shopgenie/settings.py:73–74` — Default auth is JWT, default permission is `IsAuthenticated`, but the ViewSet overrides to `IsAuthenticatedOrReadOnly`.

### Empty product list and API error representation
- Empty list: paginated response with `"count": 0, "results": []` (standard DRF PageNumberPagination).
- HTTP errors: standard DRF responses (404 for not found, 400 for validation errors, 401/403 for auth).
- Backend test `products/tests.py:106–107` confirms detail returns 404 for unpublished-shop products.

---

## 3. Flutter / Backend Compatibility Table

| Flutter Field (ProductItem) | Type | Backend Field (Public) | Backend Type | Status |
|---|---|---|---|---|
| `id` | String | `id` | int | ✅ Compatible (`toString()`) |
| `storeId` | String | `store_id` (shop.id) | string | ✅ Compatible |
| `storeName` | String | `store_name` (shop.name) | string | ✅ Compatible |
| `name` | String | `name` | string | ✅ Compatible |
| `brand` | String | `brand` | string | ✅ Compatible |
| `category` | String | `category` | string | ✅ Compatible |
| `size` | String | `size` | string | ✅ Compatible |
| `price` | double | `price` (alias for selling_price) | string (Decimal) | ⚠️ Parse string → double |
| `mrp` | double | `mrp` | string (Decimal) | ⚠️ Parse string → double |
| `emoji` | String | — (not in backend) | — | ❌ Missing (needs default) |
| `stock` | double | `stock_quantity` | string (Decimal, 3 dp) | ⚠️ Parse string → double |
| `description` | String | `description` | string | ✅ Compatible |
| `inStock` | bool | — (derive from stock_quantity > 0) | — | ⚠️ Derived |
| `confidence` | double | — (not in backend) | — | ❌ Missing (needs default) |

### Fields requiring parsing or conversion
- `price` / `mrp`: Backend returns DecimalField as JSON string (e.g. `"8.00"`). Flutter `ProductItem.price`/`mrp` are `double`. Need `double.tryParse()`.
- `stock`: Backend returns `stock_quantity` as JSON string (e.g. `"5.000"`). Flutter `ProductItem.stock` is `double`. Need `double.tryParse()`.
- `id`: Backend returns int; Flutter `ProductItem.id` is String. Need `.toString()`.

### Missing optional fields (backend does not provide)
- `emoji`: No backend field. Would need a default (e.g. `'🛍️'`) or mapping from category.
- `confidence`: No backend field. Would need a default (e.g. `0.95`).
- `inStock`: No direct backend field. Derive from `stock_quantity > 0`.

### Endpoint / permission limitations
- Public GET is unauthenticated — suitable for customer app without token management.
- Products are filtered to `status=PUBLISHED` AND `shop__status=PUBLISHED` for public customers. A shop's products will not appear if the shop itself is DRAFT/SUSPENDED.
- `shop` filter accepts the shop's primary key (int). The Flutter `widget.store.id` is a String (e.g. `"1"`); DRF `DjangoFilterBackend` with `shop` as an integer FK will accept the string `"1"` via URL query param and coerce it.
- Pagination is page-based (`page`, `page_size` via DRF defaults? Actually DRF PageNumberPagination uses `page` query param; `page_size` only if configured). The existing `ShopApiService.fetchShops()` sends both `page` and `page_size`; for products, only `page` is standard. Need to verify `page_size` support — DRF's `PageNumberPagination` respects `page_size` query param only if `max_page_size` is set or via `page_size` attribute. By default it does NOT accept `page_size`. This is a potential mismatch.

---

## 4. Testing Audit (for Future Implementation)

Existing tests:
- `test/model_compat_test.dart` — 10 tests covering `StoreItem.fromJson` and `Product.fromJson` (AI recognition model). Preserved unchanged.
- `test/shop_api_service_test.dart` — 28 tests covering shop API service. Preserved unchanged.

### Smallest useful test set for product API implementation

| # | Scenario | What to verify |
|---|----------|----------------|
| 1 | Successful paginated product response | `{count, next, previous, results}` parses into `List<ProductItem>` |
| 2 | Empty product list | `count: 0, results: []` returns empty list, no exception |
| 3 | Filter by shop ID | `?shop=<id>` forwarded correctly; only matching shop's products returned |
| 4 | Malformed JSON | Invalid JSON body → `ShopApiException` |
| 5 | Missing `results` key | Non-Map or missing results → `ShopApiException` |
| 6 | HTTP 404 (detail) / 500 (list) | `ShopApiException` with correct `statusCode` |
| 7 | Network failure (`SocketException`) | Propagates as `ShopApiException` with `isNetworkError=true` |
| 8 | Timeout | 15s timeout → `ShopApiException` |
| 9 | String and numeric IDs/prices | `id` int→String; `price`/`mrp` string→double |
| 10 | No mock-data fallback | API error throws `ShopApiException`, never returns `sampleProducts` |

Tests should use `MockHttpClient` extending `http.BaseClient` (pattern already established in `test/shop_api_service_test.dart`), with `ShopService.setHttpClientForTesting()` test seam.

---

## 5. Proposed Minimal Implementation Plan

1. **Add product endpoints to `ApiConfig`** — already present (`productsEndpoint = '/products/'`). Add `productsByShopEndpoint` or reuse `productsEndpoint` with `?shop=` query param.
2. **Add `fetchProductsForShop(String shopId)` to `ShopApiService`** — `GET /api/products/?shop=<id>`, 15s timeout, paginated response parsing, `ShopApiException` on errors, malformed JSON → `ShopApiException`.
3. **Add `fetchProductsForShop` wrapper to `ShopService`** — delegates to `ShopApiService`, uses `_httpClientOverride` test seam, never falls back to `sampleProducts`.
4. **Add `ProductItem.fromJson()` factory** — parse backend public fields, handle string→double for price/mrp/stock, default emoji/confidence/inStock.
5. **Update `ShopDetailScreen`** — convert `storeProducts` to a `Future<List<ProductItem>>` with `FutureBuilder`: loading indicator, empty state, error state with retry, live data display. Preserve existing UI (price formatting, mrp strikethrough, Add to Bag).
6. **Add tests** — `test/product_api_service_test.dart` covering the 10 scenarios above.

---

## Risks and Unresolved Questions

1. **`page_size` query parameter support**: DRF's `PageNumberPagination` does not accept `page_size` by default unless `max_page_size` is configured in settings. The existing `ShopApiService.fetchShops()` sends `page_size`, which may be ignored by the backend. Need to verify whether the product endpoint accepts `page_size` or only `page`.
2. **`emoji` and `confidence` defaults**: Backend provides no emoji or confidence. Need to decide on default values (e.g. emoji from category mapping, confidence `0.95`).
3. **`inStock` derivation**: Need to decide threshold (stock_quantity > 0?).
4. **Image field naming**: Backend uses `image_url`; Flutter `Product` model uses `image`. `ProductItem` has no image field — UI uses emoji instead, so this may not be an issue for the shop detail screen.
5. **Decimal precision**: `stock_quantity` is DecimalField(12,3) — could have fractional stock (e.g. 2.500 kg). Flutter `stock` is `double`; parsing should handle 3 decimal places.
6. **Price field naming**: Backend public serializer exposes both `selling_price` and `price` (alias). Flutter uses `price`. Either field works; `price` is the alias specifically added for public consumers.
7. **No live connectivity tested**: No Django server is running in this environment; API integration cannot be verified against a live endpoint.

---

## Confirmation

- ✅ No Django backend files were modified or even opened for writing.
- ✅ No Shop Owner app files were modified.
- ✅ No application code in the Customer Flutter project was modified.
- ✅ No secrets, .env values, passwords, or tokens were exposed.
- ✅ No database resets or migrations were run.
- ✅ No Smart Bag, billing, checkout, or payment integration was started.
- ✅ This is strictly an audit report; no implementation changes were made.
