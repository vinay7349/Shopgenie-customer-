import 'package:flutter/material.dart';

/// ShopGenie Brand Palette - Deep Green Primary with Mint Accents
class AppColors {
  AppColors._();

  // Primary Deep Green Tones (matching Owner app)
  static const Color primaryGreen = Color(0xFF0D6E3E);
  static const Color primaryGreenLight = Color(0xFF1A8C4E);
  static const Color primaryGreenDark = Color(0xFF0A5430);
  static const Color primaryGreenContainer = Color(0xFFD4EDDA);
  static const Color primaryGreenContainerDark = Color(0xFF1E4A2B);

  // Secondary Mint Accents (matching Owner app)
  static const Color mintAccent = Color(0xFF10B981);
  static const Color mintAccentLight = Color(0xFF34D399);
  static const Color mintAccentContainer = Color(0xFFD1FAE5);
  static const Color mintAccentContainerDark = Color(0xFF064E3B);

  // Amber for Offers/Highlights (matching Owner app)
  static const Color amberWarning = Color(0xFFF59E0B);
  static const Color amberLight = Color(0xFFFEF3C7);
  static const Color amberWarningDark = Color(0xFFB45309);

  // Error Red (matching Owner app)
  static const Color errorRed = Color(0xFFDC2626);
  static const Color errorLight = Color(0xFFFEF2F2);

  // Success Green (matching Owner app)
  static const Color successGreen = Color(0xFF16A34A);
  static const Color successLight = Color(0xFFDCFCE7);

  // Feed Blue (for Local Feed tab)
  static const Color feedBlue = Color(0xFF2563EB);
  static const Color feedBlueBg = Color(0xFFEFF6FF);
  static const Color feedBlueBorder = Color(0xFFBFDBFE);

  // Offer Emerald (for Flash Offers tab)
  static const Color offerEmerald = Color(0xFF059669);
  static const Color offerEmeraldBg = Color(0xFFECFDF5);
  static const Color offerEmeraldBorder = Color(0xFFA7F3D0);

  // Following Rose (for Following tab)
  static const Color followingRose = Color(0xFFE11D48);
  static const Color followingRoseBg = Color(0xFFFFF1F2);
  static const Color followingRoseBorder = Color(0xFFFECDD3);

  // Scan Indigo (for AI Scan)
  static const Color scanIndigo = Color(0xFF4F46E5);
  static const Color scanIndigoBg = Color(0xFFEEF2FF);
  static const Color scanIndigoBorder = Color(0xFFC7D2FE);

  // AI Violet (for AI features)
  static const Color aiViolet = Color(0xFF7C3AED);
  static const Color aiVioletDark = Color(0xFFA78BFA);

  // Neutrals - Light Mode
  static const Color lightBackground = Color(0xFFF8FAFC);
  static const Color lightSurface = Color(0xFFFFFFFF);
  static const Color lightSurfaceVariant = Color(0xFFF1F5F9);
  static const Color lightTextPrimary = Color(0xFF0F172A);
  static const Color lightTextSecondary = Color(0xFF64748B);
  static const Color lightBorder = Color(0xFFE2E8F0);

  // Neutrals - Dark Mode
  static const Color darkBackground = Color(0xFF0B100F);
  static const Color darkSurface = Color(0xFF141C1A);
  static const Color darkSurfaceVariant = Color(0xFF1E2825);
  static const Color darkTextPrimary = Color(0xFFF1F5F9);
  static const Color darkTextSecondary = Color(0xFF94A3B8);
  static const Color darkBorder = Color(0xFF2E3835);

  // Convenience aliases for Owner app compatibility
  static const Color genieTeal = primaryGreen;
  static const Color genieTealLight = primaryGreenLight;
  static const Color genieTealDark = primaryGreenDark;
  static const Color genieTealContainerLight = primaryGreenContainer;
  static const Color genieTealContainerDark = primaryGreenContainerDark;
  static const Color paleMint = mintAccentContainer;
  static const Color charcoal = lightTextPrimary;
  static const Color textSecondary = lightTextSecondary;
  static const Color sparkAmber = amberWarning; // Backward compatibility
}
