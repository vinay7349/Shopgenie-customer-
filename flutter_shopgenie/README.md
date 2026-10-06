# ShopGenie - Flutter Mobile Application

ShopGenie is an AI-powered hyperlocal shopping application designed to help customers discover nearby shops, identify products using AI, explore product information, and maintain a temporary Smart Bag while shopping.

---

## 🌟 Key Highlights

### 🔍 AI Product Scan (replaces Barcode Scan & Go)
The application no longer uses barcode or QR codes. Instead, it utilizes an AI vision model (integrated via Django REST API `POST /api/products/recognize/`) to visually detect products, identify brands and packaging, and retrieve current pricing from the database.
- **Subtitle:** *"Point your camera at a product and let AI identify it instantly."*
- **Navigation Label:** `AI Scan`
- **Real-Time Visual Feedback:** AI bounding box with neural pulse scan line, confidence indicator (`96% confidence`), brand and packaging recognition.
- **Error Handling:** Gracefully handles camera permission denied, unrecognized products (*"Product not clearly recognized"* with *"Try Again"* and *"Search Product Manually"*), low confidence (*"Product recognition confidence is low. Move closer or improve lighting."*), multiple products detected, and network connectivity errors (*"Unable to connect to ShopGenie AI."*).

### 🛍️ Smart Bag (replaces Checkout Cart)
A temporary shopping list that helps customers keep track of products they have discovered while shopping.
- **Purely Discovery & List Curation:** Strictly does **NOT** contain checkout, payment gateways, payment processing, or exit passes.
- **Summary:** Shows items, quantities, and estimated total in ₹ (INR).
- **Available Actions:** *Continue Scanning* and *Clear Bag*.

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
| *AI Product Scan* | `lib/screens/scan_screen.dart` | Camera with AI detection overlay, confidence meter, manual search fallback |
| *Smart Bag* | `lib/screens/bag_screen.dart` | Temporary shopping list, item stepper, estimated total in ₹, zero payment/checkout |
| *Profile & Role* | `lib/screens/profile_screen.dart` | Customer role overview (`Current Role: CUSTOMER`), saved stores, support |
| Navigation Shell | `lib/screens/main_navigation_screen.dart` | Bottom Navigation: Explore, Map, AI Scan, Search, Smart Bag (Badge) |

---

## 🔌 AI Recognition & Backend API

```
Flutter Camera
      ↓ (Capture Product Image)
Django REST API (POST /api/products/recognize/)
      ↓
AI Product Recognition Vision Model
      ↓
Product Matching & PostgreSQL Database Lookup
      ↓
Product Information (Name, Brand, Category, Size, Price, Confidence)
      ↓
Flutter UI & Smart Bag
```

### API Endpoint Specification
**POST** `/api/products/recognize/`

**Request:**
- `image`: Multipart file / base64 image data
- Optional headers: `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "product": {
    "id": "101",
    "name": "Coca-Cola 500ml",
    "brand": "Coca-Cola",
    "category": "Beverages",
    "size": "500 ml",
    "price": 40.0,
    "confidence": 0.96
  }
}
```

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
    │   ├── product.dart
    │   ├── smart_bag_item.dart
    │   ├── cart_item.dart (compatibility alias)
    │   ├── product_item.dart
    │   ├── onboarding_step.dart
    │   ├── store_item.dart
    │   └── user_role.dart
    ├── screens/
    │   ├── scan_screen.dart (AI Product Scan)
    │   ├── ai_product_scan_screen.dart
    │   ├── bag_screen.dart (Smart Bag)
    │   ├── smart_bag_screen.dart
    │   ├── home_screen.dart
    │   ├── main_navigation_screen.dart
    │   ├── onboarding_screen.dart
    │   ├── profile_screen.dart
    │   ├── map_screen.dart
    │   ├── search_screen.dart
    │   ├── shop_detail_screen.dart
    │   └── splash_screen.dart
    ├── services/
    │   ├── product_recognition_service.dart
    │   └── shop_service.dart
    ├── widgets/
    │   ├── ai_detection_overlay.dart
    │   ├── product_result_card.dart
    │   ├── smart_bag_card.dart
    │   ├── custom_bottom_nav_bar.dart
    │   ├── genie_lamp_logo.dart
    │   ├── promo_banner.dart
    │   ├── quick_action_cards.dart
    │   └── store_card.dart
    └── theme/
        ├── app_colors.dart
        └── app_theme.dart
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
