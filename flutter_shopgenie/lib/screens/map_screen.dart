import 'package:flutter/material.dart';
import '../models/store_item.dart';
import '../services/shop_service.dart';
import '../theme/app_colors.dart';

class MapScreen extends StatefulWidget {
  final String currentLocation;
  final Function(StoreItem) onSelectStore;
  final VoidCallback onOpenScanner;

  const MapScreen({
    super.key,
    required this.currentLocation,
    required this.onSelectStore,
    required this.onOpenScanner,
  });

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  StoreItem? _selectedStore;
  String _selectedCategory = 'All';

  @override
  void initState() {
    super.initState();
    if (ShopService.sampleStores.isNotEmpty) {
      _selectedStore = ShopService.sampleStores.first;
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    final filteredStores = ShopService.filterStores(category: _selectedCategory);

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBackground : const Color(0xFFE2E8F0),
      body: SafeArea(
        child: Stack(
          children: [
            // 1. Simulated Interactive Map Canvas
            Positioned.fill(
              child: Container(
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF0F1715) : const Color(0xFFE2E8F0),
                  image: const DecorationImage(
                    image: NetworkImage(
                      'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80',
                    ),
                    fit: BoxFit.cover,
                    opacity: 0.12,
                  ),
                ),
                child: CustomPaint(
                  painter: _MapGridPainter(isDark: isDark),
                  child: Stack(
                    children: [
                      // Concentric radar scan rings
                      Center(
                        child: Container(
                          width: 280,
                          height: 280,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: AppColors.genieTeal.withValues(alpha: 0.18),
                              width: 1.5,
                            ),
                          ),
                        ),
                      ),
                      Center(
                        child: Container(
                          width: 160,
                          height: 160,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: AppColors.genieTeal.withValues(alpha: 0.28),
                              width: 1.5,
                            ),
                          ),
                        ),
                      ),

                      // User GPS Location Pin (Center)
                      Center(
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: Colors.blue[600],
                                shape: BoxShape.circle,
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.blue.withValues(alpha: 0.4),
                                    blurRadius: 12,
                                    spreadRadius: 3,
                                  ),
                                ],
                                border: Border.all(color: Colors.white, width: 2),
                              ),
                              child: const Icon(
                                Icons.person_pin_circle_rounded,
                                color: Colors.white,
                                size: 20,
                              ),
                            ),
                            Container(
                              margin: const EdgeInsets.only(top: 4),
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(10),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withValues(alpha: 0.1),
                                    blurRadius: 4,
                                  ),
                                ],
                              ),
                              child: const Text(
                                'You are here',
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.black87,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Store Markers on Map
                      _buildStoreMarker(
                        store: ShopService.sampleStores[0],
                        topPercent: 0.28,
                        leftPercent: 0.32,
                      ),
                      _buildStoreMarker(
                        store: ShopService.sampleStores[1],
                        topPercent: 0.22,
                        leftPercent: 0.65,
                      ),
                      _buildStoreMarker(
                        store: ShopService.sampleStores[2],
                        topPercent: 0.42,
                        leftPercent: 0.20,
                      ),
                      _buildStoreMarker(
                        store: ShopService.sampleStores[3],
                        topPercent: 0.40,
                        leftPercent: 0.72,
                      ),
                      _buildStoreMarker(
                        store: ShopService.sampleStores[4],
                        topPercent: 0.58,
                        leftPercent: 0.52,
                      ),
                    ],
                  ),
                ),
              ),
            ),

            // 2. Top Floating Controls: Area pill and Category Bar
            Positioned(
              top: 12,
              left: 16,
              right: 16,
              child: Column(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    decoration: BoxDecoration(
                      color: isDark ? AppColors.darkSurface : Colors.white,
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.08),
                          blurRadius: 10,
                          offset: const Offset(0, 3),
                        ),
                      ],
                    ),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.radar_rounded,
                          size: 18,
                          color: AppColors.genieTeal,
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            'Searching stores within 2 km of ${widget.currentLocation.split(',')[0]}',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: theme.colorScheme.onSurface,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: AppColors.genieTeal.withValues(alpha: 0.12),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            '${filteredStores.length} Live',
                            style: const TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                              color: AppColors.genieTeal,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 8),

                  // Categories horizontal row
                  SizedBox(
                    height: 38,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      itemCount: ShopService.categories.length,
                      separatorBuilder: (_, __) => const SizedBox(width: 6),
                      itemBuilder: (context, idx) {
                        final cat = ShopService.categories[idx];
                        final isSelected = cat == _selectedCategory;
                        return InkWell(
                          onTap: () {
                            setState(() {
                              _selectedCategory = cat;
                            });
                          },
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                            decoration: BoxDecoration(
                              color: isSelected
                                  ? AppColors.genieTeal
                                  : (isDark ? AppColors.darkSurface : Colors.white),
                              borderRadius: BorderRadius.circular(16),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withValues(alpha: 0.05),
                                  blurRadius: 4,
                                ),
                              ],
                            ),
                            child: Center(
                              child: Text(
                                cat,
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                                  color: isSelected
                                      ? Colors.white
                                      : theme.colorScheme.onSurface,
                                ),
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),

            // 3. Bottom Store Card Preview
            if (_selectedStore != null)
              Positioned(
                bottom: 16,
                left: 16,
                right: 16,
                child: Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: isDark ? AppColors.darkSurface : Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: isDark ? AppColors.darkBorder : const Color(0xFFE2E8F0),
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.12),
                        blurRadius: 16,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Row(
                        children: [
                          Container(
                            width: 52,
                            height: 52,
                            decoration: BoxDecoration(
                              color: AppColors.genieTeal.withValues(alpha: 0.12),
                              borderRadius: BorderRadius.circular(14),
                            ),
                            alignment: Alignment.center,
                            child: Text(
                              _selectedStore!.emoji,
                              style: const TextStyle(fontSize: 26),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Expanded(
                                      child: Text(
                                        _selectedStore!.name,
                                        style: const TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 15,
                                        ),
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                      decoration: BoxDecoration(
                                        color: AppColors.sparkAmber.withValues(alpha: 0.15),
                                        borderRadius: BorderRadius.circular(6),
                                      ),
                                      child: Text(
                                        _selectedStore!.rating,
                                        style: const TextStyle(
                                          fontSize: 11,
                                          fontWeight: FontWeight.bold,
                                          color: Color(0xFFB45309),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  '${_selectedStore!.category} · ${_selectedStore!.distance}',
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: theme.colorScheme.onSurface.withValues(alpha: 0.65),
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  _selectedStore!.address,
                                  style: TextStyle(
                                    fontSize: 11,
                                    color: theme.colorScheme.onSurface.withValues(alpha: 0.45),
                                  ),
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          if (_selectedStore!.selfCheckout)
                            Expanded(
                              child: OutlinedButton.icon(
                                onPressed: widget.onOpenScanner,
                                icon: const Icon(Icons.qr_code_scanner_rounded, size: 16),
                                label: const Text('Scan in Store', style: TextStyle(fontSize: 12)),
                                style: OutlinedButton.styleFrom(
                                  foregroundColor: AppColors.genieTeal,
                                  side: const BorderSide(color: AppColors.genieTeal),
                                  padding: const EdgeInsets.symmetric(vertical: 10),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                ),
                              ),
                            ),
                          if (_selectedStore!.selfCheckout) const SizedBox(width: 8),
                          Expanded(
                            child: ElevatedButton.icon(
                              onPressed: () => widget.onSelectStore(_selectedStore!),
                              icon: const Icon(Icons.storefront_rounded, size: 16),
                              label: const Text('Enter Shop', style: TextStyle(fontSize: 12)),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppColors.genieTeal,
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(vertical: 10),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildStoreMarker({
    required StoreItem store,
    required double topPercent,
    required double leftPercent,
  }) {
    final size = MediaQuery.of(context).size;
    final isSelected = _selectedStore?.id == store.id;

    return Positioned(
      top: size.height * topPercent,
      left: size.width * leftPercent,
      child: GestureDetector(
        onTap: () {
          setState(() {
            _selectedStore = store;
          });
        },
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: isSelected ? AppColors.genieTeal : Colors.white,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(
                  color: isSelected ? Colors.white : AppColors.genieTeal,
                  width: 2,
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.18),
                    blurRadius: 8,
                    offset: const Offset(0, 3),
                  ),
                ],
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(store.emoji, style: const TextStyle(fontSize: 14)),
                  const SizedBox(width: 4),
                  Text(
                    store.name.split(' ')[0],
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: isSelected ? Colors.white : Colors.black87,
                    ),
                  ),
                  if (store.selfCheckout) ...[
                    const SizedBox(width: 3),
                    Icon(
                      Icons.bolt_rounded,
                      size: 13,
                      color: isSelected ? AppColors.sparkAmber : AppColors.genieTeal,
                    ),
                  ],
                ],
              ),
            ),
            Icon(
              Icons.arrow_drop_down_rounded,
              size: 20,
              color: isSelected ? AppColors.genieTeal : Colors.white,
            ),
          ],
        ),
      ),
    );
  }
}

class _MapGridPainter extends CustomPainter {
  final bool isDark;
  _MapGridPainter({required this.isDark});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = isDark ? Colors.white.withValues(alpha: 0.04) : Colors.black.withValues(alpha: 0.04)
      ..strokeWidth = 1.0;

    const step = 40.0;
    for (double x = 0; x < size.width; x += step) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), paint);
    }
    for (double y = 0; y < size.height; y += step) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
