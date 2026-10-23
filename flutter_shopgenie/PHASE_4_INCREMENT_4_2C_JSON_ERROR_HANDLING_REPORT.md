# Phase 4 Increment 4.2C — Malformed JSON Error Handling Standardization

**Customer Flutter project:** `R:\shopGiene customer\Shopgenie-customer-\flutter_shopgenie\`
**Objective:** Make malformed JSON responses from the shop API produce the documented `ShopApiException` error type.

---

## Root Cause

**File:** `lib/services/shop_api_service.dart`

In both `fetchShops()` (line 72) and `fetchShopById()` (line 120), `jsonDecode(response.body)` was called without a try/catch. When the server returns malformed JSON (e.g., `not json`), Dart's `jsonDecode` throws a `FormatException` directly — not the documented `ShopApiException`. This meant malformed JSON responses propagated as an undocumented exception type, inconsistent with the rest of the service's error handling.

The `ShopApiException` constructor supports `message`, `statusCode`, and `isNetworkError` fields. No `statusCode` is applicable to malformed JSON (the HTTP request succeeded with a 200 but the body is invalid), so only `message` is set.

## Exact Production Changes

**File:** `lib/services/shop_api_service.dart`

### Change 1 — `fetchShops()` (lines 72-79)

**Before:**
```dart
    final decoded = jsonDecode(response.body);
    if (decoded is! Map<String, dynamic>) {
```

**After:**
```dart
    dynamic decoded;
    try {
      decoded = jsonDecode(response.body);
    } on FormatException {
      throw ShopApiException(
        'Unexpected shop list response structure: could not parse JSON.',
      );
    }

    if (decoded is! Map<String, dynamic>) {
```

### Change 2 — `fetchShopById()` (lines 120-127)

**Before:**
```dart
    final decoded = jsonDecode(response.body);
    if (decoded is! Map<String, dynamic>) {
```

**After:**
```dart
    dynamic decoded;
    try {
      decoded = jsonDecode(response.body);
    } on FormatException {
      throw ShopApiException(
        'Unexpected shop detail response structure: could not parse JSON.',
      );
    }

    if (decoded is! Map<String, dynamic>) {
```

**What was preserved:**
- HTTP status code error handling (404, 500, etc.) unchanged — checked before JSON decoding.
- Response structure validation (`decoded is! Map`, `results is! List`) unchanged.
- No response body content is included in error messages (no sensitive data exposure).
- Only `FormatException` is caught; `ShopApiException` thrown by structure checks is not re-wrapped.

## Tests Added / Changed

**File:** `test/shop_api_service_test.dart`

### Changed test

| Test | Change |
|------|--------|
| `ShopApiService.fetchShops throws FormatException on malformed JSON` | Renamed to `throws ShopApiException on malformed JSON for shop list`; assertion changed from `throwsA(isA<FormatException>())` to `throwsA(isA<ShopApiException>())` |

### Added test

| Test | Group | Coverage |
|------|-------|----------|
| `throws ShopApiException on malformed JSON for shop detail` | `ShopApiService.fetchShopById` | Malformed JSON body from detail endpoint produces `ShopApiException` |

All other existing tests (valid paginated response, empty results, HTTP 404/500, missing fields, structure validation, network failure, etc.) remain unchanged and pass.

## Validation Results

### flutter test

```
All tests passed!
```

**Total: 38 passed, 0 failed**
- 10 existing `model_compat_test.dart` tests (preserved unchanged)
- 28 `shop_api_service_test.dart` tests (27 previous + 1 new for fetchShopById malformed JSON)

### flutter analyze

```
6 issues found (ran in 3.3s)
```

All 6 are pre-existing warnings/infos — **no errors**, none introduced by this change:

| File | Line | Diagnostic | Severity |
|------|------|------------|----------|
| `lib/screens/home_screen.dart` | 55 | `_shopsError` unused field | warning |
| `lib/widgets/ai_detection_overlay.dart` | 360 | Unreachable switch default clause | warning |
| `lib/widgets/ai_detection_overlay.dart` | 403 | Unreachable switch default clause | warning |
| `test/shop_api_service_test.dart` | 264 | `prefer_const_constructors` | info (false positive) |
| `test/shop_api_service_test.dart` | 470 | `prefer_const_constructors` | info (false positive) |
| `test/shop_api_service_test.dart` | 475 | `prefer_const_constructors` | info (false positive) |

The 3 info-level `prefer_const_constructors` diagnostics are false positives — `ShopApiException`, `SocketException`, and `HttpException` constructors are not `const`, so `const` cannot be used.

## Files Modified

| File | Change |
|------|--------|
| `lib/services/shop_api_service.dart` | Wrapped `jsonDecode(response.body)` in try/catch in both `fetchShops()` and `fetchShopById()`, converting `FormatException` to `ShopApiException` |
| `test/shop_api_service_test.dart` | Changed malformed JSON test to expect `ShopApiException`; added malformed JSON test for `fetchShopById` |

## Confirmations

- ✅ Django backend was not modified (read-only)
- ✅ Shop Owner app was not modified
- ✅ No map API integrated
- ✅ No product API integration started
- ✅ No real network requests in tests
- ✅ No sensitive response body content in error messages
- ✅ Existing behavior preserved for valid responses and HTTP errors
