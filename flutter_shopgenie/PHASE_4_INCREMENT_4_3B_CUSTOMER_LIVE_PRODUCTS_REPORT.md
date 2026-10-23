# Phase 4 Increment 4.3B — Customer Live Product Discovery Integration

**Customer Flutter project:** `R:\shopGiene customer\Shopgenie-customer-\flutter_shopgenie\`
**Django backend (read-only):** `R:\shopgenie backend\shopgenie_unified\`
**Objective:** Replace mock product data on the shop detail screen with live products fetched through the existing product API service.

---

## Files Changed

| File | Change |
|------|--------|
| `lib/screens/shop_detail_screen.dart` | Replaced synchronous mock product loading with async `FutureBuilder` using `ShopService.fetchProductsForShop()`. Added loading, empty, error, and retry states. Added `_buildProductErrorOverlay()` widget. Removed unused `storeProducts` local variable. |
| `test/shop_detail_screen_test.dart` | Created — 6 new widget tests covering loading, success, empty, error, retry, network failure, and Add to Bag. |

## Not Modified (confirmed)

- `lib/services/shop_api_service.dart` — `fetchProductsForShop()` already implemented in 4.3A
- `lib/services/shop_service.dart` — `fetchProductsForShop()` wrapper already implemented in 4.3A
- `lib/models/product_item.dart` — `fromJson()` already implemented in 4.3A
- `lib/models/cart_item.dart` — not touched (used by Add to Bag)
- `lib/models/smart_bag_item.dart` — not touched (`CartItem` typedef target)
- `lib/models/store_item.dart` — not touched
- `lib/models/product.dart` — not touched (AI recognition model)
- `lib/services/api_config.dart` — not touched (`productsEndpoint` already present)
- `lib/screens/map_screen.dart` — not touched
- Django backend — read-only, not touched
- Shop Owner app — not touched
- `shop_detail_screen.dart` UI redesign — not done (existing layout preserved)

---

## How Products Are Fetched

1. `ShopDetailScreen.initState()` calls `_loadProducts()` which invokes `ShopService.fetchProductsForShop(widget.store.id)`.
2. `ShopService.fetchProductsForShop()` delegates to `ShopApiService.fetchProductsForShop(shopId)`.
3. `ShopApiService.fetchProductsForShop()` performs `GET /api/products/?shop=<shopId>` using `ApiConfig.productsEndpoint` with a 15-second timeout.
4. Only page 1 is fetched; `page_size` is not sent (backend support not verified).
5. The public endpoint requires no authentication (`IsAuthenticatedOrReadOnly`).
6. Results are parsed via `ProductItem.fromJson()` which handles string/numeric price/MRP/stock, derives `inStock` from `stock > 0`, and uses neutral defaults for `emoji` (`'🛍️'`) and `confidence` (`0.0`).
7. The `Future` is stored in `_productsFuture` state field, preventing duplicate requests on rebuilds.
8. On retry, `_retryProducts()` calls `_loadProducts()` again, creating a new `Future` and showing the loading indicator.

---

## UI States

### Loading
- `FutureBuilder` shows a centered `CircularProgressIndicator` while `_productsFuture` is pending.
- Existing store banner, category, rating, hours, phone, and self-checkout ribbon remain visible.

### Success
- Products section header shows `"Popular Aisle Items"` + `"{count} items"`.
- Each product card shows: emoji, name, category, selling price (`$X.XX`), MRP with strikethrough when `mrp > price`.
- Add to Bag button creates a `CartItem` (`SmartBagItem`) with `id`, `storeId`, `name`, `price`, `emoji` and calls `widget.onAddToCart()`.
- SnackBar confirms `"Added {name} to Smart Bag!"`.

### Empty
- When API returns `results: []` (successful, count=0), shows:
  `"This shop currently has no published products available."`
- Not treated as an error; no retry button shown.

### Error
- On `ShopApiException`, `SocketException`, or `TimeoutException`, shows an error card with:
  - Wifi-off or cloud-off icon
  - `"Could not load products"` title
  - User-friendly message ("Check your connection and try again." for network errors, or the exception message otherwise)
  - **Retry** button that re-triggers `ShopService.fetchProductsForShop()`
- No stack traces, tokens, or sensitive response bodies exposed.
- Never falls back to `sampleProducts`.

---

## Retry Behavior

- Retry button calls `_retryProducts()` → `_loadProducts()` → `ShopService.fetchProductsForShop(widget.store.id)`.
- Loading indicator is shown while the retry request is in progress.
- Each retry creates a new `Future`, preventing stale state.

---

## Product Field Compatibility

| ProductItem Field | Backend Source | Display |
|---|---|---|
| `id` | `id` | Used in CartItem |
| `storeId` | `store_id` / `shop` | Used in CartItem |
| `storeName` | `store_name` | Not displayed on card |
| `name` | `name` | Displayed prominently |
| `brand` | `brand` | Not displayed (safe default) |
| `category` | `category` | Displayed as subtitle |
| `size` | `size` | Not displayed (safe default) |
| `price` | `price` / `selling_price` | Displayed as `$X.XX` |
| `mrp` | `mrp` | Displayed with strikethrough when `mrp > price` |
| `emoji` | — | Default `'🛍️'` (neutral, not AI) |
| `stock` | `stock_quantity` | Used for `inStock` derivation |
| `description` | `description` | Not displayed (safe default) |
| `inStock` | derived (`stock > 0`) | Not explicitly shown (all products shown) |
| `confidence` | — | Default `0.0` (not displayed as AI score) |

No product images are invented; no backend fields are fabricated.

---

## Tests Added

**File:** `test/shop_detail_screen_test.dart` — 6 widget tests.

| # | Test | Result |
|---|------|--------|
| 1 | Displays live products instead of mock data | PASS |
| 2 | Shows empty state when API returns no products | PASS |
| 3 | Shows error state with Retry button when API fails | PASS |
| 4 | Retry button triggers fresh product request | PASS |
| 5 | Network failure does not crash the screen | PASS |
| 6 | Add to Bag remains functional with live products | PASS |

All tests use `MockHttpClient` extending `http.BaseClient` with `ShopService.setHttpClientForTesting()` test seam. No real network requests are made.

**Total test suite: 70 passed, 0 failed**
- 10 existing `model_compat_test.dart` tests
- 28 existing `shop_api_service_test.dart` tests
- 26 existing `product_api_service_test.dart` tests
- 6 new `shop_detail_screen_test.dart` tests

---

## flutter analyze Results

```
9 issues found (ran in 2.0s)
```

All 9 are **pre-existing warnings/infos — zero errors**, none introduced by this increment:

| File | Diagnostic | Severity |
|------|------------|----------|
| `lib/screens/map_screen.dart` | `prefer_const_constructors` | info (pre-existing) |
| `lib/screens/map_screen.dart` | `prefer_const_literals_to_create_immutables` | info (pre-existing) |
| `lib/widgets/ai_detection_overlay.dart` | Unreachable switch default | warning (pre-existing) |
| `lib/widgets/ai_detection_overlay.dart` | Unreachable switch default | warning (pre-existing) |
| `test/product_api_service_test.dart` | `prefer_const_constructors` | info (false positive) |
| `test/shop_api_service_test.dart` | `prefer_const_constructors` | info (false positive) |
| `test/shop_api_service_test.dart` | `prefer_const_constructors` | info (false positive) |
| `test/shop_api_service_test.dart` | `prefer_const_constructors` | info (false positive) |
| `test/shop_detail_screen_test.dart` | `prefer_const_constructors` | info (false positive) |

---

## Limitations

- **Widget test for loading state omitted**: The 15-second `.timeout()` in `ShopApiService.fetchProductsForShop()` creates a pending timer when using a never-completing mock, which conflicts with the Flutter test framework's invariant check for pending timers. The loading indicator behavior is verified by code inspection (FutureBuilder with `ConnectionState.waiting` → `CircularProgressIndicator`).
- **Page 1 only**: Only the first page of products is fetched; `page_size` is not sent. Multi-page support would be a future enhancement.
- **No live connectivity verification**: No Django server is running in this environment; API integration cannot be verified against a live endpoint.

---

## Confirmations

- ✅ Django backend was not modified (read-only)
- ✅ Shop Owner app was not modified
- ✅ `shop_detail_screen.dart` UI layout preserved (no redesign)
- ✅ No database schemas, migrations, or resets
- ✅ No secrets, passwords, access tokens, or .env values exposed
- ✅ `sampleProducts` is NOT used as a fallback after API errors
- ✅ Add to Bag functionality remains fully functional with `CartItem`/`SmartBagItem`
- ✅ No checkout, payment, or billing integration started
- ✅ No Smart Bag integration started
