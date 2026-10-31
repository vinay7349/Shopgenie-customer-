import 'package:flutter/material.dart';
import '../models/smart_bag_item.dart';
import '../models/store_item.dart';
import '../models/user_role.dart';
import '../widgets/custom_bottom_nav_bar.dart';
import 'bag_screen.dart';
import 'feed_screen.dart';
import 'home_screen.dart';
import 'map_screen.dart';
import 'profile_screen.dart';
import 'scan_screen.dart';
import 'shop_detail_screen.dart';
import 'search_screen.dart';

class MainNavigationScreen extends StatefulWidget {
  final ThemeMode themeMode;
  final ValueChanged<ThemeMode> onThemeModeChanged;
  final VoidCallback onLogin;
  final VoidCallback onRegister;
  final VoidCallback? onLogout;

  const MainNavigationScreen({
    super.key,
    required this.themeMode,
    required this.onThemeModeChanged,
    required this.onLogin,
    required this.onRegister,
    this.onLogout,
  });

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  UserRole _userRole = UserRole.shopper;
  int _currentTab = 0; // 0: Home, 1: Map, 2: AI Scan, 3: Search, 4: Smart Bag
  String _currentLocation = 'Location unavailable';
  StoreItem? _selectedStore;
  int? _activeFeedTab; // null if not in feed, 0: Feed, 1: Offers
  int? _feedTabBeforeShop;
  bool _isProfileOpen = false;

  final List<SmartBagItem> _cartItems = [];

  int get _cartCount => _cartItems.fold(0, (sum, i) => sum + i.quantity);

  void _onAddToCart(SmartBagItem newItem) {
    setState(() {
      final idx = _cartItems.indexWhere((i) => i.id == newItem.id);
      if (idx >= 0) {
        _cartItems[idx].quantity += newItem.quantity;
      } else {
        _cartItems.add(newItem);
      }
    });
  }

  void _incrementCartItem(SmartBagItem item) {
    setState(() {
      item.quantity += 1;
    });
  }

  void _decrementCartItem(SmartBagItem item) {
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

  bool get _hasInternalBackState =>
      _selectedStore != null ||
      _isProfileOpen ||
      _activeFeedTab != null ||
      _currentTab != 0;

  void _handleBack() {
    if (_selectedStore != null) {
      setState(() {
        _selectedStore = null;
        if (_feedTabBeforeShop != null) {
          _activeFeedTab = _feedTabBeforeShop;
          _feedTabBeforeShop = null;
        }
      });
      return;
    }

    if (_isProfileOpen) {
      setState(() => _isProfileOpen = false);
      return;
    }

    if (_activeFeedTab != null) {
      setState(() => _activeFeedTab = null);
      return;
    }

    if (_currentTab != 0) {
      setState(() => _currentTab = 0);
    }
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: !_hasInternalBackState,
      onPopInvokedWithResult: (didPop, result) {
        if (!didPop && _hasInternalBackState) {
          _handleBack();
        }
      },
      child: _buildScreen(context),
    );
  }

  Widget _buildScreen(BuildContext context) {
    // 1. Shopper sub-screens overlay (shop detail, feed/offers, profile)
    if (_selectedStore != null) {
      return ShopDetailScreen(
        store: _selectedStore!,
        onBack: () {
          _handleBack();
        },
        onStartScan: () {
          setState(() {
            _selectedStore = null;
            _feedTabBeforeShop = null;
            _activeFeedTab = null;
            _currentTab = 2; // switch to AI Scan
          });
        },
        onAddToCart: (item) {
          _onAddToCart(item);
        },
      );
    }

    if (_activeFeedTab != null) {
      return Scaffold(
        body: FeedScreen(
          initialTabIndex: _activeFeedTab!,
        ),
        bottomNavigationBar: CustomBottomNavBar(
          currentIndex: _currentTab,
          cartCount: _cartCount,
          onTabSelected: (tab) {
            setState(() {
              _activeFeedTab = null;
              _feedTabBeforeShop = null;
              _currentTab = tab;
            });
          },
        ),
      );
    }

    if (_isProfileOpen) {
      return ProfileScreen(
        userRole: _userRole,
        themeMode: widget.themeMode,
        onThemeModeChanged: widget.onThemeModeChanged,
        onLogin: widget.onLogin,
        onRegister: widget.onRegister,
        onLogout: widget.onLogout,
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

    // 2. Main 5-Tab Shopper View
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
              _currentTab = 2; // AI Scan
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
              _feedTabBeforeShop = null;
              _activeFeedTab = 0;
            });
          },
          onOpenOffers: () {
            setState(() {
              _feedTabBeforeShop = null;
              _activeFeedTab = 1;
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
              _currentTab = 2; // AI Scan
            });
          },
        );
        break;

      case 2:
        bodyContent = ScanScreen(
          onProductScanned: _onAddToCart,
          onGoToBag: () {
            setState(() {
              _currentTab = 4; // Smart Bag
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
          onAddToCart: (item) {
            _onAddToCart(item);
          },
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
              _currentTab = 2; // AI Scan
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
            _feedTabBeforeShop = null;
            _isProfileOpen = false;
            _currentTab = tab;
          });
        },
      ),
    );
  }
}
