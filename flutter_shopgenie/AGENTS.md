# AGENTS.md — Customer Flutter App (`flutter_shopgenie`)

## 1. Purpose & Architecture
ShopGenie Customer is a cross-platform Flutter application providing retail discovery, live shop browsing, product searching, local smart bag management, and promo feed updates for customers.
It communicates exclusively with the Unified Django REST Backend via standard HTTP/JSON REST APIs with JWT authentication.
**No direct database or Supabase connections are permitted.**

## 2. Folder Structure
```
lib/
├── models/         # Data transfer objects (Shop, Product, Auth, Offer)
├── providers/      # State management (AuthProvider, CartProvider)
├── screens/        # UI screens (Home, Feed, Search, ShopDetail, Bag, Onboarding)
├── services/       # Central ApiConfig, ShopApiService, AuthApiService, TokenStorage
├── theme/          # AppTheme and AppColors (Material 3)
└── widgets/        # Reusable UI components
```

## 3. Main Entry Points
- `lib/main.dart`: Root widget `ShopGenieApp`. Sets up routing and auth initialization.
- `lib/screens/main_navigation_screen.dart`: Tabbed bottom navigation (Home, Feed, Scan, Bag, Profile).

## 4. Commands to Run & Test
```powershell
# Analyze
flutter analyze

# Run all tests
flutter test

# Run app
flutter run
```

## 5. API Configuration & Auth Flow
- Centralized in `lib/services/api_config.dart`.
- Development emulator: `http://10.0.2.2:8000/api`.
- JWT tokens stored securely via `TokenStorage` using `flutter_secure_storage`.
- Never send plain-text credentials in logs or non-auth endpoints.

## 6. Prohibited & Deferred Features
- **Maps:** DEFERRED. Keep existing code intact without modifying or inventing coordinates.
- **AI Scanning:** DEFERRED. Keep overlay simulation without fabricating production recognition results.
- **Online Checkout:** Prohibited. No third-party payment gateways unless explicitly requested.
