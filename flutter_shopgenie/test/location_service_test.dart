import 'package:flutter_test/flutter_test.dart';
import 'package:geolocator/geolocator.dart';
import 'package:shopgenie/features/nearby_shops/services/location_service.dart';

void main() {
  group('locationAccessStatus', () {
    test('treats granted permissions as granted', () {
      expect(
        locationAccessStatus(LocationPermission.always),
        LocationAccessStatus.granted,
      );
      expect(
        locationAccessStatus(LocationPermission.whileInUse),
        LocationAccessStatus.granted,
      );
    });

    test('distinguishes denied and permanently denied permissions', () {
      expect(
        locationAccessStatus(LocationPermission.denied),
        LocationAccessStatus.denied,
      );
      expect(
        locationAccessStatus(LocationPermission.deniedForever),
        LocationAccessStatus.permanentlyDenied,
      );
    });

    test('handles unknown permission state', () {
      expect(
        locationAccessStatus(LocationPermission.unableToDetermine),
        LocationAccessStatus.unavailable,
      );
    });
  });
}
