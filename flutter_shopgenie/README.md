# shopgenie

ShopGenie Customer is a Flutter app that uses the Django REST API for registered
shops and their products.

## Nearby shops map

The Nearby Shops screen reads registered shops from the existing
`GET /api/shops/` endpoint. It places markers only for shops whose API records
contain valid `lat`/`lng` or `latitude`/`longitude` coordinates. The current
backend response observed during integration does not include coordinates, so
the app shows those real shops in its list and explains why no pins can be
displayed. No address geocoding, sample coordinates, Places API, or Routes API
calls are made.

Location permission is requested only after the customer opens Nearby Shops
and accepts the explanation. Customers can deny location access and still
browse the shop list.

### Configure Google Maps keys

1. In Google Cloud Console, enable billing and **Maps SDK for Android**. For an
   iOS build, also enable **Maps SDK for iOS**. The map uses SDK map loads only;
   it does not call Places, Geocoding, or Routes APIs. Review current Google
   Maps Platform pricing, monthly allowances, and billing requirements for your
   account; usage is not unlimited or permanently free.
2. Create separate development and production keys. Restrict each Android key
   to the app's package name `com.shopgenie` and the SHA-1 fingerprint of the
   applicable signing certificate. Restrict its API access to Maps SDK for
   Android. Obtain fingerprints with
   `cd android; .\gradlew signingReport` (PowerShell).
3. Keep the keys out of source control. For local Android builds, add these
   properties to `android/local.properties`:

   ```properties
   googleMapsApiKeyDebug=YOUR_RESTRICTED_DEBUG_KEY
   googleMapsApiKeyRelease=YOUR_RESTRICTED_PRODUCTION_KEY
   ```

   `googleMapsApiKey` is also accepted as a debug-only fallback. Alternatively,
   provide `GOOGLE_MAPS_API_KEY_DEBUG` and `GOOGLE_MAPS_API_KEY_RELEASE`
   environment variables. Do not place keys in Dart source or commit them.
4. Build/run Android with the key-availability flag so the UI can explain
   missing native configuration instead of showing an empty map:

   ```powershell
   flutter run --dart-define=GOOGLE_MAPS_API_KEY_CONFIGURED=true
   ```

   When using the local Django server over USB, first run
   `adb reverse tcp:8000 tcp:8000`, then also pass
   `--dart-define=BASE_URL=http://127.0.0.1:8000`.
5. For iOS (supported with Google Maps SDK 9, matching the project's iOS 15
   deployment target), create the ignored local file `ios/Flutter/MapsKeys.xcconfig`
   containing `GOOGLE_MAPS_API_KEY = YOUR_RESTRICTED_IOS_KEY`. Restrict this
   key to Maps SDK for iOS. The iOS app reads the key from its build-time
   Info.plist entry; the optional xcconfig is not committed.

The Android location permissions are foreground-only. Do not add background
location access for this feature.

### Backend coordinate requirement

The mobile app currently uses the existing `GET /api/shops/` endpoint and does
not change the API contract. The observed response contains shop IDs, names,
categories, and addresses, but no coordinates and no nearby-shop filtering.
For registered-shop pins, the Django shop model/public serializer must expose
the shop's actual saved latitude and longitude as `lat` and `lng` (or
`latitude` and `longitude`). Nearby distance sorting is then calculated on the
device for shops with valid coordinates. Do not geocode addresses or seed
invented coordinates to make markers appear.

## Run on a phone over Wi-Fi

1. Connect the PC and phone to the same trusted Wi-Fi network.
2. In `shopgenie_unified`, start the API with `.\run_lan.ps1` and leave that
   terminal open.
3. Enable Android Wireless debugging, pair the phone with `adb pair`, then
   connect it with `adb connect`. No USB cable or `adb reverse` is needed.
4. From this Flutter project, run:

   ```powershell
   .\run_wifi_debug.ps1
   ```

   If more than one wireless device is connected, pass its device ID with
   `-DeviceId`. The script finds the PC's current Wi-Fi IPv4 address and passes
   it to the app as `BASE_URL`, so changing Wi-Fi networks does not require
   editing Dart source.

The local HTTP development server is intended only for a trusted private
network. Allow Python through Windows Firewall on private networks if prompted.
For Android emulators, `flutter run` with the default `10.0.2.2` API host remains
available.

## Getting Started

This project is a starting point for a Flutter application.

A few resources to get you started if this is your first Flutter project:

- [Learn Flutter](https://docs.flutter.dev/get-started/learn-flutter)
- [Write your first Flutter app](https://docs.flutter.dev/get-started/codelab)
- [Flutter learning resources](https://docs.flutter.dev/reference/learning-resources)

For help getting started with Flutter development, view the
[online documentation](https://docs.flutter.dev/), which offers tutorials,
samples, guidance on mobile development, and a full API reference.
