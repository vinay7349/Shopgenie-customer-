# Phase 4 Increment 4.3A — Product API Service and Model Report

**Customer Flutter project:** `R:\shopGiene customer\Shopgenie-customer-\flutter_shopgenie\`
**Django backend (read-only):** `R:\shopgenie backend\shopgenie_unified\`
**Objective:** Implement and test the product API service and JSON model compatibility. No UI integration yet.

---

## Files Changed

| File | Change |
|------|--------|
| `lib/models/product_item.dart` | Added `ProductItem.fromJson()` factory constructor and two static parsing helpers (`_parseMoney`, `_parseStock`) |
| `lib/services/shop_api_service.dart` | Added `import '../models/product_item.dart'` and `fetchProductsForShop()` method |
| `lib/services/shop_service.dart` | Added `fetchProductsForShop()` wrapper method delegating to `ShopApiService` |
| `test/product_api_service_test.dart` | Created — 26 new tests covering model parsing and service behavior |

## Not Modified (confirmed)

- `lib/screens/shop_detail_screen.dart` — not touched (UI integration deferred to later increment)
- `lib/models/product.dart` — not touched (AI recognition model, unrelated)
- `lib/models/store_item.dart` — not touched
- `lib/services/api_config.dart` — not touched (product endpoint constants already present)
- Django backend — read-only, not touched
- Shop Owner app — not touched

---

## ProductItem JSON Mapping

| ProductItem Field | Type | Backend Source Field | Backend Type | Mapping Notes |
|---|---|---|---|---|
| `id` | String | `id` | int | `.toString()` |
| `storeId` | String | `store_id` (or `shop` fallback) | string/int | `.toString()` |
| `storeName` | String | `store_name` | string | as-is |
| `name` | String | `name` | string | as-is, default 'Unknown Product' |
| `brand` | String | `brand` | string | default '' |
| `category` | String | `category` | string | default '' |
| `size` | String | `size` | string | default '' |
| `price` | double | `price` (alias for selling_price) | string/num | parse via `_parseMoney` |
| `mrp` | double | `mrp` | string/num | parse via `_parseMoney` |
| `emoji` | String | — | — | default `'🛍️'` (not in backend) |
| `stock` | double | `stock_quantity` | string/num | parse via `_parseStock` |
| `description` | String | `description` | string | default '' |
| `inStock` | bool | — | — | derived: `stock > 0` |
| `confidence` | double | — | — | default `0.0` (not in backend) |

### Parsing Helpers

- `_parseMoney(dynamic)` — accepts `num` (direct `.toDouble()`), `String` (via `double.tryParse`), or null/invalid (returns `0.0`). Falls back from `price` to `selling_price` key.
- `_parseStock(dynamic)` — same strategy as `_parseMoney`, preserves fractional quantities (e.g. `"2.500"` → `2.5`).

### Invalid/Missing Handling
- Missing/invalid price or MRP → `0.0` (safe default, consistent with existing `Product.fromJson` pattern)
- Missing `id` → `''`; missing `name` → `'Unknown Product'`
- Non-map entries in `results` are skipped without crashing

---

## Endpoint and Query Parameters

- **Endpoint:** `GET /api/products/` (via `ApiConfig.productsEndpoint`)
- **Query parameter:** `?shop=<shopId>` only
- **`page_size`:** NOT sent — backend support not verified (DRF `PageNumberPagination` does not accept `page_size` by default)
- **Page:** Only page 1 is fetched. If results span multiple pages, only the first page is returned; this limitation is documented in the code comment.
- **Authentication:** Not required for public GET (backend uses `IsAuthenticatedOrReadOnly`)
- **Public visibility:** Only products with `status=PUBLISHED` AND `shop__status=PUBLISHED` are returned to unauthenticated customers

---

## Pagination Behavior and Limitations

- Uses DRF default `PageNumberPagination` response shape: `{count, next, previous, results}`
- Only `page=1` is implicitly requested (no `page` or `page_size` query params sent)
- If more than 20 products exist (default `PAGE_SIZE`), only the first page is returned; the caller cannot determine total count from this call alone (though `count` is in the response)
- This is a known limitation documented for the next increment to address

---

## Error Handling Behavior

| Scenario | Result |
|---|---|
| HTTP 200 + valid paginated JSON | Returns `List<ProductItem>` from `results` |
| HTTP 200 + empty `results` | Returns empty list (not an error) |
| HTTP 4xx/5xx | Throws `ShopApiException` with `statusCode` |
| Malformed JSON (`FormatException`) | Throws `ShopApiException` (no response body exposed) |
| Non-Map JSON root | Throws `ShopApiException` |
| Missing `results` key | Throws `ShopApiException` |
| `results` not a List | Throws `ShopApiException` |
| Network failure (`SocketException`) | Propagates as `SocketException` (classified as network failure by `isNetworkFailure()`) |
| Timeout (15s) | Throws `TimeoutException` |
| API error | Never falls back to `sampleProducts` |

---

## Tests Added

**File:** `test/product_api_service_test.dart` — 26 tests in 3 groups.

### `ProductItem.fromJson` (11 tests)
1. Parses valid product with numeric fields (id 42, price 8.5, mrp 10.0, stock 5.0)
2. Parses string IDs correctly (`id: 'abc-123'`, `shop: 'shop-7'`)
3. Parses numeric price and MRP
4. Parses string price and MRP
5. Uses `selling_price` as fallback for `price`
6. Parses fractional stock quantity (`"2.500"` → `2.5`)
7. Derives `inStock` false when stock is zero
8. Derives `inStock` true when stock is positive
9. Handles missing optional fields gracefully (defaults applied)
10. Handles null optional string fields
11. Uses `shop` field as `storeId` fallback

### `ShopApiService.fetchProductsForShop` (12 tests)
1. Parses valid paginated product response (count=2, results with 2 products)
2. Returns empty list for empty results (count=0, results=[])
3. Forwards `shop` ID query parameter correctly
4. Normalizes integer shop ID (`"007"` → `"7"`)
5. Does NOT send `page_size` query parameter
6. Throws `ShopApiException` with `statusCode` on HTTP 404
7. Throws `ShopApiException` with `statusCode` on HTTP 500
8. Throws `ShopApiException` on malformed JSON
9. Throws `ShopApiException` when response is not a map
10. Throws `ShopApiException` when `results` key is missing
11. Throws `ShopApiException` when `results` is not a list
12. Skips non-map entries in results without crashing
13. Propagates `SocketException` on network failure

### `ShopService.fetchProductsForShop` wrapper (2 tests)
1. Delegates to `ShopApiService` and returns parsed list
2. Never falls back to mock data on API error

---

## Validation Results

### flutter test
```
All tests passed!
```
**Total: 64 passed, 0 failed**
- 10 existing `model_compat_test.dart` tests (preserved unchanged)
- 28 existing `shop_api_service_test.dart` tests (preserved unchanged)
- 26 new `product_api_service_test.dart` tests

No real network calls are made by tests — all HTTP calls go through `MockHttpClient` stub extending `http.BaseClient`.

### flutter analyze
```
8 issues found (ran in 2.3s)
```
All 8 are **pre-existing warnings/infos — zero errors**, none introduced by this increment:

| File | Line | Diagnostic | Severity |
|------|------|------------|----------|
| `lib/screens/map_screen.dart` | 566 | `prefer_const_constructors` | info (pre-existing) |
| `lib/screens/map_screen.dart` | 568 | `prefer_const_literals_to_create_immutables` | info (pre-existing) |
| `lib/widgets/ai_detection_overlay.dart` | 360 | Unreachable switch default clause | warning (pre-existing) |
| `lib/widgets/ai_detection_overlay.dart` | 403 | Unreachable switch default clause | warning (pre-existing) |
| `test/product_api_service_test.dart` | 405 | `prefer_const_constructors` | info (false positive — `ShopApiException` has no const constructor) |
| `test/shop_api_service_test.dart` | 264 | `prefer_const_constructors` | info (pre-existing false positive) |
| `test/shop_api_service_test.dart` | 470 | `prefer_const_constructors` | info (pre-existing false positive) |
| `test/shop_api_service_test.dart` | 475 | `prefer_const_constructors` | info (pre-existing false positive) |

---

## Confirmations

- ✅ Django backend was not modified (read-only)
- ✅ Shop Owner app was not modified
- ✅ `shop_detail_screen.dart` was not modified
- ✅ No database schemas, migrations, or resets were performed
- ✅ No secrets, passwords, access tokens, or .env values exposed
- ✅ `sampleProducts` is NOT used as a fallback after API errors
- ✅ No backend fields were invented or changed
- ✅ No duplicate infrastructure created (reused `ShopApiException`, `ShopApiService`, `http.Client` injection, `ApiConfig`)
- ✅ Existing `getProductsForStore()` and `sampleProducts` preserved for unrelated features
- ✅ All existing tests preserved and passing
