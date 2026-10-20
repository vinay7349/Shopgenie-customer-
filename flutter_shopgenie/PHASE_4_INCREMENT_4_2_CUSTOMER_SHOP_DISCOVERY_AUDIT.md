# Phase 4 Increment 4.2 — Customer Live Shop Discovery Audit

**Customer Flutter project:** `R:\shopGiene customer\Shopgenie-customer-\flutter_shopgenie\`
**Django backend (read-only):** `R:\shopgenie backend\shopgenie_unified\`
**Audit type:** Read-only inspection — no files modified.

---

## Summary Table

| # | Audit Item | Status | Key Evidence |
|---|-----------|--------|-------------|
| 1 | API configuration & HTTP client | PASS | `lib/services/api_config.dart`, `lib/services/shop_api_service.dart`, `pubspec.yaml` (http ^1.2.0) |
| 2 | GET /api/shops/ implemented & called | PASS | `ShopApiService.fetchShops()` → `_client.get(uri)`; called from `HomeScreen._loadShops()` and `MapScreen._loadShops()` |
| 3 | Pagination handling | PASS | Backend DRF PageNumberPagination → `{count, next, previous, results}`; client reads `decoded['results']`, sends `page`/`page_size` |
| 4 | Home screen uses live data | PASS | `FutureBuilder` with `_shopsFuture = ShopService.fetchShops()` |
| 5 | Map screen uses live data | PASS | `_shopsFuture = ShopService.fetchShops()` + `_cachedStores` |
| 6 | StoreItem.fromJson backend compatibility | PASS | Backend fields mapped; missing fields use defaults |
| 7 | Loading / empty / error / retry states | PARTIAL | HomeScreen: all present. MapScreen: loading only; error returns `SizedBox.shrink()` (silent) |
| 8 | No silent mock fallback on API failure | PASS (Home) / PARTIAL (Map) | HomeScreen shows error UI; MapScreen silently shrinks |
| 9 | API base URL for Android emulator | PASS | `http://10.0.2.2:8000/api` in `api_config.dart` |
| 10 | Shop detail navigation & ID preservation | PASS | `ShopDetailScreen` receives `StoreItem store` via `onSelectStore(store)`; ID in `widget.store.id` |
| 11 | Tests | PARTIAL | Only `test/model_compat_test.dart` (10 model parsing tests); no service/API tests |

---

## 1. API Configuration & HTTP Client — PASS

**Files:** `lib/services/api_config.dart:1-77`, `lib/services/shop_api_service.dart`, `pubspec.yaml:17`

- `ApiConfig` centralizes the base URL in one place. `baseUrl` getter returns `http://10.0.2.2:8000/api` for Android development, or `prodBaseUrl` (`https://api.shopgenie.example.com/api`) when `useProduction` is true.
- `shopsEndpoint = '/shops/'` (line 44); `shopDetailEndpoint(id) = '/shops/$id/'` (line 45).
- `urlWithQuery()` URL-encodes keys/values via `Uri.encodeComponent` (lines 65-76).
- `http: ^1.2.0` is declared in `pubspec.yaml:17` — no duplicate client.
- `ShopApiService` wraps all HTTP calls with a 15-second timeout (lines 61-63, 106-108).

## 2. GET /api/shops/ Implemented & Actually Called — PASS

**Files:** `lib/services/shop_api_service.dart:39-93`, `lib/services/shop_service.dart:360-378`, `lib/screens/home_screen.dart:63-67,72`, `lib/screens/map_screen.dart:34-41`

- `ShopApiService.fetchShops()` performs `GET /shops/` with `page` and `page_size` query params, plus optional `category` and `search`.
- `ShopService.fetchShops()` (shop_service.dart:360) delegates to `ShopApiService`.
- `HomeScreen._loadShops()` (home_screen.dart:63) calls `ShopService.fetchShops()`.
- `MapScreen._loadShops()` (map_screen.dart:34) calls `ShopService.fetchShops()`.
- Confirmed the endpoint is actually invoked from both the Home and Map screens.

## 3. Pagination Handling — PASS

