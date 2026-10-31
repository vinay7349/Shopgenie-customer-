# ShopGenie Customer (Flutter)

This repository contains the ShopGenie customer mobile app in
`flutter_shopgenie`. The Django backend is maintained separately and is not
changed by this project.

## Run on Windows

Open PowerShell in the repository folder and run:

```powershell
cd .\flutter_shopgenie
flutter pub get
flutter run
```

The default API URL is `http://10.0.2.2:8000` for an Android emulator. Start
the separate Django backend using its own instructions before testing API
features.

For an Android phone on the same Wi-Fi network as the backend, connect the
phone with Android Wireless debugging and run this from `flutter_shopgenie`:

```powershell
.\run_wifi_debug.ps1
```

Use `.\run_wifi_debug.ps1 -DeviceId <device-id>` if multiple devices are
connected. For USB debugging with the backend on the PC, run
`adb reverse tcp:8000 tcp:8000` and start the app with:

```powershell
flutter run --dart-define=BASE_URL=http://127.0.0.1:8000
```

## Build and test

Run these commands from `flutter_shopgenie`:

```powershell
flutter analyze
flutter test
flutter build apk
```

The Android and iOS folders inside `flutter_shopgenie` are Flutter platform
projects. Android's Kotlin host files are required for Flutter Android builds;
there is no separate Kotlin application in this repository.

For Google Maps configuration and additional phone setup, see
[`flutter_shopgenie/README.md`](./flutter_shopgenie/README.md).
