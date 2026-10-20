# PHASE_4_INCREMENT_4_1_CUSTOMER_MODEL_COMPATIBILITY_REPORT

## Files inspected
- `lib/models/store_item.dart` — StoreItem model and fromJson
- `lib/models/product_item.dart` — ProductItem model (no fromJson; only mock data)
- `lib/models/product.dart` — Product model and fromJson (recognition)
- `lib/services/shop_service.dart` — mock data source
- `lib/services/product_recognition_service.dart` — recognition service (references backend endpoint)
- `pubspec.yaml` — project config (no test directory existed)

## Files changed
- `lib/models/store_item.dart` — StoreItem.fromJson: safe id parsing (int or String), safe rating parsing (numeric or string, with star formatting), null-safe optional fields
- `lib/models/product.dart` — Product.fromJson: price reads `price` or `selling_price`; storeId reads `store_id` or `shop`
- `lib/models/product_item.dart` — `stock` type changed from `int` to `double` to support fractional quantities
- `test/model_compat_test.dart` — NEW: 10 focused parsing tests

## Exact parsing changes

### StoreItem.fromJson
- `id`: `json['id'] as String` → `json['id']?.toString() ?? ''` (handles int, String, null)
- `rating`: `json['rating'] as String` → `_formatRating(json['rating'])` (handles num, String, null, pre-formatted)
- `name`, `category`, `distance`, `address`, `emoji`, `hours`, `phone`: changed from `as String` to `?.toString() ?? default` (null-safe)

### Product.fromJson
- `price`: `(json['price'] as num?)?.toDouble()` → `((json['price'] ?? json['selling_price']) as num?)?.toDouble()`
- `storeId`: `json['store_id']?.toString() ?? '1'` → `(json['store_id'] ?? json['shop'])?.toString() ?? '1'`

### ProductItem
- `stock`: `int` → `double` (handles fractional stock quantities from backend's Decimal stock_quantity)

## How fractional stock is handled
- Changed `ProductItem.stock` from `int` to `double`
- Default changed from `10` to `10.0`
- Backend `stock_quantity` is a Decimal with 3 decimal places (supports KG, GRAM, LITER units)
- The UI does not currently use stock for display (only mock data), so changing to double is safe
- No rounding is applied; fractional values are preserved as-is

## Tests and results
- 10 tests added in `test/model_compat_test.dart`
- All 10 tests PASS
- `flutter analyze`: 2 pre-existing warnings (unrelated to changes) + 0 new issues
- `flutter test`: 10/10 PASS

## Remaining model compatibility issues
- `ProductItem.id` is String but backend returns int — handled via `?.toString()` in Product.fromJson but ProductItem has no fromJson (mock data only)
- `ProductItem` model has no fromJson; when live API integration happens, a fromJson method will need to be added
- `StoreItem.fromJson` still uses `json['lat'] as num?` and `json['lng'] as num?` which are safe (nullable)
- Customer app uses mock data exclusively; live API integration is a future increment
- `emoji`, `distance`, `offer`, `lat`, `lng`, `followers`, `isFollowing`, `selfCheckout` fields are not provided by backend (UI uses defaults)
- `confidence` and `inStock` fields are not provided by backend (UI uses defaults)

## Recommendation
Customer model compatibility fixes are complete. The app's model parsing is now safe for integer/string IDs, numeric/string ratings, and fractional stock quantities. Ready for future live API integration.
