import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

import '../../../models/store_item.dart';

Set<Marker> buildShopMarkers(
  Iterable<StoreItem> shops, {
  required ValueChanged<StoreItem> onShopSelected,
}) {
  return {
    for (final shop in shops)
      if (hasValidCoordinates(shop))
        Marker(
          markerId: MarkerId(shop.id),
          position: LatLng(shop.lat!, shop.lng!),
          infoWindow: InfoWindow(
            title: shop.name,
            snippet: shop.address.isEmpty ? null : shop.address,
          ),
          onTap: () => onShopSelected(shop),
        ),
  };
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
    required this.initialTarget,
    required this.markers,
    required this.onMapCreated,
    required this.myLocationEnabled,
  });

  final LatLng initialTarget;
  final Set<Marker> markers;
  final ValueChanged<GoogleMapController> onMapCreated;
  final bool myLocationEnabled;

  @override
  Widget build(BuildContext context) {
    return GoogleMap(
      initialCameraPosition: CameraPosition(
        target: initialTarget,
        zoom: 13,
      ),
      markers: markers,
      myLocationEnabled: myLocationEnabled,
      myLocationButtonEnabled: false,
      zoomControlsEnabled: false,
      mapToolbarEnabled: false,
      compassEnabled: true,
      onMapCreated: onMapCreated,
    );
  }
}
