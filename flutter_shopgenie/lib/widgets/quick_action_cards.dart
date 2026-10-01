import 'package:flutter/material.dart';

class QuickActionCards extends StatelessWidget {
  final VoidCallback onFeedTap;
  final VoidCallback onOffersTap;
  final VoidCallback onFollowingTap;
  final VoidCallback onScanTap;

  const QuickActionCards({
    super.key,
    required this.onFeedTap,
    required this.onOffersTap,
    required this.onFollowingTap,
    required this.onScanTap,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
      child: Row(
        children: [
          // 1. Feed Card
          Expanded(
            child: _buildActionCard(
              isDark: isDark,
              label: 'Feed',
              icon: Icons.article_outlined,
              iconColor: const Color(0xFF2563EB),
              iconBgColor: const Color(0xFFEFF6FF),
              onTap: onFeedTap,
            ),
          ),
          const SizedBox(width: 10),

          // 2. Offers Card
          Expanded(
            child: _buildActionCard(
              isDark: isDark,
              label: 'Offers',
              icon: Icons.local_offer_outlined,
              iconColor: const Color(0xFF059669),
              iconBgColor: const Color(0xFFECFDF5),
              onTap: onOffersTap,
            ),
          ),
          const SizedBox(width: 10),

          // 3. Following Card
          Expanded(
            child: _buildActionCard(
              isDark: isDark,
              label: 'Following',
              icon: Icons.favorite_rounded,
              iconColor: const Color(0xFFF43F5E),
              iconBgColor: const Color(0xFFFFF1F2),
              onTap: onFollowingTap,
            ),
          ),
          const SizedBox(width: 10),

          // 4. Scan Card
          Expanded(
            child: _buildActionCard(
              isDark: isDark,
              label: 'Scan',
              icon: Icons.qr_code_scanner_rounded,
              iconColor: const Color(0xFF4F46E5),
              iconBgColor: const Color(0xFFEEF2FF),
              onTap: onScanTap,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionCard({
    required bool isDark,
    required String label,
    required IconData icon,
    required Color iconColor,
    required Color iconBgColor,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(18),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: isDark ? const Color(0xFF1E293B) : Colors.white,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(
            color: isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0),
            width: 1,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.03),
              blurRadius: 6,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: isDark ? iconColor.withValues(alpha: 0.18) : iconBgColor,
                borderRadius: BorderRadius.circular(14),
              ),
              child: Center(
                child: Icon(
                  icon,
                  size: 22,
                  color: iconColor,
                ),
              ),
            ),
            const SizedBox(height: 7),
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: isDark ? const Color(0xFFF1F5F9) : const Color(0xFF334155),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
