import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'screens/main_navigation_screen.dart';
import 'screens/onboarding_screen.dart';
import 'screens/splash_screen.dart';
import 'screens/login_screen.dart';
import 'screens/register_screen.dart';
import 'theme/app_theme.dart';
import 'providers/auth_provider.dart';
import 'services/auth_api_service.dart';
import 'services/token_storage.dart';

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

  // Initialize auth services
  final tokenStorage = TokenStorage();
  final authApiService = AuthApiService();
  final authProvider = AuthProvider(
    apiService: authApiService,
    tokenStorage: tokenStorage,
  );

  // Initialize auth state
  await authProvider.initialize();

  runApp(
    MultiProvider(
      providers: [ChangeNotifierProvider.value(value: authProvider)],
      child: ShopGenieApp(
        initialThemeMode: initialThemeMode,
        authApiService: authApiService,
        tokenStorage: tokenStorage,
      ),
    ),
  );
}

enum AppFlowState { splash, onboarding, login, register, main }

class ShopGenieApp extends StatefulWidget {
  final ThemeMode initialThemeMode;
  final AuthApiService authApiService;
  final TokenStorage tokenStorage;

  const ShopGenieApp({
    super.key,
    required this.initialThemeMode,
    required this.authApiService,
    required this.tokenStorage,
  });

  @override
  State<ShopGenieApp> createState() => _ShopGenieAppState();
}

class _ShopGenieAppState extends State<ShopGenieApp> {
  AppFlowState _flowState = AppFlowState.splash;
  late ThemeMode _themeMode;
  RegisterMode? _registerMode;

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

  void _onLoginSuccess() {
    setState(() {
      _flowState = AppFlowState.main;
    });
  }

  void _onRegisterSuccess() {
    setState(() {
      _flowState = AppFlowState.main;
    });
  }

  void _enterDashboard() {
    setState(() {
      _flowState = AppFlowState.main;
    });
  }

  void _goToLogin() {
    setState(() {
      _flowState = AppFlowState.login;
    });
  }

  void _goToRegister(RegisterMode mode) {
    setState(() {
      _registerMode = mode;
      _flowState = AppFlowState.register;
    });
  }

  void _goToOnboarding() {
    setState(() {
      _flowState = AppFlowState.onboarding;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ShopGenie',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: _themeMode,
      home: PopScope(
        canPop: _flowState != AppFlowState.login &&
            _flowState != AppFlowState.register,
        onPopInvokedWithResult: (didPop, result) {
          if (didPop) return;
          if (_flowState == AppFlowState.register) {
            _goToLogin();
          } else if (_flowState == AppFlowState.login) {
            _enterDashboard();
          }
        },
        child: AnimatedSwitcher(
          duration: const Duration(milliseconds: 350),
          switchInCurve: Curves.easeIn,
          switchOutCurve: Curves.easeOut,
          child: _buildCurrentScreen(),
        ),
      ),
    );
  }

  Widget _buildCurrentScreen() {
    switch (_flowState) {
      case AppFlowState.splash:
        return SplashScreen(
          key: const ValueKey('splash_screen'),
          onSplashFinished: () {
            // Let signed-out users browse the dashboard without requiring an account.
            final authProvider = context.read<AuthProvider>();
            if (authProvider.isAuthenticated) {
              _onLoginSuccess();
            } else {
              _goToOnboarding();
            }
          },
        );
      case AppFlowState.onboarding:
        return OnboardingScreen(
          key: const ValueKey('onboarding_screen'),
          onFinished: _enterDashboard,
        );
      case AppFlowState.login:
        return LoginScreen(
          key: const ValueKey('login_screen'),
          onLoginSuccess: _onLoginSuccess,
          onGoToRegister: () => _goToRegister(RegisterMode.customer),
          onContinueAsGuest: _enterDashboard,
        );
      case AppFlowState.register:
        return RegisterScreen(
          key: ValueKey('register_screen_$_registerMode'),
          mode: _registerMode ?? RegisterMode.customer,
          onRegisterSuccess: _onRegisterSuccess,
          onGoToLogin: _goToLogin,
        );
      case AppFlowState.main:
        return MainNavigationScreen(
          key: const ValueKey('main_navigation_screen'),
          themeMode: _themeMode,
          onThemeModeChanged: _setThemeMode,
          onLogin: _goToLogin,
          onRegister: () => _goToRegister(RegisterMode.customer),
          onLogout: _enterDashboard,
        );
    }
  }
}
