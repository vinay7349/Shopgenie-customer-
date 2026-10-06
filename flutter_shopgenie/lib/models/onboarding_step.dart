class OnboardingStep {
  final String title;
  final String subtitle;
  final String highlightBadge;
  final String iconEmoji;

  const OnboardingStep({
    required this.title,
    required this.subtitle,
    required this.highlightBadge,
    required this.iconEmoji,
  });
}

const List<OnboardingStep> onboardingSteps = [
  OnboardingStep(
    title: 'Discover Local Stores',
    subtitle:
        'Connect directly with trusted neighbourhood grocers, bakeries, pharmacies, and specialty shops near you.',
    highlightBadge: 'Hyperlocal Network',
    iconEmoji: '🏪',
  ),
  OnboardingStep(
    title: 'AI Product Scan',
    subtitle:
        'Point your camera at a product and let AI identify it instantly. Keep track of discovered items in your Smart Bag.',
    highlightBadge: 'AI Vision Powered',
    iconEmoji: '✨',
  ),
  OnboardingStep(
    title: 'Genie Community Perks',
    subtitle:
        'Unlock neighborhood flash deals, exclusive local promotions, and earn loyalty coins on every purchase.',
    highlightBadge: 'Rewarding Neighbours',
    iconEmoji: '✨',
  ),
];
