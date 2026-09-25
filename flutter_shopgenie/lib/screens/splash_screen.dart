import 'dart:async';
import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../widgets/genie_lamp_logo.dart';

class SplashScreen extends StatefulWidget {
  final VoidCallback onSplashFinished;

  const SplashScreen({
    super.key,
    required this.onSplashFinished,
  });

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _pulseController;
  late Animation<double> _scaleAnimation;
  late Animation<double> _glowAnimation;
  late Animation<double> _fadeAnimation;

  String _statusText = 'Initializing ShopGenie...';
  Timer? _sequenceTimer1;
  Timer? _sequenceTimer2;
  Timer? _sequenceTimer3;
  Timer? _finishTimer;
  bool _finished = false;

  @override
  void initState() {
    super.initState();

    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1400),
    )..repeat(reverse: true);

    _scaleAnimation = Tween<double>(begin: 0.7, end: 1.0).animate(
      CurvedAnimation(
        parent: _pulseController,
        curve: const Interval(0.0, 0.4, curve: Curves.easeOutCubic),
      ),
    );

    _glowAnimation = Tween<double>(begin: 0.95, end: 1.08).animate(
      CurvedAnimation(
        parent: _pulseController,
        curve: Curves.fastOutSlowIn,
      ),
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _pulseController,
        curve: const Interval(0.0, 0.5, curve: Curves.easeIn),
      ),
    );

    _runStartupSequence();
  }

  void _runStartupSequence() {
    _sequenceTimer1 = Timer(const Duration(milliseconds: 400), () {
      if (mounted) {
        setState(() {
          _statusText = 'Locating nearby stores & deals...';
        });
      }
    });

    _sequenceTimer2 = Timer(const Duration(milliseconds: 900), () {
      if (mounted) {
        setState(() {
          _statusText = 'Warming up neighbourhood catalog...';
        });
      }
    });

    _sequenceTimer3 = Timer(const Duration(milliseconds: 1300), () {
      if (mounted) {
        setState(() {
          _statusText = 'Neighbourhood, granted!';
        });
      }
    });

    _finishTimer = Timer(const Duration(milliseconds: 1650), () {
      _triggerFinish();
    });
  }

  void _triggerFinish() {
    if (_finished) return;
    _finished = true;
    _sequenceTimer1?.cancel();
    _sequenceTimer2?.cancel();
    _sequenceTimer3?.cancel();
    _finishTimer?.cancel();
    widget.onSplashFinished();
  }

  @override
  void dispose() {
    _pulseController.dispose();
    _sequenceTimer1?.cancel();
    _sequenceTimer2?.cancel();
    _sequenceTimer3?.cancel();
    _finishTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      body: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: _triggerFinish,
        child: SafeArea(
          child: Stack(
            children: [
              // Radial Ambient Background Glow
              Positioned.fill(
                child: CustomPaint(
                  painter: _RadialGlowPainter(
                    color: isDark
                        ? AppColors.genieTeal.withOpacity(0.18)
                        : AppColors.genieTeal.withOpacity(0.08),
                  ),
                ),
              ),

              // Top Skip Button
              Positioned(
                top: 12,
                right: 16,
                child: TextButton(
                  onPressed: _triggerFinish,
                  style: TextButton.styleFrom(
                    foregroundColor: AppColors.genieTeal,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: const Text(
                    'Skip',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),

              // Central Brand Identity & Animation
              Center(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 32),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      // Animated Logo Badge
                      AnimatedBuilder(
                        animation: _pulseController,
                        builder: (context, child) {
                          return Transform.scale(
                            scale: _glowAnimation.value,
                            child: const GenieLampLogo(size: 110),
                          );
                        },
                      ),

                      const SizedBox(height: 28),

                      // Brand Name
                      Text(
                        'ShopGenie',
                        style: theme.textTheme.headlineLarge?.copyWith(
                          fontWeight: FontWeight.w800,
                          fontSize: 34,
                          letterSpacing: -0.5,
                          color: theme.colorScheme.onSurface,
                        ),
                      ),

                      const SizedBox(height: 8),

                      // Brand Tagline
                      Text(
                        'ShopGenie - Your neighbourhood, granted.',
                        style: theme.textTheme.bodyLarge?.copyWith(
                          fontSize: 15,
                          fontWeight: FontWeight.w500,
                          color: theme.colorScheme.onSurface.withOpacity(0.72),
                        ),
                        textAlign: TextAlign.Center,
                      ),

                      const SizedBox(height: 48),

                      // Loading Progress Indicator & Status Text
                      const SizedBox(
                        width: 26,
                        height: 26,
                        child: CircularProgressIndicator(
                          strokeWidth: 2.5,
                          valueColor: AlwaysStoppedAnimation<Color>(
                            AppColors.genieTeal,
                          ),
                        ),
                      ),

                      const SizedBox(height: 14),

                      AnimatedSwitcher(
                        duration: const Duration(milliseconds: 250),
                        child: Text(
                          _statusText,
                          key: ValueKey(_statusText),
                          style: theme.textTheme.bodySmall?.copyWith(
                            fontSize: 12,
                            color: theme.colorScheme.onSurface.withOpacity(0.55),
                          ),
                          textAlign: TextAlign.Center,
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              // Bottom Footnote
              Positioned(
                bottom: 24,
                left: 0,
                right: 0,
                child: Text(
                  'Hyperlocal Commerce & Express Checkout',
                  textAlign: TextAlign.Center,
                  style: theme.textTheme.labelSmall?.copyWith(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: theme.colorScheme.onSurface.withOpacity(0.45),
                    letterSpacing: 0.3,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _RadialGlowPainter extends CustomPainter {
  final Color color;

  _RadialGlowPainter({required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height * 0.42);
    final paint = Paint()
      ..shader = RadialGradient(
        colors: [
          color,
          AppColors.aiViolet.withOpacity(0.04),
          Colors.transparent,
        ],
      ).createShader(Rect.fromCircle(center: center, radius: size.width * 0.75));

    canvas.drawCircle(center, size.width * 0.75, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
