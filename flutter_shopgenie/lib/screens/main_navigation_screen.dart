import 'package:flutter/material.dart';
import '../models/cart_item.dart';
import '../models/store_item.dart';
import '../theme/app_colors.dart';
import 'bag_screen.dart';
import 'home_screen.dart';
import 'profile_screen.dart';
import 'scan_screen.dart';
import 'shop_detail_screen.dart';

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _currentIndex = 0;
  StoreItem? _selectedStore;
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

  int get _cartItemCount =>
      _cartItems.fold(0, (sum, item) => sum + item.quantity);

  void _onAddScannedItem(CartItem newItem) {
    setState(() {
      final existingIndex =
          _cartItems.indexWhere((element) => element.barcode == newItem.barcode);
      if (existingIndex >= 0) {
        _cartItems[existingIndex].quantity += 1;
      } else {
        _cartItems.add(newItem);
      }
    });
  }

  void _incrementQuantity(CartItem item) {
    setState(() {
      item.quantity += 1;
    });
  }

  void _decrementQuantity(CartItem item) {
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
    final theme = Theme.of(context);

    // If a store is selected in Explore tab, show ShopDetailScreen
    Widget currentTabWidget;
    if (_currentIndex == 0 && _selectedStore != null) {
      currentTabWidget = ShopDetailScreen(
        store: _selectedStore!,
        onBack: () {
          setState(() {
            _selectedStore = null;
          });
        },
        onStartScan: () {
          setState(() {
            _selectedStore = null;
            _currentIndex = 1; // switch to Scan tab
          });
        },
      );
    } else {
      switch (_currentIndex) {
        case 0:
          currentTabWidget = HomeScreen(
            onSelectStore: (store) {
              setState(() {
                _selectedStore = store;
              });
            },
            onOpenScanner: () {
              setState(() {
                _currentIndex = 1;
              });
            },
          );
          break;
        case 1:
          currentTabWidget = ScanScreen(
            onProductScanned: _onAddScannedItem,
          );
          break;
        case 2:
          currentTabWidget = BagScreen(
            cartItems: _cartItems,
            onIncrement: _incrementQuantity,
            onDecrement: _decrementQuantity,
            onClearCart: _clearCart,
            onGoToScan: () {
              setState(() {
                _currentIndex = 1;
              });
            },
          );
          break;
        case 3:
          currentTabWidget = const ProfileScreen();
          break;
        default:
          currentTabWidget = HomeScreen(
            onSelectStore: (store) {},
            onOpenScanner: () {},
          );
      }
    }

    return Scaffold(
      body: currentTabWidget,
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (idx) {
          setState(() {
            _currentIndex = idx;
            _selectedStore = null;
          });
        },
        destinations: [
          const NavigationDestination(
            icon: Text('🏠', style: TextStyle(fontSize: 20)),
            label: 'Explore',
          ),
          const NavigationDestination(
            icon: Text('📱', style: TextStyle(fontSize: 20)),
            label: 'Scan & Go',
          ),
          NavigationDestination(
            icon: Badge(
              isLabelVisible: _cartItemCount > 0,
              label: Text('$_cartItemCount'),
              backgroundColor: AppColors.genieTeal,
              child: const Text('🛍️', style: TextStyle(fontSize: 20)),
            ),
            label: 'Bag',
          ),
          const NavigationDestination(
            icon: Text('👤', style: TextStyle(fontSize: 20)),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}
