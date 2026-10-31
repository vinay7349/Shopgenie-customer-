import 'package:flutter/material.dart';

import '../models/offer_item.dart';
import '../theme/app_colors.dart';

class LiveOfferBanner extends StatelessWidget {
  final OfferItem? offer;
  final bool isLoading;
  final bool hasError;
  final VoidCallback onRetry;
  final VoidCallback onTap;

  const LiveOfferBanner({
    super.key,
    required this.offer,
    required this.isLoading,
    required this.hasError,
    required this.onRetry,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final title = offer?.title ??
        (isLoading
            ? 'Loading shop offers'
            : hasError
                ? 'Offers unavailable'
                : 'No active shop offers');
    final description = offer?.description ??
        (isLoading
            ? 'Getting the latest offers from local shops.'
            : hasError
                ? 'Could not load offers from the backend.'
                : 'Current offers published by shop owners will appear here.');

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkSurface : Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(
                Icons.local_offer_outlined,
                color: AppColors.offerEmerald,
              ),
              const SizedBox(width: 8),
              const Expanded(
                child: Text(
                  'LIVE SHOP OFFERS',
                  style: TextStyle(
                    color: AppColors.offerEmerald,
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 0.7,
                  ),
                ),
              ),
              if (offer != null)
                Text(
                  offer!.discount,
                  style: const TextStyle(
                    color: AppColors.offerEmerald,
                    fontWeight: FontWeight.bold,
                  ),
                ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            title,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),
          const SizedBox(height: 4),
          Text(
            description,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: Theme.of(context).textTheme.bodySmall,
          ),
          if (offer?.storeName.isNotEmpty ?? false) ...[
            const SizedBox(height: 6),
            Text(
              offer!.storeName,
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: AppColors.genieTeal,
              ),
            ),
          ],
          const SizedBox(height: 10),
          Row(
            children: [
              TextButton(
                onPressed: onTap,
                child: const Text('View all offers'),
              ),
              if (hasError)
                TextButton.icon(
                  onPressed: onRetry,
                  icon: const Icon(Icons.refresh_rounded, size: 16),
                  label: const Text('Retry'),
                ),
            ],
          ),
        ],
      ),
    );
  }
}
