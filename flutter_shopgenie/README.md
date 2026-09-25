# ShopGenie - Flutter Mobile Application

Complete Flutter conversion of the native Android ShopGenie application for hyperlocal shop discovery, live deals, self-scan express checkout, and loyalty pass.

---

## 🏗️ Architecture & Component Mapping

| Android Jetpack Compose Source | Flutter Converted Target | Description |
|--------------------------------|-------------------------|-------------|
| `com.shopgenie.ShopGenieApp` | `lib/main.dart` -> `ShopGenieApp` | Application entry point and Material 3 theme wrapper |
| `com.shopgenie.MainActivity` | `lib/main.dart` -> `_ShopGenieAppState` | Crossfade state machine: Splash → Onboarding → Main App |
| `com.shopgenie.ui.splash.SplashScreen` | `lib/screens/splash_screen.dart` | Animated Genie lamp, pulsing halo, staged startup diagnostics |
| `com.shopgenie.ui.onboarding.OnboardingScreen` | `lib/screens/onboarding_screen.dart` | 3-step carousel with animated pill indicators and highlights |
| `com.shopgenie.ui.home.HomeScreen` | `lib/screens/home_screen.dart` | Address header, category chips, deal banner, verified shops |
| `com.shopgenie.ui.theme.Theme` | `lib/theme/app_theme.dart` & `app_colors.dart` | Genie Teal (`#0F766E`), Spark Amber (`#F59E0B`), AI Violet (`#6D5EF5`) |
| Compose `Canvas` Genie Lamp | `lib/widgets/genie_lamp_logo.dart` | `CustomPainter` with identical bezier curves and dual star sparkles |
| *New Scan & Go* | `lib/screens/scan_screen.dart` | Real-time barcode reticle, animated laser scanner, test barcodes |
| *New Bag & Self-Checkout* | `lib/screens/bag_screen.dart` | Express bag, quantity management, automated discounts, exit pass QR |
| *New Profile & Wallet* | `lib/screens/profile_screen.dart` | Genie loyalty coin pass, digital receipts, saved local shops |
| Navigation Shell | `lib/screens/main_navigation_screen.dart` | Material 3 `NavigationBar` with Explore, Scan & Go, Bag (Badge), Profile |

---

## 📁 Project Structure

```
flutter_shopgenie/
├── pubspec.yaml
├── analysis_options.yaml
├── README.md
├── android/
│   └── app/src/main/AndroidManifest.xml
└── lib/
    ├── main.dart
    ├── models/
    │   ├── cart_item.dart
    │   ├── onboarding_step.dart
    │   └── store_item.dart
    ├── screens/
    │   ├── bag_screen.dart
    │   ├── home_screen.dart
    │   ├── main_navigation_screen.dart
    │   ├── onboarding_screen.dart
    │   ├── profile_screen.dart
    │   ├── scan_screen.dart
    │   ├── shop_detail_screen.dart
    │   └── splash_screen.dart
    ├── services/
    │   └── shop_service.dart
    ├── theme/
    │   ├── app_colors.dart
    │   └── app_theme.dart
    └── widgets/
        ├── genie_lamp_logo.dart
        ├── promo_banner.dart
        └── store_card.dart
```

---

## 🚀 Running the App

```bash
# Get dependencies
flutter pub get

# Run on connected device or emulator
flutter run

# Build release APK
flutter build apk --release
```
