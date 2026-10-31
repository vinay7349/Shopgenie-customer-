import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

import '../features/nearby_shops/services/location_service.dart';
import '../features/nearby_shops/widgets/shop_map_view.dart';
import '../models/store_item.dart';
import '../services/shop_service.dart';
import '../theme/app_colors.dart';

const _googleMapsKeyConfigured = bool.fromEnvironment(
  'GOOGLE_MAPS_API_KEY_CONFIGURED',
);

class MapScreen extends StatefulWidget {
  final String currentLocation;
  final Function(StoreItem) onSelectStore;
  final VoidCallback onOpenScanner;
  final LocationService locationService;
  final Future<List<StoreItem>> Function()? loadShops;

  const MapScreen({
    super.key,
    required this.currentLocation,
    required this.onSelectStore,
    required this.onOpenScanner,
    this.locationService = const GeolocatorLocationService(),
    this.loadShops,
  });

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  static const _shopCacheDuration = Duration(minutes: 2);
  static List<StoreItem>? _cachedShops;
  static DateTime? _shopsCachedAt;

  final _searchController = TextEditingController();
  final _searchFocusNode = FocusNode();
  GoogleMapController? _mapController;
  List<StoreItem> _shops = const [];
  StoreItem? _selectedShop;
  String _selectedCategory = 'All';
  DeviceLocation? _deviceLocation;
  String? _shopError;
  String? _locationMessage;
  bool _isLoadingShops = true;
  bool _isShowingCachedShops = false;
  bool _isLoadingLocation = false;
  bool _showList = false;
  String _searchQuery = '';
  LocationAccessStatus? _locationStatus;

  bool get _supportsNativeMap =>
      defaultTargetPlatform == TargetPlatform.android ||
      defaultTargetPlatform == TargetPlatform.iOS;

  bool get _usesSharedShopCache => widget.loadShops == null;

  List<String> get _categories => ShopService.categoriesFor(_shops);

  List<StoreItem> get _filteredShops {
    final query = _searchQuery.trim().toLowerCase();
    final shops = ShopService.filterStores(
      stores: _shops,
      query: query,
      category: _selectedCategory,
    );
    if (_deviceLocation == null) return shops;
    return [...shops]..sort(
        (a, b) => _distanceInMeters(a).compareTo(_distanceInMeters(b)),
      );
  }

  List<StoreItem> get _mappedShops =>
      _filteredShops.where(hasValidCoordinates).toList(growable: false);

