import 'package:flutter/material.dart';
import '../models/user_role.dart';
import '../theme/app_colors.dart';

class ProfileScreen extends StatefulWidget {
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
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  String _name = 'Vinay Kharvik';
  String _email = 'vinaykharvik09@gmail.com';
  String _phone = '+91 98450 12345';
  String _area = 'Koramangala 4th Block, Bengaluru';

  void _showEditProfileDialog() {
    final nameCtrl = TextEditingController(text: _name);
    final emailCtrl = TextEditingController(text: _email);
    final phoneCtrl = TextEditingController(text: _phone);
    final areaCtrl = TextEditingController(text: _area);

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: const Text('Edit Profile Details', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: nameCtrl,
                decoration: const InputDecoration(labelText: 'Full Name', prefixIcon: Icon(Icons.person_outline, size: 20)),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: emailCtrl,
                decoration: const InputDecoration(labelText: 'Email Address', prefixIcon: Icon(Icons.email_outlined, size: 20)),
                keyboardType: TextInputType.emailAddress,
              ),
              const SizedBox(height: 12),
              TextField(
                controller: phoneCtrl,
                decoration: const InputDecoration(labelText: 'Phone Number', prefixIcon: Icon(Icons.phone_outlined, size: 20)),
                keyboardType: TextInputType.phone,
              ),
              const SizedBox(height: 12),
              TextField(
                controller: areaCtrl,
                decoration: const InputDecoration(labelText: 'Neighbourhood Area', prefixIcon: Icon(Icons.location_on_outlined, size: 20)),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF2563EB), 
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            onPressed: () {
              if (nameCtrl.text.trim().isNotEmpty && emailCtrl.text.trim().isNotEmpty) {
                setState(() {
                  _name = nameCtrl.text.trim();
                  _email = emailCtrl.text.trim();
                  _phone = phoneCtrl.text.trim();
                  _area = areaCtrl.text.trim();
                });
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Profile details updated successfully!')),
                );
              }
            },
            child: const Text('Save Changes'),
          ),
        ],
      ),
    );
  }

  void _showOrdersDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: const Row(
          children: [
            Icon(Icons.receipt_long_rounded, color: Color(0xFF2563EB)),
            SizedBox(width: 8),
            Text('My Orders & History', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          ],
        ),
        content: const SizedBox(
          width: double.maxFinite,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: CircleAvatar(backgroundColor: Color(0xFFEFF6FF), child: Icon(Icons.shopping_bag_outlined, color: Color(0xFF2563EB))),
                title: Text('The Old Coffee Roasters', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                subtitle: Text('Estate Arabica (x1) · Croissant (x1) · ₹640', style: TextStyle(fontSize: 11)),
                trailing: Text('PAID', style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold, fontSize: 11)),
              ),
              Divider(),
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: CircleAvatar(backgroundColor: Color(0xFFEFF6FF), child: Icon(Icons.shopping_bag_outlined, color: Color(0xFF2563EB))),
                title: Text('Nature Green Market', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                subtitle: Text('Avocados (x2) · Almond Milk (x1) · ₹410', style: TextStyle(fontSize: 11)),
                trailing: Text('PAID', style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold, fontSize: 11)),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Close')),
        ],
      ),
    );
  }

  void _showSavedProductsDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: const Row(
          children: [
            Icon(Icons.favorite_rounded, color: Color(0xFFE11D48)),
            SizedBox(width: 8),
            Text('Saved Products', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          ],
        ),
        content: const SizedBox(
          width: double.maxFinite,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: CircleAvatar(backgroundColor: Color(0xFFFFF1F2), child: Text('☕')),
                title: Text('Estate Arabica Coffee', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                subtitle: Text('The Old Coffee Roasters · ₹460', style: TextStyle(fontSize: 11)),
              ),
              Divider(),
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: CircleAvatar(backgroundColor: Color(0xFFFFF1F2), child: Text('🥑')),
                title: Text('Hass Avocados (Pack of 2)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                subtitle: Text('Nature Green Market · ₹220', style: TextStyle(fontSize: 11)),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Done')),
        ],
      ),
    );
  }

  void _showFollowedShopsDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: const Row(
          children: [
            Icon(Icons.storefront_rounded, color: Color(0xFF059669)),
            SizedBox(width: 8),
            Text('My Followed Shops', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          ],
        ),
        content: const SizedBox(
          width: double.maxFinite,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: CircleAvatar(backgroundColor: Color(0xFFECFDF5), child: Icon(Icons.store, color: Color(0xFF059669))),
                title: Text('The Old Coffee Roasters', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                subtitle: Text('Artisanal Roastery · 4.8 ★', style: TextStyle(fontSize: 11)),
              ),
              Divider(),
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: CircleAvatar(backgroundColor: Color(0xFFECFDF5), child: Icon(Icons.store, color: Color(0xFF059669))),
                title: Text('Nature Green Market', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                subtitle: Text('Organic Groceries · 4.9 ★', style: TextStyle(fontSize: 11)),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Done')),
        ],
      ),
    );
  }

  void _showAddressesDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: const Row(
          children: [
            Icon(Icons.location_on_rounded, color: Color(0xFFD97706)),
            SizedBox(width: 8),
            Text('Delivery Addresses', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          ],
        ),
        content: const SizedBox(
          width: double.maxFinite,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: CircleAvatar(backgroundColor: Color(0xFFFEF3C7), child: Icon(Icons.home_outlined, color: Color(0xFFD97706))),
                title: Text('Home (Default)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                subtitle: Text('Flat 402, Green Glen Layout, Koramangala 4th Block, Bengaluru', style: TextStyle(fontSize: 11)),
              ),
              Divider(),
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: CircleAvatar(backgroundColor: Color(0xFFFEF3C7), child: Icon(Icons.work_outline, color: Color(0xFFD97706))),
                title: Text('Work Office', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                subtitle: Text('Prestige Tech Park, Marathahalli-Sarjapur Ring Rd, Bengaluru', style: TextStyle(fontSize: 11)),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Close')),
        ],
      ),
    );
  }

  void _showPaymentsDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: const Row(
          children: [
            Icon(Icons.credit_card_rounded, color: Color(0xFF4F46E5)),
            SizedBox(width: 8),
            Text('Payment Methods', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          ],
        ),
        content: const SizedBox(
          width: double.maxFinite,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: CircleAvatar(backgroundColor: Color(0xFFEEF2FF), child: Icon(Icons.qr_code_2_rounded, color: Color(0xFF4F46E5))),
                title: Text('Google Pay (UPI)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                subtitle: Text('vinaykharvik@okhdfcbank · Primary', style: TextStyle(fontSize: 11)),
              ),
              Divider(),
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: CircleAvatar(backgroundColor: Color(0xFFEEF2FF), child: Icon(Icons.credit_card, color: Color(0xFF4F46E5))),
                title: Text('HDFC Millennia Credit Card', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                subtitle: Text('•••• •••• •••• 4092 (Expires 08/28)', style: TextStyle(fontSize: 11)),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Close')),
        ],
      ),
    );
  }

  void _showNotificationsDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: const Row(
          children: [
            Icon(Icons.notifications_active_rounded, color: Color(0xFF9333EA)),
            SizedBox(width: 8),
            Text('Notifications', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            SwitchListTile(
              contentPadding: EdgeInsets.zero,
              value: true,
              onChanged: (v) {},
              title: const Text('Push Notifications', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
              subtitle: const Text('Receive checkout and order alerts', style: TextStyle(fontSize: 11)),
            ),
            SwitchListTile(
              contentPadding: EdgeInsets.zero,
              value: true,
              onChanged: (v) {},
              title: const Text('Nearby Store Offers', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
              subtitle: const Text('Deals from followed neighborhood shops', style: TextStyle(fontSize: 11)),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Done')),
        ],
      ),
    );
  }

  void _showLogoutDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: const Text('Sign Out', style: TextStyle(fontWeight: FontWeight.bold)),
        content: const Text('Are you sure you want to sign out of your ShopGenie account on this device?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.redAccent, foregroundColor: Colors.white),
            onPressed: () {
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Signed out successfully.')),
              );
            },
            child: const Text('Sign Out'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBackground : const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Account & Profile', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        elevation: 0,
        backgroundColor: isDark ? AppColors.darkSurface : Colors.white,
        actions: const [
          Center(
            child: Padding(
              padding: EdgeInsets.only(right: 16),
              child: Text('ShopGenie Customer', style: TextStyle(color: Color(0xFF2563EB), fontSize: 11, fontWeight: FontWeight.bold)),
            ),
          ),
        ],
        leading: widget.onBack != null
            ? IconButton(
                icon: const Icon(Icons.arrow_back_rounded),
                onPressed: widget.onBack,
              )
            : null,
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        children: [
          // =========================================================
          // 1. PROFILE HEADER CARD WITH CLEAN LOCAL SHOPPING BANNER
          // =========================================================
          Container(
            clipBehavior: Clip.antiAlias,
            decoration: BoxDecoration(
              color: isDark ? AppColors.darkSurface : Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: isDark ? AppColors.darkBorder : const Color(0xFFE2E8F0)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Clean Background / Banner
                Container(
                  height: 100,
                  width: double.infinity,
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      colors: [Color(0xFF2563EB), Color(0xFF4F46E5)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                  ),
                  padding: const EdgeInsets.all(12),
                  child: Align(
                    alignment: Alignment.topLeft,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.black.withValues(alpha: 0.25),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.auto_awesome_rounded, color: Colors.amber, size: 14),
                          SizedBox(width: 4),
                          Text(
                            'Discover. Shop. Support Local.',
                            style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),

                // User Info Body
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Avatar & Edit Profile Button
                      Transform.translate(
                        offset: const Offset(0, -28),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.between,
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            CircleAvatar(
                              radius: 36,
                              backgroundColor: isDark ? AppColors.darkSurface : Colors.white,
                              child: const CircleAvatar(
                                radius: 32,
                                backgroundColor: Color(0xFF2563EB),
                                child: Text('VK', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white, fontSize: 20)),
                              ),
                            ),
                            OutlinedButton.icon(
                              onPressed: _showEditProfileDialog,
                              icon: const Icon(Icons.edit_outlined, size: 14),
                              label: const Text('Edit Profile', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                              style: OutlinedButton.styleFrom(
                                foregroundColor: const Color(0xFF2563EB),
                                backgroundColor: const Color(0xFFEFF6FF),
                                side: const BorderSide(color: Color(0xFFBFDBFE)),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Name, Email, Phone
                      Transform.translate(
                        offset: const Offset(0, -14),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(_name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                            const SizedBox(height: 4),
                            Row(
                              children: [
                                const Icon(Icons.email_outlined, size: 13, color: Colors.grey),
                                const SizedBox(width: 4),
                                Text(_email, style: const TextStyle(fontSize: 11, color: Colors.grey)),
                                const SizedBox(width: 8),
                                const Text('·', style: TextStyle(color: Colors.grey)),
                                const SizedBox(width: 8),
                                const Icon(Icons.phone_outlined, size: 13, color: Colors.grey),
                                const SizedBox(width: 4),
                                Text(_phone, style: const TextStyle(fontSize: 11, color: Colors.grey)),
                              ],
                            ),
                            const SizedBox(height: 10),
                            const Divider(height: 1),
                            const SizedBox(height: 8),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.between,
                              children: [
                                Row(
                                  children: [
                                    const Icon(Icons.location_on, size: 14, color: Color(0xFF2563EB)),
                                    const SizedBox(width: 4),
                                    Text(_area, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w500)),
                                  ],
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFECFDF5),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: const Text('Verified Local Shopper', style: TextStyle(color: Color(0xFF059669), fontSize: 10, fontWeight: FontWeight.bold)),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // =========================================================
          // 2. ACCOUNT SECTION (CLEAN ROUNDED CARDS)
          // =========================================================
          const Padding(
            padding: EdgeInsets.only(left: 4, bottom: 8),
            child: Text(
              'ACCOUNT & ACTIVITY',
              style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 0.8),
            ),
          ),
          Container(
            clipBehavior: Clip.antiAlias,
            decoration: BoxDecoration(
              color: isDark ? AppColors.darkSurface : Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: isDark ? AppColors.darkBorder : const Color(0xFFE2E8F0)),
            ),
            child: Column(
              children: [
                _buildActionRow(
                  icon: Icons.receipt_long_rounded,
                  iconBg: const Color(0xFFEFF6FF),
                  iconColor: const Color(0xFF2563EB),
                  title: 'My Orders',
                  subtitle: 'View your purchases and order history',
                  badge: '2',
                  onTap: _showOrdersDialog,
                ),
                const Divider(height: 1, indent: 64),
                _buildActionRow(
                  icon: Icons.favorite_rounded,
                  iconBg: const Color(0xFFFFF1F2),
                  iconColor: const Color(0xFFE11D48),
                  title: 'Saved Products',
                  subtitle: 'Products you saved from local shops',
                  badge: '3',
                  onTap: _showSavedProductsDialog,
                ),
                const Divider(height: 1, indent: 64),
                _buildActionRow(
                  icon: Icons.storefront_rounded,
                  iconBg: const Color(0xFFECFDF5),
                  iconColor: const Color(0xFF059669),
                  title: 'My Shops / Followed Shops',
                  subtitle: 'Manage shops you follow',
                  badge: '2',
                  onTap: _showFollowedShopsDialog,
                ),
                const Divider(height: 1, indent: 64),
                _buildActionRow(
                  icon: Icons.location_on_rounded,
                  iconBg: const Color(0xFFFEF3C7),
                  iconColor: const Color(0xFFD97706),
                  title: 'Addresses',
                  subtitle: 'Manage your delivery and saved addresses',
                  onTap: _showAddressesDialog,
                ),
                const Divider(height: 1, indent: 64),
                _buildActionRow(
                  icon: Icons.credit_card_rounded,
                  iconBg: const Color(0xFFEEF2FF),
                  iconColor: const Color(0xFF4F46E5),
                  title: 'Payments',
                  subtitle: 'Manage your payment methods',
                  onTap: _showPaymentsDialog,
                ),
                const Divider(height: 1, indent: 64),
                _buildActionRow(
                  icon: Icons.notifications_rounded,
                  iconBg: const Color(0xFFF3E8FF),
                  iconColor: const Color(0xFF9333EA),
                  title: 'Notifications',
                  subtitle: 'Manage your notification preferences',
                  onTap: _showNotificationsDialog,
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // =========================================================
          // 3. ROLE SECTION (CLEARLY SEPARATED)
          // =========================================================
          const Padding(
            padding: EdgeInsets.only(left: 4, bottom: 8),
            child: Text(
              'ACCOUNT & ROLE',
              style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 0.8),
            ),
          ),
          Container(
            clipBehavior: Clip.antiAlias,
            decoration: BoxDecoration(
              color: isDark ? AppColors.darkSurface : Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: isDark ? AppColors.darkBorder : const Color(0xFFE2E8F0)),
            ),
            child: ListTile(
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              leading: Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(color: const Color(0xFFEFF6FF), borderRadius: BorderRadius.circular(14)),
                child: const Icon(Icons.person_outline_rounded, color: Color(0xFF2563EB)),
              ),
              title: const Row(
                children: [
                  Text('Current Role: ', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                  Text('CUSTOMER', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF2563EB))),
                ],
              ),
              subtitle: const Text('Local shopping, scan & pay, and exit pass generation', style: TextStyle(fontSize: 11)),
              trailing: Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(color: const Color(0xFFECFDF5), borderRadius: BorderRadius.circular(8)),
                child: const Text('ACTIVE', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF059669))),
              ),
            ),
          ),
          const SizedBox(height: 16),

          // =========================================================
          // 4. SUPPORT & INFORMATION
          // =========================================================
          const Padding(
            padding: EdgeInsets.only(left: 4, bottom: 8),
            child: Text(
              'SUPPORT & INFORMATION',
              style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 0.8),
            ),
          ),
          Container(
            clipBehavior: Clip.antiAlias,
            decoration: BoxDecoration(
              color: isDark ? AppColors.darkSurface : Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: isDark ? AppColors.darkBorder : const Color(0xFFE2E8F0)),
            ),
            child: Column(
              children: [
                _buildActionRow(
                  icon: Icons.help_outline_rounded,
                  iconBg: const Color(0xFFE0F2FE),
                  iconColor: const Color(0xFF0284C7),
                  title: 'Help & Support',
                  subtitle: 'FAQ, self-checkout guides, customer care',
                  onTap: () {},
                ),
                const Divider(height: 1, indent: 64),
                _buildActionRow(
                  icon: Icons.info_outline_rounded,
                  iconBg: const Color(0xFFF1F5F9),
                  iconColor: const Color(0xFF475569),
                  title: 'About ShopGenie',
                  subtitle: 'Hyperlocal retail engine · v1.0.0',
                  onTap: () {},
                ),
                const Divider(height: 1, indent: 64),
                _buildActionRow(
                  icon: Icons.lock_outline_rounded,
                  iconBg: const Color(0xFFECFDF5),
                  iconColor: const Color(0xFF059669),
                  title: 'Privacy Policy',
                  subtitle: 'How we protect and manage your data',
                  onTap: () {},
                ),
                const Divider(height: 1, indent: 64),
                _buildActionRow(
                  icon: Icons.description_outlined,
                  iconBg: const Color(0xFFFEF3C7),
                  iconColor: const Color(0xFFD97706),
                  title: 'Terms of Service',
                  subtitle: 'Rules and conditions for shoppers & stores',
                  onTap: () {},
                ),
                const Divider(height: 1, indent: 64),
                _buildActionRow(
                  icon: Icons.delete_outline_rounded,
                  iconBg: const Color(0xFFFFF1F2),
                  iconColor: const Color(0xFFE11D48),
                  title: 'Delete Account',
                  subtitle: 'Permanently remove your account and data',
                  onTap: () {},
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // =========================================================
          // 5. BOTTOM SECTION
          // =========================================================
          OutlinedButton.icon(
            icon: const Icon(Icons.logout, size: 18),
            label: const Text('Sign Out', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
            style: OutlinedButton.styleFrom(
              foregroundColor: Colors.redAccent,
              side: const BorderSide(color: Color(0xFFE2E8F0), width: 1.5),
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
            ),
            onPressed: _showLogoutDialog,
          ),
          const SizedBox(height: 14),

          const Center(
            child: Text(
              'Member since October 2024',
              style: TextStyle(fontSize: 12, color: Colors.grey),
            ),
          ),
          const SizedBox(height: 6),
          const Center(
            child: Text(
              'Thank you for supporting local businesses 💙',
              style: TextStyle(fontSize: 11, color: Colors.grey),
            ),
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  Widget _buildActionRow({
    required IconData icon,
    required Color iconBg,
    required Color iconColor,
    required String title,
    required String subtitle,
    String? badge,
    required VoidCallback onTap,
  }) {
    return ListTile(
      onTap: onTap,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      leading: Container(
        width: 40,
        height: 40,
        decoration: BoxDecoration(
          color: iconBg,
          borderRadius: BorderRadius.circular(14),
        ),
        child: Icon(icon, color: iconColor, size: 20),
      ),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
      subtitle: Text(subtitle, style: const TextStyle(fontSize: 11, color: Colors.grey)),
      trailing: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (badge != null) ...[
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
              decoration: BoxDecoration(
                color: iconBg,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                badge,
                style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: iconColor),
              ),
            ),
            const SizedBox(width: 6),
          ],
          const Icon(Icons.chevron_right_rounded, size: 20, color: Colors.grey),
        ],
      ),
    );
  }
}
