enum UserRole {
  shopper,
  admin,
}

extension UserRoleExtension on UserRole {
  String get label {
    switch (this) {
      case UserRole.shopper:
        return 'Shopper';
      case UserRole.admin:
        return 'Store Admin';
    }
  }

  String get badgeText {
    switch (this) {
      case UserRole.shopper:
        return 'Shopper Mode';
      case UserRole.admin:
        return 'Merchant Deck';
    }
  }
}