**Backend:** `shopgenie/settings.py:72-78` — `DEFAULT_PAGINATION_CLASS = "rest_framework.pagination.PageNumberPagination"`, `PAGE_SIZE: 20`.
**Backend response shape:** `{ "count": int, "next": string|null, "previous": string|null, "results": [...] }` (DRF default, confirmed in views.py:26-41 and serializers.py:5-21).
**Client:** `shop_api_service.dart:72-92` — decodes JSON, validates `decoded` is a Map, validates `results` is a List, then maps each entry via `StoreItem.fromJson`. Empty `results` returns an empty list (no exception).
**Query params:** `page` and `page_size` are always sent (lines 45-48). `category` and `search` are forwarded when non-empty (lines 49-54).
**Backend filter support:** `filterset_fields = ["category", "status"]` (views.py:30), `search_fields = ["name", "category"]` (views.py:31), `ordering_fields` (views.py:32). The client forwards `category` and `search`, which the backend supports.

## 4. Home Screen Uses Live API Data — PASS

**File:** `lib/screens/home_screen.dart:53-77,572-721`

- `_shopsFuture` (line 54) is initialized in `initState()` via `_loadShops()` (line 60).
- `FutureBuilder<List<StoreItem>>` (line 572) builds the store grid from `snapshot.data`.
- **NOT hardcoded mock:** `ShopService.sampleStores` is NOT used for the live store grid. `filterStores(stores: allStores, ...)` (line 664) filters the live list.
- Mock data (`sampleStores`) still exists in `shop_service.dart` but is only used by other screens (feed, search) — not as a fallback here.

## 5. Map Screen Uses Live Shop Data — PASS

**File:** `lib/screens/map_screen.dart:22-26,34-41,48-51,162-191`

- `_shopsFuture` (line 25) and `_cachedStores` (line 26) hold live data.
- `_loadShops()` (line 34) calls `ShopService.fetchShops()`.
- `filteredStores` (line 48) filters `_cachedStores`.
- Map markers (lines 162-191) are built from `snapshot.data.take(5)`.
- **NOT hardcoded mock:** `ShopService.sampleStores` is NOT referenced anywhere in map_screen.dart.
- Limitation noted: backend `Shop` model has no `lat`/`lng` fields (accounts/models.py:22-25), so markers are placed on a fixed grid (`_markerPositions`, lines 478-484). No coordinates are invented; all shops share the default `lat`/`lng` from `StoreItem` (12.9250 / 77.5220).

## 6. StoreItem.fromJson Backend Compatibility — PASS

**File:** `lib/models/store_item.dart:76-95`
**Backend serializer:** `shopgenie/shops/serializers.py:5-21` — fields: `id, name, category, description, address, phone, business_hours, hours, rating, status`.

| StoreItem field | Backend source | Mapping status |
|----------------|---------------|----------------|
| `id` | `id` (int) | `.toString() ?? ''` — handles int/string ✓ |
| `name` | `name` | ✓ |
| `category` | `category` | ✓ |
| `description` | `description` | ✓ |
| `address` | `address` | ✓ |
| `phone` | `phone` | ✓ |
| `hours` | `business_hours` (aliased as `hours`) | `json['hours'] ?? json['business_hours']` ✓ |
| `rating` | `rating` (DecimalField → string "4.50") | `_formatRating` handles string + num ✓ |
| `status` | `status` | Not mapped (not needed by UI) — ignored ✓ |
| `distance` | N/A | Defaults to `''` ✓ |
| `emoji` | N/A | Defaults to `'🛒'` ✓ |
| `selfCheckout` | N/A | Defaults to `false` ✓ |
| `offer` | N/A | Defaults to `null` ✓ |
| `lat`/`lng` | N/A | Defaults to `12.9250` / `77.5220` (invented defaults) ⚠️ |
| `followers` | N/A | Defaults to `384` ⚠️ |
| `isFollowing` | N/A | Defaults to `false` ⚠️ |

Backend fields are all correctly mapped. Non-backend fields use safe defaults. The `hours` field correctly falls back to `business_hours`. Rating parsing handles string ("4.50"), numeric, pre-formatted ("4.8 ★"), and null.

## 7. Loading / Empty / Error / Retry States — PARTIAL

**HomeScreen** (`lib/screens/home_screen.dart:572-721`): **PASS**
- Loading: `CircularProgressIndicator` + "Discovering nearby shops..." (lines 575-601).
- Error: Red-bordered card with icon, message, and **Retry** button calling `_retryShops()` (lines 604-661).
- Empty: "No stores found for '...'" with suggestion (lines 670-702).

**MapScreen** (`lib/screens/map_screen.dart:162-191`): **PARTIAL**
- Loading: 24×24 `CircularProgressIndicator` at map center (lines 165-177).
- Error: `snapshot.hasError` returns `const SizedBox.shrink()` (line 179) — **silent failure, no user feedback, no retry**.
- Empty: No shops → no markers rendered (stores list empty), but no empty-state UI.

