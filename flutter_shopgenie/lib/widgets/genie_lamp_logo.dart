import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

class GenieLampLogo extends StatelessWidget {
  final double size;
  final bool animateGlow;

  const GenieLampLogo({
    super.key,
    this.size = 88.0,
    this.animateGlow = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
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
            color: AppColors.genieTeal.withOpacity(0.35),
            blurRadius: size * 0.25,
            spreadRadius: 2,
          ),
        ],
      ),
      child: Center(
        child: CustomPaint(
          size: Size(size * 0.55, size * 0.55),
          painter: _GenieLampPainter(),
        ),
      ),
    );
  }
}

class _GenieLampPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    final lampPaint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.fill;

    // Draw magical Genie Lamp Silhouette
    final lampPath = Path();

    // Base of the lamp
    lampPath.moveTo(w * 0.35, h * 0.78);
    lampPath.lineTo(w * 0.65, h * 0.78);
    lampPath.lineTo(w * 0.60, h * 0.70);
    lampPath.lineTo(w * 0.40, h * 0.70);
    lampPath.close();

    // Body of the lamp
    lampPath.moveTo(w * 0.25, h * 0.55);
    lampPath.quadraticBezierTo(w * 0.15, h * 0.68, w * 0.40, h * 0.70);
    lampPath.lineTo(w * 0.60, h * 0.70);
    lampPath.quadraticBezierTo(w * 0.82, h * 0.65, w * 0.85, h * 0.48);
    lampPath.quadraticBezierTo(w * 0.85, h * 0.40, w * 0.78, h * 0.42);
    lampPath.quadraticBezierTo(w * 0.68, h * 0.50, w * 0.52, h * 0.50);
    lampPath.lineTo(w * 0.38, h * 0.46);
    lampPath.quadraticBezierTo(w * 0.25, h * 0.45, w * 0.25, h * 0.55);
    lampPath.close();

    // Handle
    lampPath.moveTo(w * 0.25, h * 0.50);
    lampPath.quadraticBezierTo(w * 0.10, h * 0.48, w * 0.12, h * 0.60);
    lampPath.quadraticBezierTo(w * 0.14, h * 0.68, w * 0.28, h * 0.65);

    canvas.drawPath(lampPath, lampPaint);

    // Sparkle 1 (Large gold sparkle above spout)
    final sparklePaint1 = Paint()
      ..color = AppColors.sparkAmber
      ..style = PaintingStyle.fill;

    final sp1 = Path();
    final c1x = w * 0.82;
    final c1y = h * 0.28;
    const r1 = 6.0;

    sp1.moveTo(c1x, c1y - r1);
    sp1.quadraticBezierTo(c1x, c1y, c1x + r1, c1y);
    sp1.quadraticBezierTo(c1x, c1y, c1x, c1y + r1);
    sp1.quadraticBezierTo(c1x, c1y, c1x - r1, c1y);
    sp1.quadraticBezierTo(c1x, c1y, c1x, c1y - r1);
    sp1.close();
    canvas.drawPath(sp1, sparklePaint1);

    // Sparkle 2 (Minor sparkle)
    final sparklePaint2 = Paint()
      ..color = AppColors.sparkAmber.withOpacity(0.9)
      ..style = PaintingStyle.fill;

    final sp2 = Path();
    final c2x = w * 0.62;
    final c2y = h * 0.22;
    const r2 = 3.5;

    sp2.moveTo(c2x, c2y - r2);
    sp2.quadraticBezierTo(c2x, c2y, c2x + r2, c2y);
    sp2.quadraticBezierTo(c2x, c2y, c2x, c2y + r2);
    sp2.quadraticBezierTo(c2x, c2y, c2x - r2, c2y);
    sp2.quadraticBezierTo(c2x, c2y, c2x, c2y - r2);
    sp2.close();
    canvas.drawPath(sp2, sparklePaint2);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
