import 'package:flutter/material.dart';
import '../models/cart_item.dart';
import '../models/store_item.dart';
import '../models/user_role.dart';
import '../services/shop_service.dart';
import '../widgets/custom_bottom_nav_bar.dart';
import 'admin_dashboard_screen.dart';
import 'bag_screen.dart';
import 'feed_screen.dart';
import 'home_screen.dart';
import 'map_screen.dart';
import 'profile_screen.dart';
import 'scan_screen.dart';
import 'shop_detail_screen.dart';
import 'search_screen.dart';

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  UserRole _userRole = UserRole.shopper;
  int _currentTab = 0; // 0: Home, 1: Map, 2: Scan & Pay, 3: Search, 4: Cart
  String _currentLocation = 'Rajarajeshwari Nagar, Bengaluru';
  StoreItem? _selectedStore;
  int? _activeFeedTab; // null if not in feed, 0: Feed, 1: Offers, 2: Following
  bool _isProfileOpen = false;

  final List<CartItem> _cartItems = [
    CartItem(
      id: 'p1',
      storeId: '1',
      name: 'Organic Hass Avocado (2 pack)',
      price: 3.49,
      emoji: '🥑',
      barcode: '8901234567890',
      quantity: 1,
    ),
    CartItem(
      id: 'p2',
      storeId: '1',
      name: 'Farm Fresh Almond Milk 1L',
      price: 2.89,
      emoji: '🥛',
      barcode: '8901234567891',
      quantity: 1,
    ),
  ];

  int get _cartCount => _cartItems.fold(0, (sum, i) => sum + i.quantity);

  void _onAddToCart(CartItem newItem) {
    setState(() {
      final idx = _cartItems.indexWhere((i) => i.id == newItem.id || i.barcode == newItem.barcode);
      if (idx >= 0) {
        _cartItems[idx].quantity += 1;
      } else {
        _cartItems.add(newItem);
      }
    });
  }

  void _incrementCartItem(CartItem item) {
    setState(() {
      item.quantity += 1;
    });
  }

  void _decrementCartItem(CartItem item) {
    setState(() {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        _cartItems.removeWhere((i) => i.id == item.id);
      }
    });
  }

  void _clearCart() {
    setState(() {
      _cartItems.clear();
    });
  }

  @override
  Widget build(BuildContext context) {
    // 1. Role System: If Admin Mode is active, render Merchant Deck
    if (_userRole == UserRole.admin) {
      return AdminDashboardScreen(
        onSwitchRole: (newRole) {
          setState(() {
            _userRole = newRole;
          });
        },
      );
    }

    // 2. Shopper Sub-screens overlay (Shop Detail, Feed/Offers/Following, Profile)
    if (_selectedStore != null) {
      return ShopDetailScreen(
        store: _selectedStore!,
        onBack: () {
          setState(() {
            _selectedStore = null;
          });
        },
        onStartScan: () {
          setState(() {
            _selectedStore = null;
            _currentTab = 2; // switch to Scan & Pay
          });
        },
        onAddToCart: _onAddToCart,
      );
    }

    if (_activeFeedTab != null) {
      return Scaffold(
        body: FeedScreen(
          initialTabIndex: _activeFeedTab!,
          onSelectStore: (store) {
            setState(() {
              _activeFeedTab = null;
              _selectedStore = store;
            });
          },
        ),
        bottomNavigationBar: CustomBottomNavBar(
          currentIndex: _currentTab,
          cartCount: _cartCount,
          onTabSelected: (tab) {
            setState(() {
              _activeFeedTab = null;
              _currentTab = tab;
            });
          },
        ),
      );
    }

    if (_isProfileOpen) {
      return ProfileScreen(
        userRole: _userRole,
        onRoleChanged: (role) {
          setState(() {
            _userRole = role;
          });
        },
        onBack: () {
          setState(() {
            _isProfileOpen = false;
          });
        },
      );
    }

    // 3. Main 5-Tab Shopper View
    Widget bodyContent;
    switch (_currentTab) {
      case 0:
        bodyContent = HomeScreen(
          currentLocation: _currentLocation,
          userRole: _userRole,
          onLocationChanged: (newLoc) {
            setState(() {
              _currentLocation = newLoc;
            });
          },
          onRoleChanged: (newRole) {
            setState(() {
              _userRole = newRole;
            });
          },
          onSelectStore: (store) {
            setState(() {
              _selectedStore = store;
            });
          },
          onOpenScanner: () {
            setState(() {
              _currentTab = 2;
            });
          },
          onOpenMap: () {
            setState(() {
              _currentTab = 1;
            });
          },
          onOpenSearch: () {
            setState(() {
              _currentTab = 3;
            });
          },
          onOpenFeed: () {
            setState(() {
              _activeFeedTab = 0;
            });
          },
          onOpenOffers: () {
            setState(() {
              _activeFeedTab = 1;
            });
          },
          onOpenFollowing: () {
            setState(() {
              _activeFeedTab = 2;
            });
          },
          onOpenProfile: () {
            setState(() {
              _isProfileOpen = true;
            });
          },
        );
        break;

      case 1:
        bodyContent = MapScreen(
          currentLocation: _currentLocation,
          onSelectStore: (store) {
            setState(() {
              _selectedStore = store;
            });
          },
          onOpenScanner: () {
            setState(() {
              _currentTab = 2;
            });
          },
        );
        break;

      case 2:
        bodyContent = ScanScreen(
          onProductScanned: _onAddToCart,
          onGoToCart: () {
            setState(() {
              _currentTab = 4;
            });
          },
        );
        break;

      case 3:
        bodyContent = SearchScreen(
          onSelectStore: (store) {
            setState(() {
              _selectedStore = store;
            });
          },
          onAddToCart: _onAddToCart,
        );
        break;

      case 4:
        bodyContent = BagScreen(
          cartItems: _cartItems,
          onIncrement: _incrementCartItem,
          onDecrement: _decrementCartItem,
          onClearCart: _clearCart,
          onGoToScan: () {
            setState(() {
              _currentTab = 2;
            });
          },
        );
        break;

      default:
        bodyContent = const SizedBox.shrink();
    }

    return Scaffold(
      body: bodyContent,
      bottomNavigationBar: CustomBottomNavBar(
        currentIndex: _currentTab,
        cartCount: _cartCount,
        onTabSelected: (tab) {
          setState(() {
            _selectedStore = null;
            _activeFeedTab = null;
            _isProfileOpen = false;
            _currentTab = tab;
          });
        },
      ),
    );
  }
}
