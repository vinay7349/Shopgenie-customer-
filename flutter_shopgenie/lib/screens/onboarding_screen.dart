import 'package:flutter/material.dart';
import '../models/onboarding_step.dart';
import '../theme/app_colors.dart';

class OnboardingScreen extends StatefulWidget {
  final VoidCallback onFinished;

  const OnboardingScreen({
    super.key,
    required this.onFinished,
  });

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentIndex = 0;

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _onNext() {
    if (_currentIndex == onboardingSteps.length - 1) {
      widget.onFinished();
    } else {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 350),
        curve: Curves.easeInOut,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isLast = _currentIndex == onboardingSteps.length - 1;

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          child: Column(
            children: [
              // Top Bar
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'ShopGenie',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 18,
                      color: AppColors.genieTeal,
                    ),
                  ),
                  if (!isLast)
                    TextButton(
                      onPressed: widget.onFinished,
                      child: Text(
                        'Skip',
                        style: TextStyle(
                          color: theme.colorScheme.onSurface.withOpacity(0.6),
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    )
                  else
                    const SizedBox(width: 48),
                ],
              ),

              // Page Carousel
              Expanded(
                child: PageView.builder(
                  controller: _pageController,
                  itemCount: onboardingSteps.length,
                  onPageChanged: (index) {
                    setState(() {
                      _currentIndex = index;
                    });
                  },
                  itemBuilder: (context, index) {
                    final step = onboardingSteps[index];
                    return Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        // Illustration Container Card
                        Container(
                          width: 200,
                          height: 200,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(32),
                            color: theme.colorScheme.surfaceContainerHighest.withOpacity(0.6),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.04),
                                blurRadius: 10,
                                offset: const Offset(0, 4),
                              ),
                            ],
                          ),
                          child: Container(
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(32),
                              gradient: RadialGradient(
                                colors: [
                                  AppColors.genieTeal.withOpacity(0.15),
                                  AppColors.sparkAmber.withOpacity(0.08),
                                  Colors.transparent,
                                ],
                              ),
                            ),
                            alignment: Alignment.center,
                            child: Text(
                              step.iconEmoji,
                              style: const TextStyle(fontSize: 72),
                            ),
                          ),
                        ),

                        const SizedBox(height: 32),

                        // Highlight Badge
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                          decoration: BoxDecoration(
                            color: AppColors.genieTeal.withOpacity(0.12),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            step.highlightBadge,
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              color: AppColors.genieTeal,
                              fontSize: 12,
                            ),
                          ),
                        ),

                        const SizedBox(height: 14),

                        // Title
                        Text(
                          step.title,
                          style: theme.textTheme.headlineMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                            fontSize: 24,
                            color: theme.colorScheme.onSurface,
                          ),
                          textAlign: TextAlign.center,
                        ),

                        const SizedBox(height: 12),

                        // Subtitle
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          child: Text(
                            step.subtitle,
                            style: theme.textTheme.bodyMedium?.copyWith(
                              fontSize: 15,
                              height: 1.45,
                              color: theme.colorScheme.onSurface.withOpacity(0.7),
                            ),
                            textAlign: TextAlign.center,
                          ),
                        ),
                      ],
                    );
                  },
                ),
              ),

              // Bottom Indicators & Action Button
              Column(
                children: [
                  // Dot Indicators
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(
                      onboardingSteps.length,
                      (index) {
                        final isCurrent = index == _currentIndex;
                        return AnimatedContainer(
                          duration: const Duration(milliseconds: 250),
                          margin: const EdgeInsets.symmetric(horizontal: 4),
                          height: 8,
                          width: isCurrent ? 24 : 8,
                          decoration: BoxDecoration(
                            color: isCurrent
                                ? AppColors.genieTeal
                                : theme.colorScheme.onSurface.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(4),
                          ),
                        );
                      },
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Button
                  SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: ElevatedButton(
                      onPressed: _onNext,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.genieTeal,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                        elevation: 0,
                      ),
                      child: Text(
                        isLast ? 'Get Started' : 'Continue',
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