  @override
  void initState() {
    super.initState();
    final cachedShops = _cachedShops;
    final cachedAt = _shopsCachedAt;
    if (cachedShops != null && cachedAt != null) {
      _shops = cachedShops;
      _isShowingCachedShops = true;
      _isLoadingShops = false;
      if (DateTime.now().difference(cachedAt) >= _shopCacheDuration) {
        _loadShops();
      }
    } else {
      _loadShops();
    }
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) _showLocationRationale();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    _searchFocusNode.dispose();
    _mapController?.dispose();
    super.dispose();
  }

  Future<void> _loadShops() async {
    setState(() {
      _isLoadingShops = true;
      _shopError = null;
    });
    try {
      final shops = await (widget.loadShops ?? ShopService.fetchShops)();
      if (!mounted) return;
      setState(() {
        _shops = shops;
        _isLoadingShops = false;
        _isShowingCachedShops = false;
        if (_usesSharedShopCache) {
          _cachedShops = shops;
          _shopsCachedAt = DateTime.now();
        }
        if (_selectedShop != null &&
            !shops.any((shop) => shop.id == _selectedShop!.id)) {
          _selectedShop = null;
        }
      });
      _moveCameraToAvailableShops();
    } catch (error) {
      if (!mounted) return;
      setState(() {
        _shopError = error.toString();
        _isLoadingShops = false;
        _isShowingCachedShops = _shops.isNotEmpty;
      });
    }
  }

  Future<void> _showLocationRationale() async {
    final shouldContinue = await _confirmLocationUse();
    if (shouldContinue && mounted) {
      await _requestLocation();
    }
  }

  Future<bool> _confirmLocationUse() async {
    return await showDialog<bool>(
          context: context,
          builder: (context) => AlertDialog(
            title: const Text('Find shops near you'),
            content: const Text(
              'Your location helps center the map and sort nearby shops. '
              'You can still browse the shop list without sharing your location.',
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context, false),
                child: const Text('Not now'),
              ),
              FilledButton(
                onPressed: () => Navigator.pop(context, true),
                child: const Text('Continue'),
              ),
            ],
          ),
        ) ??
        false;
  }

  Future<void> _requestLocationWithRationale() async {
    final shouldContinue = await _confirmLocationUse();
    if (shouldContinue && mounted) {
      await _requestLocation();
    }
  }

  Future<void> _requestLocation() async {
    setState(() {
      _isLoadingLocation = true;
      _locationMessage = null;
    });
    try {
      final result = await widget.locationService.getCurrentLocation();
      if (!mounted) return;
      setState(() {
        _isLoadingLocation = false;
        _locationStatus = result.status;
        _deviceLocation = result.location;
        _locationMessage = _messageForLocationStatus(result.status);
      });
      if (result.location case final location?) {
        _mapController?.animateCamera(
          CameraUpdate.newLatLngZoom(
            LatLng(location.latitude, location.longitude),
            14,
          ),
        );
      }
    } catch (error) {
      if (!mounted) return;
      setState(() {
        _isLoadingLocation = false;
        _locationStatus = LocationAccessStatus.unavailable;
        _locationMessage =
            'Could not get your location. You can still browse shops.';
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Location unavailable: $error')),
      );
    }
  }

  Future<void> _openLocationSettings() async {
    final opened = await widget.locationService.openAppSettings();
    if (!opened && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Could not open app settings.')),
      );
    }
  }

  String? _messageForLocationStatus(LocationAccessStatus status) {
    return switch (status) {
      LocationAccessStatus.granted => null,
      LocationAccessStatus.denied =>
        'Location permission was denied. You can still browse all shops.',
      LocationAccessStatus.permanentlyDenied =>
        'Location permission is off. Enable it in app settings to center the map.',
      LocationAccessStatus.serviceDisabled =>
        'Turn on your device location to find nearby shops.',
      LocationAccessStatus.unavailable =>
        'Location is unavailable. You can still browse all shops.',
    };
  }

  double _distanceInMeters(StoreItem shop) {
    final location = _deviceLocation;
    if (location == null || !hasValidCoordinates(shop)) {
      return double.infinity;
    }
    return Geolocator.distanceBetween(
      location.latitude,
      location.longitude,
      shop.lat!,
      shop.lng!,
    );
  }

  String _displayDistance(StoreItem shop) {
    if (_deviceLocation != null && hasValidCoordinates(shop)) {
      final meters = _distanceInMeters(shop);
      return meters < 1000
          ? '${meters.round()} m away'
          : '${(meters / 1000).toStringAsFixed(1)} km away';
    }
    return shop.distance.trim();
  }

  void _onMapCreated(GoogleMapController controller) {
    _mapController = controller;
    _moveCameraToAvailableShops();
    final location = _deviceLocation;
    if (location != null) {
      controller.moveCamera(
        CameraUpdate.newLatLng(
          LatLng(location.latitude, location.longitude),
        ),
      );
    }
  }

  void _moveCameraToAvailableShops() {
    if (_deviceLocation != null || _mappedShops.isEmpty) return;
    final firstShop = _mappedShops.first;
    _mapController?.animateCamera(
      CameraUpdate.newLatLngZoom(
        LatLng(firstShop.lat!, firstShop.lng!),
        12,
      ),
    );
  }

  void _selectShop(StoreItem shop) {
    setState(() => _selectedShop = shop);
    if (hasValidCoordinates(shop)) {
      _mapController?.animateCamera(
        CameraUpdate.newLatLngZoom(
          LatLng(shop.lat!, shop.lng!),
          15,
        ),
      );
    }
  }

  void _setSearchQuery(String query) {
    setState(() {
      _searchQuery = query;
      if (_selectedShop != null &&
          !ShopService.filterStores(
            stores: [_selectedShop!],
            query: query,
          ).isNotEmpty) {
        _selectedShop = null;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        title: const Text(
          'Nearby Shops',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            tooltip: _showList ? 'Show map' : 'Show list',
            onPressed: () => setState(() => _showList = !_showList),
            icon: Icon(_showList ? Icons.map_outlined : Icons.list_rounded),
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 12),
            child: Column(
              children: [
                TextField(
                  controller: _searchController,
                  focusNode: _searchFocusNode,
                  onChanged: _setSearchQuery,
                  textInputAction: TextInputAction.search,
                  decoration: InputDecoration(
                    hintText: 'Search shops',
                    prefixIcon: const Icon(Icons.search_rounded),
                    suffixIcon: _searchQuery.isEmpty
                        ? null
                        : IconButton(
                            tooltip: 'Clear search',
                            onPressed: () {
                              _searchController.clear();
                              _setSearchQuery('');
                            },
                            icon: const Icon(Icons.close_rounded),
                          ),
                    filled: true,
                    fillColor: theme.colorScheme.surface,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(18),
                      borderSide:
                          BorderSide(color: theme.colorScheme.outlineVariant),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(18),
                      borderSide:
                          BorderSide(color: theme.colorScheme.outlineVariant),
                    ),
                  ),
                ),
                const SizedBox(height: 8),
                SizedBox(
                  height: 36,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    itemCount: _categories.length,
                    separatorBuilder: (_, __) => const SizedBox(width: 6),
                    itemBuilder: (context, index) {
                      final category = _categories[index];
                      final isSelected = category == _selectedCategory;
                      return ChoiceChip(
                        label: Text(category),
                        selected: isSelected,
                        onSelected: (_) {
                          setState(() {
                            _selectedCategory = category;
                            if (_selectedShop != null &&
                                !ShopService.filterStores(
                                  stores: [_selectedShop!],
                                  category: category,
                                ).isNotEmpty) {
                              _selectedShop = null;
                            }
                          });
                        },
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
          if (_locationMessage != null)
            _LocationStatusBanner(
              message: _locationMessage!,
              showSettings:
                  _locationStatus == LocationAccessStatus.permanentlyDenied,
              onOpenSettings: _openLocationSettings,
            ),
          if (_shopError != null)
            MaterialBanner(
              content: Text(
                _isShowingCachedShops
                    ? 'Could not connect to ShopGenie. Showing previously loaded shops.'
                    : 'Could not connect to ShopGenie. Retry to load shops.',
              ),
              leading: const Icon(Icons.wifi_off_rounded),
              actions: [
                TextButton(
                  onPressed: _isLoadingShops ? null : _loadShops,
                  child: const Text('Retry'),
                ),
              ],
            ),
          if (_isShowingCachedShops && _shopError == null)
            MaterialBanner(
              content: const Text('Showing recently loaded shops.'),
              leading: const Icon(Icons.cloud_done_outlined),
              actions: [
                TextButton(
                  onPressed: _isLoadingShops ? null : _loadShops,
                  child: const Text('Refresh'),
                ),
              ],
            ),
          Expanded(
            child: _showList ? _buildShopList() : _buildMapArea(),
          ),
        ],
      ),
    );
  }

  Widget _buildMapArea() {
    final initialTarget = _deviceLocation != null
        ? LatLng(_deviceLocation!.latitude, _deviceLocation!.longitude)
        : _mappedShops.isNotEmpty
            ? LatLng(_mappedShops.first.lat!, _mappedShops.first.lng!)
            : const LatLng(0, 0);
    final markers = buildShopMarkers(
      _filteredShops,
      onShopSelected: _selectShop,
    );

    return Stack(
      children: [
        Positioned.fill(
          child: _supportsNativeMap && _googleMapsKeyConfigured
              ? ShopMapView(
                  key: const ValueKey('shopgenie-google-map'),
                  initialTarget: initialTarget,
                  markers: markers,
                  onMapCreated: _onMapCreated,
                  myLocationEnabled: _deviceLocation != null,
                )
              : _MapUnavailable(
                  message: !_supportsNativeMap
                      ? 'Google Maps is available in the Android and iOS apps.'
                      : 'Configure a restricted Google Maps API key to display the map. You can browse shops in list view.',
                  onShowList: () => setState(() => _showList = true),
                ),
        ),
        if (_isLoadingShops)
          const Positioned(
            top: 12,
            left: 16,
            child: _MapLoadingIndicator(),
          ),
        Positioned(
          right: 16,
          bottom: _selectedShop == null ? 24 : 190,
          child: FloatingActionButton.small(
            heroTag: 'my-location',
            tooltip: 'Use my current location',
            onPressed:
                _isLoadingLocation ? null : _requestLocationWithRationale,
            child: _isLoadingLocation
                ? const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : const Icon(Icons.my_location_rounded),
          ),
        ),
        if (!_isLoadingShops && _shops.isEmpty && _shopError == null)
          const Positioned(
            left: 16,
            right: 16,
            top: 72,
            child: _MapNotice(
              icon: Icons.store_mall_directory_outlined,
              message: 'No shops are available yet.',
            ),
          ),
        if (!_isLoadingShops && _shops.isNotEmpty && _mappedShops.isEmpty)
          Positioned(
            left: 16,
            right: 16,
            top: 72,
            child: _MapNotice(
              icon: Icons.location_off_outlined,
              message:
                  '${_filteredShops.length} shops found, but none have map coordinates yet.',
              actionLabel: 'View list',
              onAction: () => setState(() => _showList = true),
            ),
          ),
        if (_selectedShop != null)
          Positioned(
            left: 16,
            right: 72,
            bottom: 16,
            child: _ShopPreviewCard(
              shop: _selectedShop!,
              distance: _displayDistance(_selectedShop!),
              onClose: () => setState(() => _selectedShop = null),
              onViewShop: () => widget.onSelectStore(_selectedShop!),
              onOpenScanner: widget.onOpenScanner,
            ),
          ),
      ],
    );
  }

  Widget _buildShopList() {
    if (_isLoadingShops && _shops.isEmpty) {
      return const Center(child: CircularProgressIndicator());
    }
    if (_shops.isEmpty) {
      return _ShopListEmptyState(
        message: _shopError == null
            ? 'There are no registered shops to show yet.'
            : 'Could not load shops. Check your connection and try again.',
        onRetry: _shopError == null ? null : _loadShops,
      );
    }

    final shops = _filteredShops;
    if (shops.isEmpty) {
      return const _ShopListEmptyState(
        message: 'No shops match your search.',
      );
    }

    return RefreshIndicator(
      onRefresh: _loadShops,
      child: ListView.separated(
        padding: const EdgeInsets.fromLTRB(16, 4, 16, 24),
        itemCount: shops.length,
        separatorBuilder: (_, __) => const SizedBox(height: 10),
        itemBuilder: (context, index) {
          final shop = shops[index];
          final distance = _displayDistance(shop);
          return Card(
            margin: EdgeInsets.zero,
            child: ListTile(
              contentPadding:
                  const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              leading: CircleAvatar(
                backgroundColor: AppColors.genieTeal.withValues(alpha: 0.12),
                child: Text(shop.emoji, style: const TextStyle(fontSize: 22)),
              ),
              title: Text(
                shop.name,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(fontWeight: FontWeight.w700),
              ),
              subtitle: Padding(
                padding: const EdgeInsets.only(top: 4),
                child: Text(
                  [
                    if (shop.category.isNotEmpty) shop.category,
                    if (shop.address.isNotEmpty) shop.address,
                    if (distance.isNotEmpty) distance,
                    if (!hasValidCoordinates(shop)) 'Map location unavailable',
                  ].join(' · '),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              trailing: const Icon(Icons.chevron_right_rounded),
              onTap: () {
                widget.onSelectStore(shop);
              },
            ),
          );
        },
      ),
    );
  }
}

class _LocationStatusBanner extends StatelessWidget {
  const _LocationStatusBanner({
    required this.message,
    required this.showSettings,
    required this.onOpenSettings,
  });

  final String message;
  final bool showSettings;
  final VoidCallback onOpenSettings;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.fromLTRB(16, 0, 16, 8),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surfaceContainerHighest,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          const Icon(Icons.location_on_outlined, size: 18),
          const SizedBox(width: 8),
          Expanded(child: Text(message, style: const TextStyle(fontSize: 12))),
          if (showSettings)
            TextButton(
              onPressed: onOpenSettings,
              child: const Text('Settings'),
            ),
        ],
      ),
    );
  }
}

class _MapUnavailable extends StatelessWidget {
  const _MapUnavailable({
    required this.message,
    required this.onShowList,
  });

  final String message;
  final VoidCallback onShowList;

  @override
  Widget build(BuildContext context) {
    return ColoredBox(
      color: Theme.of(context).colorScheme.surfaceContainerHighest,
      child: Center(
        child: Padding(
          padding: const EdgeInsets.all(28),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.map_outlined, size: 48),
              const SizedBox(height: 12),
              Text(message, textAlign: TextAlign.center),
              const SizedBox(height: 16),
              OutlinedButton.icon(
                onPressed: onShowList,
                icon: const Icon(Icons.list_rounded),
                label: const Text('Browse shop list'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _MapLoadingIndicator extends StatelessWidget {
  const _MapLoadingIndicator();

  @override
  Widget build(BuildContext context) {
    return Material(
      elevation: 3,
      borderRadius: BorderRadius.circular(20),
      child: const Padding(
        padding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            SizedBox(
              width: 16,
              height: 16,
              child: CircularProgressIndicator(strokeWidth: 2),
            ),
            SizedBox(width: 8),
            Text('Loading shops', style: TextStyle(fontSize: 12)),
          ],
        ),
      ),
    );
  }
}

class _MapNotice extends StatelessWidget {
  const _MapNotice({
    required this.icon,
    required this.message,
    this.actionLabel,
    this.onAction,
  });

  final IconData icon;
  final String message;
  final String? actionLabel;
  final VoidCallback? onAction;

  @override
  Widget build(BuildContext context) {
    return Material(
      elevation: 3,
      borderRadius: BorderRadius.circular(16),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        child: Row(
          children: [
            Icon(icon, color: AppColors.genieTeal),
            const SizedBox(width: 10),
            Expanded(
                child: Text(message, style: const TextStyle(fontSize: 12))),
            if (actionLabel != null)
              TextButton(onPressed: onAction, child: Text(actionLabel!)),
          ],
        ),
      ),
    );
  }
}

class _ShopPreviewCard extends StatelessWidget {
  const _ShopPreviewCard({
    required this.shop,
    required this.distance,
    required this.onClose,
    required this.onViewShop,
    required this.onOpenScanner,
  });

  final StoreItem shop;
  final String distance;
  final VoidCallback onClose;
  final VoidCallback onViewShop;
  final VoidCallback onOpenScanner;

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 8,
      clipBehavior: Clip.antiAlias,
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  backgroundColor: AppColors.genieTeal.withValues(alpha: 0.12),
                  child: Text(shop.emoji, style: const TextStyle(fontSize: 22)),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        shop.name,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        [
                          if (shop.category.isNotEmpty) shop.category,
                          if (distance.isNotEmpty) distance,
                        ].join(' · '),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ],
                  ),
                ),
                IconButton(
                  tooltip: 'Close shop preview',
                  onPressed: onClose,
                  icon: const Icon(Icons.close_rounded),
                ),
              ],
            ),
            if (shop.address.isNotEmpty) ...[
              const SizedBox(height: 8),
              Text(
                shop.address,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ],
            const SizedBox(height: 10),
            Row(
              children: [
                if (shop.selfCheckout) ...[
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: onOpenScanner,
                      icon: const Icon(Icons.auto_awesome, size: 17),
                      label: const Text('AI Scan'),
                    ),
                  ),
                  const SizedBox(width: 8),
                ],
                Expanded(
                  child: FilledButton.icon(
                    onPressed: onViewShop,
                    icon: const Icon(Icons.storefront_rounded, size: 18),
                    label: const Text('View shop'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _ShopListEmptyState extends StatelessWidget {
  const _ShopListEmptyState({
    required this.message,
    this.onRetry,
  });

  final String message;
  final VoidCallback? onRetry;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(
              Icons.store_mall_directory_outlined,
              size: 48,
              color: AppColors.genieTeal,
            ),
            const SizedBox(height: 12),
            Text(message, textAlign: TextAlign.center),
            if (onRetry != null) ...[
              const SizedBox(height: 12),
              OutlinedButton.icon(
                onPressed: onRetry,
                icon: const Icon(Icons.refresh_rounded),
                label: const Text('Retry'),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
