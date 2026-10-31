import 'dart:async';

import 'package:geolocator/geolocator.dart';

enum LocationAccessStatus {
  granted,
  denied,
  permanentlyDenied,
  serviceDisabled,
  unavailable,
}

class DeviceLocation {
  const DeviceLocation({
    required this.latitude,
    required this.longitude,
  });

  final double latitude;
  final double longitude;
}

class LocationResult {
  const LocationResult({
    required this.status,
    this.location,
  });

  final LocationAccessStatus status;
  final DeviceLocation? location;
}

abstract interface class LocationService {
  Future<LocationResult> getCurrentLocation();

  Future<bool> openAppSettings();
}

class GeolocatorLocationService implements LocationService {
  const GeolocatorLocationService();

  @override
  Future<LocationResult> getCurrentLocation() async {
    if (!await Geolocator.isLocationServiceEnabled()) {
      return const LocationResult(
        status: LocationAccessStatus.serviceDisabled,
      );
    }

    var permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
    }

    final accessStatus = locationAccessStatus(permission);
    if (accessStatus != LocationAccessStatus.granted) {
      return LocationResult(status: accessStatus);
    }

    try {
      final position = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.medium,
          timeLimit: Duration(seconds: 15),
        ),
      );
      return LocationResult(
        status: LocationAccessStatus.granted,
        location: DeviceLocation(
          latitude: position.latitude,
          longitude: position.longitude,
        ),
      );
    } on LocationServiceDisabledException {
      return const LocationResult(
        status: LocationAccessStatus.serviceDisabled,
      );
    } on PermissionDeniedException {
      return const LocationResult(status: LocationAccessStatus.denied);
    } on TimeoutException {
      return const LocationResult(status: LocationAccessStatus.unavailable);
    }
  }

  @override
  Future<bool> openAppSettings() => Geolocator.openAppSettings();
}

LocationAccessStatus locationAccessStatus(LocationPermission permission) {
  return switch (permission) {
    LocationPermission.always ||
    LocationPermission.whileInUse =>
      LocationAccessStatus.granted,
    LocationPermission.denied => LocationAccessStatus.denied,
    LocationPermission.deniedForever => LocationAccessStatus.permanentlyDenied,
    LocationPermission.unableToDetermine => LocationAccessStatus.unavailable,
  };
}
