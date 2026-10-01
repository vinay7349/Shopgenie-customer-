import 'package:flutter/material.dart';
import '../models/user_role.dart';
import '../theme/app_colors.dart';

class ProfileScreen extends StatelessWidget {
  final UserRole userRole;
  final ValueChanged<UserRole> onRoleChanged;
  final ThemeMode themeMode;
  final ValueChanged<ThemeMode> onThemeModeChanged;
  final VoidCallback? onBack;

  const ProfileScreen({
    super.key,
    required this.userRole,
    required this.onRoleChanged,
    required this.themeMode,
    required this.onThemeModeChanged,
    this.onBack,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBackground : const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Account & Role Settings', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        elevation: 0,
        backgroundColor: isDark ? AppColors.darkSurface : Colors.white,
        leading: onBack != null
            ? IconButton(
                icon: const Icon(Icons.arrow_back_rounded),
                onPressed: onBack,
              )
            : null,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // User Card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: isDark ? AppColors.darkSurface : Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: isDark ? AppColors.darkBorder : const Color(0xFFE2E8F0),
              ),
            ),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 30,
                  backgroundColor: AppColors.genieTeal.withValues(alpha: 0.15),
                  child: const Text('VK', style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.genieTeal, fontSize: 20)),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Vinay Kharvik',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'vinaykharvik09@gmail.com',
                        style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                      ),
                      const SizedBox(height: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: AppColors.genieTeal.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Text(
                          '⚡ ${userRole.badgeText}',
                          style: const TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: AppColors.genieTeal,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: isDark ? AppColors.darkSurface : Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: isDark ? AppColors.darkBorder : const Color(0xFFE2E8F0),
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Appearance',
                  style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 4),
                Text(
                  'Choose how ShopGenie looks on this device.',
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: theme.colorScheme.onSurface.withValues(alpha: 0.7),
                  ),
                ),
                const SizedBox(height: 14),
                SizedBox(
                  width: double.infinity,
                  child: SegmentedButton<ThemeMode>(
                    showSelectedIcon: false,
                    segments: const [
                      ButtonSegment(
                        value: ThemeMode.system,
                        icon: Icon(Icons.brightness_auto_rounded),
                        label: Text('System'),
                      ),
                      ButtonSegment(
                        value: ThemeMode.light,
                        icon: Icon(Icons.light_mode_rounded),
                        label: Text('Light'),
                      ),
                      ButtonSegment(
                        value: ThemeMode.dark,
                        icon: Icon(Icons.dark_mode_rounded),
                        label: Text('Dark'),
                      ),
                    ],
                    selected: {themeMode},
                    onSelectionChanged: (selection) {
                      onThemeModeChanged(selection.first);
                    },
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Role Switcher Card (Multi-Role Deck feature!)
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: userRole == UserRole.admin
                    ? [const Color(0xFF78350F).withValues(alpha: 0.15), const Color(0xFFB45309).withValues(alpha: 0.1)]
                    : [AppColors.genieTeal.withValues(alpha: 0.12), AppColors.aiViolet.withValues(alpha: 0.08)],
              ),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: userRole == UserRole.admin ? AppColors.sparkAmber : AppColors.genieTeal.withValues(alpha: 0.4),
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Icon(
                          userRole == UserRole.admin ? Icons.admin_panel_settings_rounded : Icons.shopping_bag_rounded,
                          color: userRole == UserRole.admin ? const Color(0xFFB45309) : AppColors.genieTeal,
                          size: 22,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          'Active Workspace Role',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                            color: userRole == UserRole.admin ? const Color(0xFFB45309) : AppColors.genieTeal,
                          ),
                        ),
                      ],
                    ),
                    Switch.adaptive(
                      value: userRole == UserRole.admin,
                      activeThumbColor: AppColors.sparkAmber,
                      onChanged: (isAdmin) {
                        onRoleChanged(isAdmin ? UserRole.admin : UserRole.shopper);
                      },
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  userRole == UserRole.admin
                      ? 'You are viewing the Merchant Console with sales metrics, QR station printer, and live aisle inventory.'
                      : 'You are viewing the Shopper experience with store map, aisle scanner, flash deals, and self-checkout.',
                  style: TextStyle(fontSize: 12, color: theme.colorScheme.onSurface.withValues(alpha: 0.7)),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Loyalty Wallet Balance
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: isDark ? AppColors.darkSurface : Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: isDark ? AppColors.darkBorder : const Color(0xFFE2E8F0)),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: AppColors.sparkAmber.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: const Icon(Icons.stars_rounded, color: AppColors.sparkAmber, size: 28),
                ),
                const SizedBox(width: 14),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('250 Genie Coins', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                      Text('Worth \$2.50 in instant cashback at verified stores', style: TextStyle(fontSize: 11, color: Colors.grey)),
                    ],
                  ),
                ),
                ElevatedButton(
                  onPressed: () {},
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.genieTeal,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    minimumSize: Size.zero,
                  ),
                  child: const Text('Redeem', style: TextStyle(fontSize: 11)),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Menu Options
          _buildMenuTile(context, Icons.location_on_outlined, 'Saved Addresses & Delivery Zones', 'Indiranagar 100ft Rd, Koramangala 4th Block'),
          _buildMenuTile(context, Icons.receipt_long_outlined, 'Self-Checkout Receipt History', '3 digital exit passes available'),
          _buildMenuTile(context, Icons.payment_outlined, 'Payment Methods & Fast UPI', 'Google Pay, Apple Pay, Cards linked'),
          _buildMenuTile(context, Icons.help_outline_rounded, 'ShopGenie Help & Store Verification', 'FAQ & merchant onboarding guide'),
          const SizedBox(height: 20),

          // Footer
          const Center(
            child: Text(
              'ShopGenie Multi-Role Deck · v1.0.0 (Flutter 3.24)',
              style: TextStyle(fontSize: 11, color: Colors.grey),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMenuTile(BuildContext context, IconData icon, String title, String subtitle) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkSurface : Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: isDark ? AppColors.darkBorder : const Color(0xFFE2E8F0),
        ),
      ),
      child: Row(
        children: [
          Icon(icon, size: 20, color: AppColors.genieTeal),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                Text(
                  subtitle,
                  style: TextStyle(
                    fontSize: 11,
                    color: theme.colorScheme.onSurface.withValues(alpha: 0.65),
                  ),
                ),
              ],
            ),
          ),
          const Icon(Icons.chevron_right_rounded, size: 18, color: Colors.grey),
        ],
      ),
    );
  }
}
