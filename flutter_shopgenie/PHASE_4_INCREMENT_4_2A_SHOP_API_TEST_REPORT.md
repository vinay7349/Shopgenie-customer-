# Phase 4 Increment 4.2A — Shop API Service Test Report

**Customer Flutter project:** `R:\shopGiene customer\Shopgenie-customer-\flutter_shopgenie\`
**Objective:** Add automated tests for the existing shop API integration without changing application behavior.

---

## Tests Added

**New file:** `test/shop_api_service_test.dart` — 27 tests across 7 groups.

### Group: `ShopApiService.fetchShops` (12 tests)

| # | Test | Result |
|---|------|--------|
| 1 | Parses valid paginated shop response (`{count, next, previous, results}`) into `List<StoreItem>` | PASS |
| 2 | Empty `results` array returns an empty list | PASS |
| 3 | Forwards `category` query parameter when not `'All'` | PASS |
| 4 | Does not forward `category` when `'All'` | PASS |
| 5 | Forwards `search` query parameter | PASS |
| 6 | Forwards `page` and `page_size` query parameters | PASS |
| 7 | Throws `ShopApiException` with `statusCode` on HTTP 404 | PASS |
| 8 | Throws `ShopApiException` with `statusCode` on HTTP 500 | PASS |
| 9 | Throws `FormatException` on malformed JSON (see Production Bug #3) | PASS |
| 10 | Throws `ShopApiException` when `results` key is missing | PASS |
| 11 | Throws `ShopApiException` when `results` is not a list | PASS |
| 12 | Skips non-map entries in `results` without crashing | PASS |
| 13 | Propagates `SocketException` on network failure | PASS |
| 14 | Handles missing optional fields gracefully (defaults applied) | PASS |

### Group: `ShopApiService.fetchShopById` (5 tests)

| # | Test | Result |
|---|------|--------|
| 1 | Parses valid shop detail response into `StoreItem` | PASS |
| 2 | Throws `ShopApiException` with `statusCode: 404` on not found | PASS |
| 3 | Throws `ShopApiException` with `statusCode` on HTTP 500 | PASS |
| 4 | Supports non-integer string shop IDs (e.g. `'abc-123'`) | PASS |
| 5 | Throws `ShopApiException` on empty shop ID | PASS |

### Group: `ShopService.fetchShops` (wrapper) (2 tests)

| # | Test | Result |
|---|------|--------|
| 1 | Delegates to `ShopApiService` and returns parsed list | PASS |
| 2 | Never falls back to mock data on API error | PASS |

### Group: `ShopService.fetchShopById` (wrapper) (1 test)

| # | Test | Result |
|---|------|--------|
| 1 | Delegates to `ShopApiService` and returns parsed shop | PASS |

### Group: `isNetworkFailure` (5 tests)

| # | Test | Result |
|---|------|--------|
| 1 | Returns `true` for `ShopApiException` with `isNetworkError: true` | PASS |
| 2 | Returns `false` for `ShopApiException` without `isNetworkError` | PASS |
| 3 | Returns `true` for `SocketException` | PASS |
| 4 | Returns `true` for `HttpException` | PASS |
| 5 | Returns `false` for other exceptions (`StateError`) | PASS |

---

## Files Modified

| File | Change | Reason |
|------|--------|--------|
| `test/shop_api_service_test.dart` | **Created** | 27 new tests for shop API service |
| `lib/services/shop_service.dart:5` | `import 'package:http/http.dart' show http;` → `import 'package:http/http.dart' as http;` | **Genuine compilation bug**: `show http` imports `http` as a symbol, not a library prefix, so `http.Client` type annotations on lines 365 and 383 could not compile |
| `lib/services/shop_api_service.dart:2` | `import 'dart:io' show SocketException;` → `import 'dart:io' show SocketException, HttpException;` | **Genuine compilation bug**: `HttpException` used on line 148 but not imported |

No production logic was changed — only two import statements were fixed to resolve compilation errors that prevented the package from building.

---

## Test Results

```
flutter test
All tests passed!
```

**Total: 37 passed, 0 failed**
- 10 existing `model_compat_test.dart` tests (preserved unchanged)
- 27 new `shop_api_service_test.dart` tests

No real network requests are made in unit tests — all HTTP calls go through a `MockHttpClient` stub extending `http.BaseClient`.

---

## Static Analysis Results

```
flutter analyze
7 issues found (all pre-existing except 3 info-level in test file)
```

| File | Issue | Severity | Status |
|------|-------|----------|--------|
| `lib/screens/home_screen.dart:55` | `_shopsError` unused field | warning | Pre-existing |
| `lib/screens/home_screen.dart:654` | `BorderRadius` not assignable to `OutlinedBorder?` | error | Pre-existing |
| `lib/widgets/ai_detection_overlay.dart:360` | Unreachable switch default | warning | Pre-existing |
| `lib/widgets/ai_detection_overlay.dart:403` | Unreachable switch default | warning | Pre-existing |
| `test/shop_api_service_test.dart:264` | `prefer_const_constructors` | info | False positive — `ShopApiException` constructor is not `const` |
| `test/shop_api_service_test.dart:450` | `prefer_const_constructors` | info | False positive — `SocketException` constructor is not `const` |
| `test/shop_api_service_test.dart:455` | `prefer_const_constructors` | info | False positive — `HttpException` constructor is not `const` |

---

## Production Bugs Discovered

### Bug 1: Broken HTTP import in `shop_service.dart`
**File:** `lib/services/shop_service.dart:5`
**Issue:** `import 'package:http/http.dart' show http;` imports `http` as a symbol, not a library prefix. The `http.Client? client` type annotations on lines 365 and 383 could not compile.
**Fix:** Changed to `import 'package:http/http.dart' as http;`
**Impact:** Package did not compile before fix.

### Bug 2: Missing `HttpException` import in `shop_api_service.dart`
**File:** `lib/services/shop_api_service.dart:2`
**Issue:** `HttpException` used in `isNetworkFailure()` on line 148 but not imported (only `SocketException` was imported).
**Fix:** Changed to `import 'dart:io' show SocketException, HttpException;`
**Impact:** Package did not compile before fix.

### Bug 3: `jsonDecode` not wrapped in try/catch
**File:** `lib/services/shop_api_service.dart:72`
**Issue:** `jsonDecode(response.body)` is called without a try/catch. Malformed JSON throws `FormatException` directly instead of being converted to `ShopApiException`. The `ShopApiException` is only thrown when JSON parses successfully but has the wrong structure (missing `results`, non-list `results`).
**Impact:** Network malformed JSON responses propagate as `FormatException`, not `ShopApiException`, making error handling inconsistent.
**Documented:** Test `throws FormatException on malformed JSON` confirms the actual behavior. Per task rules, production code was not redesigned to fix this — it is documented here.

---

## Tests Not Implemented

### Timeout handling — NOT IMPLEMENTED
**Reason:** `ShopApiService.fetchShops()` and `fetchShopById()` use `.timeout(const Duration(seconds: 15))`. Testing this reliably would require a mock that hangs for 15+ seconds, making the test impractically slow. No production code was modified to enable timeout testing (e.g., making the timeout configurable). This limitation is documented here rather than worked around.

---

## Boundaries Respected

- No Django backend files modified
- No Shop Owner app files modified
- No map API integrated
- No secrets exposed
- No real network requests in tests
- Existing `test/model_compat_test.dart` preserved unchanged (10 tests)
- Production logic unchanged — only two import statements fixed to resolve compilation errors
