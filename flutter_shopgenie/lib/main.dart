import 'package:flutter/material.dart';
import 'screens/main_navigation_screen.dart';
import 'screens/onboarding_screen.dart';
import 'screens/splash_screen.dart';
import 'theme/app_theme.dart';
import 'package:shared_preferences/shared_preferences.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final preferences = SharedPreferencesAsync();
  var initialThemeMode = ThemeMode.system;
  try {
    final savedMode = await preferences.getString('theme_mode');
    initialThemeMode = ThemeMode.values.firstWhere(
      (mode) => mode.name == savedMode,
      orElse: () => ThemeMode.system,
    );
  } catch (_) {
    // Keep the app usable with the system theme if preferences are unavailable.
  }
  runApp(ShopGenieApp(initialThemeMode: initialThemeMode));
}

enum AppFlowState {
  splash,
  onboarding,
  main,
}

class ShopGenieApp extends StatefulWidget {
  final ThemeMode initialThemeMode;

  const ShopGenieApp({super.key, required this.initialThemeMode});

  @override
  State<ShopGenieApp> createState() => _ShopGenieAppState();
}

class _ShopGenieAppState extends State<ShopGenieApp> {
  AppFlowState _flowState = AppFlowState.splash;
  late ThemeMode _themeMode;

  @override
  void initState() {
    super.initState();
    _themeMode = widget.initialThemeMode;
  }

  Future<void> _setThemeMode(ThemeMode mode) async {
    setState(() => _themeMode = mode);
    try {
      await SharedPreferencesAsync().setString('theme_mode', mode.name);
    } catch (_) {
      // The selected mode still applies for this session if saving fails.
    }
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ShopGenie',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: _themeMode,
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
        return MainNavigationScreen(
          key: const ValueKey('main_navigation_screen'),
          themeMode: _themeMode,
          onThemeModeChanged: _setThemeMode,
        );
    }
  }
}
