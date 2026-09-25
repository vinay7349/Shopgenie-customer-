import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

class PromoBanner extends StatelessWidget {
  final VoidCallback? onTap;

  const PromoBanner({super.key, this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: double.infinity,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(18),
          gradient: const LinearGradient(
            colors: [
              AppColors.genieTeal,
              Color(0xFF0D9488),
              AppColors.aiViolet,
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          boxShadow: [
            BoxShadow(
              color: AppColors.genieTeal.withOpacity(0.25),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        padding: const EdgeInsets.all(18),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.18),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: const Text(
                    '⚡ NEIGHBOURHOOD DEALS',
                    style: TextStyle(
                      color: AppColors.sparkAmber,
                      fontWeight: FontWeight.w900,
                      fontSize: 11,
                      letterSpacing: 1.0,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            const Text(
              'Scan & Skip Queues in 12+ Stores',
              style: TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 3),
            Text(
              'Grab items, scan barcodes on phone, pay & walk out!',
              style: TextStyle(
                color: Colors.white.withOpacity(0.88),
                fontSize: 12,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
