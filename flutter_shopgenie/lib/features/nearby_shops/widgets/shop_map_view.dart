import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../models/store_item.dart';

List<Marker> buildShopMarkers(
  Iterable<StoreItem> shops, {
  required ValueChanged<StoreItem> onShopSelected,
}) {
  return [
    for (final shop in shops)
      if (hasValidCoordinates(shop))
        Marker(
          key: ValueKey('shop-marker-${shop.id}'),
          point: LatLng(shop.lat!, shop.lng!),
          width: 44,
          height: 48,
          alignment: Alignment.topCenter,
          child: GestureDetector(
            onTap: () => onShopSelected(shop),
            child: Tooltip(
              message: shop.name,
              child: const Icon(
                Icons.location_on,
                color: Colors.red,
                size: 44,
              ),
            ),
          ),
        ),
  ];
}

bool hasValidCoordinates(StoreItem shop) {
  final latitude = shop.lat;
  final longitude = shop.lng;
  return latitude != null &&
      longitude != null &&
      latitude.isFinite &&
      longitude.isFinite &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180;
}

class ShopMapView extends StatelessWidget {
  const ShopMapView({
    super.key,
    required this.controller,
    required this.initialTarget,
    required this.initialZoom,
    required this.markers,
    required this.onMapReady,
  });

  final MapController controller;
  final LatLng initialTarget;
  final double initialZoom;
  final List<Marker> markers;
  final VoidCallback onMapReady;

  @override
  Widget build(BuildContext context) {
    return FlutterMap(
      mapController: controller,
      options: MapOptions(
        initialCenter: initialTarget,
        initialZoom: initialZoom,
        onMapReady: onMapReady,
      ),
      children: [
        TileLayer(
          urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          userAgentPackageName: 'com.shopgenie',
          maxZoom: 19,
        ),
        MarkerLayer(markers: markers),
        Align(
          alignment: Alignment.bottomLeft,
          child: SafeArea(
            minimum: const EdgeInsets.all(4),
            child: Material(
              color: Theme.of(context).colorScheme.surface.withValues(
                    alpha: 0.85,
                  ),
              borderRadius: BorderRadius.circular(4),
              child: InkWell(
                borderRadius: BorderRadius.circular(4),
                onTap: () async {
                  final opened = await launchUrl(
                    Uri.parse('https://www.openstreetmap.org/copyright'),
                    mode: LaunchMode.externalApplication,
                  );
                  if (!opened && context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text(
                          'Could not open the OpenStreetMap copyright page.',
                        ),
                      ),
                    );
                  }
                },
                child: const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                  child: Text(
                    '© OpenStreetMap contributors',
                    style: TextStyle(fontSize: 11),
                  ),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
