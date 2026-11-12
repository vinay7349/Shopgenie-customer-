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

### OpenStreetMap tiles

The map uses OpenStreetMap's public tile service and requires no API key.
`© OpenStreetMap contributors` is displayed on the map and links to the
copyright page. Map tiles require an internet connection; follow the
[OpenStreetMap tile usage policy](https://operations.osmfoundation.org/policies/tiles/),
including its attribution, identification, and no-bulk-download requirements.

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