## 8. No Silent Mock Fallback on API Failure — PASS (Home) / PARTIAL (Map)

**HomeScreen:** **PASS** — On error, shows error UI with Retry button. Never falls back to `ShopService.sampleStores`.
**MapScreen:** **PARTIAL** — On error, returns `SizedBox.shrink()` (line 179). No mock data is shown, but the failure is silent (user sees nothing). Does not violate the "no mock fallback" rule, but provides no error communication.

## 9. API Base URL for Android Emulator — PASS

**File:** `lib/services/api_config.dart:12-36`

- `devBaseUrl = 'http://10.0.2.2:8000/api'` (line 20) — Android emulator loopback to host.
- `baseUrl` getter (line 31): returns `overrideBaseUrl` if set, else `prodBaseUrl` if `useProduction`, else `devBaseUrl` on Android, else `devBaseUrl`.
- Doc comment (lines 25-36) documents that 10.0.2.2 routes from emulator to host, physical devices need a reachable host address, and production should use HTTPS.
- `overrideBaseUrl` (line 39) allows runtime override for physical device testing.
- Network security is NOT globally disabled (no `android:usesCleartextTraffic="true"` override found in AndroidManifest inspected).

## 10. Shop Detail Navigation & ID Preservation — PASS

**File:** `lib/screens/shop_detail_screen.dart:7-19`
**Navigation:** `MainNavigationScreen` passes `store` to `ShopDetailScreen` via `onSelectStore(store)` (home_screen.dart:715, map_screen.dart:448).
**ID preservation:** `widget.store.id` is preserved from the `StoreItem` passed in (line 8). The detail screen does NOT call `fetchShopById` — it uses the already-fetched `StoreItem` directly. This is acceptable since the list endpoint returns full shop data. `ShopService.fetchShopById()` exists (shop_service.dart:381) but is not invoked from the UI.
**Products:** `getProductsForStore(widget.store.id)` (line 39) uses mock `sampleProducts` — product API integration is out of scope for this increment.

## 11. Tests — PARTIAL

**File:** `test/model_compat_test.dart` — 10 tests, all passed previously. These test `StoreItem.fromJson` (integer/string/missing id, numeric/string/pre-formatted/null rating) and `Product.fromJson`. They do NOT test `ShopApiService`, `ShopService.fetchShops`, pagination, HTTP errors, network failures, or shop detail parsing.
**Missing test coverage:**
- Valid paginated shop response (`{count, next, previous, results}`)
- Empty results
- Integer and string shop IDs for detail
- String and numeric ratings
- Missing optional fields
- Malformed response structure
- HTTP error responses (404, 500)
- Network failures / timeouts
- Shop detail parsing
- Search/filter query parameters

---

## Blockers

1. **No service/API tests.** The new `ShopApiService` and `ShopService.fetchShops`/`fetchShopById` have zero test coverage. Network errors, pagination, malformed responses, and HTTP errors are untested.
2. **Map screen silent error.** `snapshot.hasError` returns `SizedBox.shrink()` — users get no feedback when shop discovery fails on the map tab.
3. **`fetchShopById` unused.** The detail endpoint client method exists but is never called from `ShopDetailScreen`. This is not a blocker (the list response is sufficient), but represents unused code.
4. **No live connectivity verification.** No Django server is running in this environment; the API integration cannot be verified against a live endpoint.

---

## Smallest Recommended Next Change

Add a test file `test/shop_service_test.dart` (or `test/shop_api_service_test.dart`) using `package:http` mocking (or direct `ShopApiService` calls with a stub `http.Client`) covering:
1. Valid paginated shop response → correct `List<StoreItem>` parsed.
2. Empty `results` → empty list, no exception.
3. Integer and string shop IDs for `fetchShopById`.
4. String ("4.50") and numeric (4.5) ratings.
5. Missing optional fields (`description`, `offer`, `phone`, etc.) → safe defaults.
6. Malformed response (non-Map, missing `results`, non-List `results`) → `ShopApiException`.
7. HTTP error status (404, 500) → `ShopApiException` with statusCode.
8. Network failure / timeout → `ShopApiException` with `isNetworkError = true`.
9. Shop detail parsing → single `StoreItem`.
10. Search/filter query parameters forwarded to the URL.

Optionally, add a retry button/error UI to the Map screen error branch to match HomeScreen parity.

No backend, Owner app, or map API changes are required.
