enum UserRole {
  shopper,
  verifier,
}

extension UserRoleExtension on UserRole {
  String get label {
    switch (this) {
      case UserRole.shopper:
        return 'Shopper';
      case UserRole.verifier:
        return 'Gate Verifier';
    }
  }

  String get badgeText {
    switch (this) {
      case UserRole.shopper:
        return 'Shopper Mode';
      case UserRole.verifier:
        return 'Gate Verifier Mode';
    }
  }

  String get description {
    switch (this) {
      case UserRole.shopper:
        return 'Browse local stores, scan barcodes, and self-checkout.';
      case UserRole.verifier:
        return 'Verify customer exit passes, count items, and unlock turnstiles.';
    }
  }
}
