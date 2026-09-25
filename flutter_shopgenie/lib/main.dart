import 'package:flutter/material.dart';
import 'screens/main_navigation_screen.dart';
import 'screens/onboarding_screen.dart';
import 'screens/splash_screen.dart';
import 'theme/app_theme.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const ShopGenieApp());
}

enum AppFlowState {
  splash,
  onboarding,
  main,
}

class ShopGenieApp extends StatefulWidget {
  const ShopGenieApp({super.key});

  @override
  State<ShopGenieApp> createState() => _ShopGenieAppState();
}

class _ShopGenieAppState extends State<ShopGenieApp> {
  AppFlowState _flowState = AppFlowState.splash;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ShopGenie',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.system,
      home: AnimatedSwitcher(
        duration: const Duration(milliseconds: 350),
        switchInCurve: Curves.easeIn,
        switchOutCurve: Curves.easeOut,
        child: _buildCurrentScreen(),
      ),
    );
  }

  Widget _buildCurrentScreen() {
    switch (_flowState) {
      case AppFlowState.splash:
        return SplashScreen(
          key: const ValueKey('splash_screen'),
          onSplashFinished: () {
            setState(() {
              _flowState = AppFlowState.onboarding;
            });
          },
        );
      case AppFlowState.onboarding:
        return OnboardingScreen(
          key: const ValueKey('onboarding_screen'),
          onFinished: () {
            setState(() {
              _flowState = AppFlowState.main;
            });
          },
        );
      case AppFlowState.main:
        return const MainNavigationScreen(
          key: ValueKey('main_navigation_screen'),
        );
    }
  }
}
