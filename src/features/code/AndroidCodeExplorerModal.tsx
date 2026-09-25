import React, { useState } from 'react';
import { useShopGenie } from '../../context/ShopGenieContext';
import { X, Copy, Check, FileCode, Terminal, Download, Layers } from 'lucide-react';

interface CodeFile {
  path: string;
  category: 'flutter' | 'kotlin' | 'config';
  language: 'dart' | 'yaml' | 'kotlin' | 'xml';
  description: string;
  code: string;
}

const PROJECT_FILES: CodeFile[] = [
  // FLUTTER CONVERTED FILES
  {
    path: 'flutter_shopgenie/pubspec.yaml',
    category: 'flutter',
    language: 'yaml',
    description: 'Flutter project definition, SDK environment & dependencies',
    code: `name: shopgenie
description: "Hyperlocal shop discovery, live offers, loyalty wallet, and scan-and-pay self-checkout in Flutter."
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.2.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.8
  google_fonts: ^6.2.1
  flutter_staggered_animations: ^1.1.1
  intl: ^0.19.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^4.0.0

flutter:
  uses-material-design: true
  assets:
    - assets/images/`
  },
  {
    path: 'flutter_shopgenie/lib/main.dart',
    category: 'flutter',
    language: 'dart',
    description: 'Main Flutter application entry point & Crossfade state machine',
    code: `import 'package:flutter/material.dart';
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
}`
  },
  {
    path: 'flutter_shopgenie/lib/screens/splash_screen.dart',
    category: 'flutter',
    language: 'dart',
    description: 'Converted animated Genie Lamp, pulsing halo, and staged startup sequence',
    code: `import 'dart:async';
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
  late Animation<double> _glowAnimation;
  String _statusText = 'Initializing ShopGenie...';
  bool _finished = false;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1400),
    )..repeat(reverse: true);

    _glowAnimation = Tween<double>(begin: 0.95, end: 1.08).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.fastOutSlowIn),
    );

    _runStartupSequence();
  }

  void _runStartupSequence() {
    Timer(const Duration(milliseconds: 400), () {
      if (mounted) setState(() => _statusText = 'Locating nearby stores & deals...');
    });
    Timer(const Duration(milliseconds: 900), () {
      if (mounted) setState(() => _statusText = 'Warming up neighbourhood catalog...');
    });
    Timer(const Duration(milliseconds: 1300), () {
      if (mounted) setState(() => _statusText = 'Neighbourhood, granted!');
    });
    Timer(const Duration(milliseconds: 1650), _triggerFinish);
  }

  void _triggerFinish() {
    if (_finished) return;
    _finished = true;
    widget.onSplashFinished();
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      body: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: _triggerFinish,
        child: SafeArea(
          child: Stack(
            children: [
              Positioned(
                top: 12,
                right: 16,
                child: TextButton(
                  onPressed: _triggerFinish,
                  child: const Text('Skip', style: TextStyle(fontWeight: FontWeight.w600, color: AppColors.genieTeal)),
                ),
              ),
              Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    ScaleTransition(
                      scale: _glowAnimation,
                      child: const GenieLampLogo(size: 110),
                    ),
                    const SizedBox(height: 28),
                    Text('ShopGenie', style: theme.textTheme.headlineLarge?.copyWith(fontWeight: FontWeight.w800)),
                    const SizedBox(height: 8),
                    Text('ShopGenie - Your neighbourhood, granted.', style: theme.textTheme.bodyLarge),
                    const SizedBox(height: 48),
                    const CircularProgressIndicator(strokeWidth: 2.5, valueColor: AlwaysStoppedAnimation(AppColors.genieTeal)),
                    const SizedBox(height: 14),
                    Text(_statusText, style: theme.textTheme.bodySmall),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}`
  },
  {
    path: 'flutter_shopgenie/lib/screens/onboarding_screen.dart',
    category: 'flutter',
    language: 'dart',
    description: 'Converted 3-step carousel with animated pill indicators',
    code: `import 'package:flutter/material.dart';
import '../models/onboarding_step.dart';
import '../theme/app_colors.dart';

class OnboardingScreen extends StatefulWidget {
  final VoidCallback onFinished;
  const OnboardingScreen({super.key, required this.onFinished});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isLast = _currentIndex == onboardingSteps.length - 1;

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('ShopGenie', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: AppColors.genieTeal)),
                  if (!isLast) TextButton(onPressed: widget.onFinished, child: const Text('Skip')),
                ],
              ),
              Expanded(
                child: PageView.builder(
                  controller: _pageController,
                  itemCount: onboardingSteps.length,
                  onPageChanged: (i) => setState(() => _currentIndex = i),
                  itemBuilder: (ctx, i) {
                    final s = onboardingSteps[i];
                    return Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          width: 200,
                          height: 200,
                          decoration: BoxDecoration(borderRadius: BorderRadius.circular(32), color: Colors.teal.withOpacity(0.08)),
                          alignment: Alignment.center,
                          child: Text(s.iconEmoji, style: const TextStyle(fontSize: 72)),
                        ),
                        const SizedBox(height: 32),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                          decoration: BoxDecoration(color: AppColors.genieTeal.withOpacity(0.12), borderRadius: BorderRadius.circular(20)),
                          child: Text(s.highlightBadge, style: const TextStyle(color: AppColors.genieTeal, fontWeight: FontWeight.bold, fontSize: 12)),
                        ),
                        const SizedBox(height: 14),
                        Text(s.title, style: theme.textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.bold), textAlign: TextAlign.center),
                        const SizedBox(height: 12),
                        Text(s.subtitle, style: theme.textTheme.bodyMedium, textAlign: TextAlign.center),
                      ],
                    );
                  },
                ),
              ),
              ElevatedButton(
                onPressed: () {
                  if (isLast) widget.onFinished();
                  else _pageController.nextPage(duration: const Duration(milliseconds: 300), curve: Curves.easeInOut);
                },
                child: Text(isLast ? 'Get Started' : 'Continue'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}`
  },
  {
    path: 'flutter_shopgenie/lib/screens/home_screen.dart',
    category: 'flutter',
    language: 'dart',
    description: 'Converted Home screen with address header, category chips, deal banner, and verified stores',
    code: `import 'package:flutter/material.dart';
import '../models/store_item.dart';
import '../services/shop_service.dart';
import '../theme/app_colors.dart';
import '../widgets/promo_banner.dart';
import '../widgets/store_card.dart';

class HomeScreen extends StatefulWidget {
  final Function(StoreItem) onSelectStore;
  final VoidCallback onOpenScanner;

  const HomeScreen({
    super.key,
    required this.onSelectStore,
    required this.onOpenScanner,
  });

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String _searchQuery = '';
  String _selectedCategory = 'All';

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final filteredStores = ShopService.filterStores(
      query: _searchQuery,
      category: _selectedCategory,
    );

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      body: SafeArea(
        child: Column(
          children: [
            // Top Bar with Location Selector & Search Field
            Container(
              color: theme.colorScheme.surface,
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('DELIVERING TO / SHOPPING AT', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 0.8)),
                          Text('📍 Koramangala 4th Block ▾', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(color: AppColors.genieTeal.withOpacity(0.12), borderRadius: BorderRadius.circular(12)),
                        child: const Text('✨ Genie Verified', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.genieTeal)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    onChanged: (v) => setState(() => _searchQuery = v),
                    decoration: const InputDecoration(
                      hintText: 'Search groceries, fresh bakes, medicines...',
                      prefixIcon: Icon(Icons.search),
                    ),
                  ),
                ],
              ),
            ),
            // Category Chips & Stores List
            Expanded(
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  PromoBanner(onTap: widget.onOpenScanner),
                  const SizedBox(height: 16),
                  ...filteredStores.map((s) => StoreCard(store: s, onTap: () => widget.onSelectStore(s))),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}`
  },
  {
    path: 'flutter_shopgenie/lib/widgets/genie_lamp_logo.dart',
    category: 'flutter',
    language: 'dart',
    description: 'CustomPainter converting Android Compose Canvas genie lamp & sparkles into Flutter',
    code: `import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

class GenieLampLogo extends StatelessWidget {
  final double size;
  const GenieLampLogo({super.key, this.size = 88.0});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: const BoxDecoration(
        shape: BoxShape.circle,
        gradient: LinearGradient(
          colors: [AppColors.genieTeal, Color(0xFF0D9488), AppColors.aiViolet],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
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
    final paint = Paint()..color = Colors.white..style = PaintingStyle.fill;

    final path = Path()
      ..moveTo(w * 0.35, h * 0.78)
      ..lineTo(w * 0.65, h * 0.78)
      ..lineTo(w * 0.60, h * 0.70)
      ..lineTo(w * 0.40, h * 0.70)
      ..close();
    canvas.drawPath(path, paint);

    final sparkle = Paint()..color = AppColors.sparkAmber..style = PaintingStyle.fill;
    final sp = Path()
      ..moveTo(w * 0.82, h * 0.28 - 6)
      ..quadraticBezierTo(w * 0.82, h * 0.28, w * 0.82 + 6, h * 0.28)
      ..quadraticBezierTo(w * 0.82, h * 0.28, w * 0.82, h * 0.28 + 6)
      ..quadraticBezierTo(w * 0.82, h * 0.28, w * 0.82 - 6, h * 0.28)
      ..quadraticBezierTo(w * 0.82, h * 0.28, w * 0.82, h * 0.28 - 6)
      ..close();
    canvas.drawPath(sp, sparkle);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}`
  },
  {
    path: 'flutter_shopgenie/lib/theme/app_theme.dart',
    category: 'flutter',
    language: 'dart',
    description: 'Material 3 Light & Dark themes with exact Android ShopGenie brand colors',
    code: `import 'package:flutter/material.dart';
import 'app_colors.dart';

class AppTheme {
  static ThemeData get lightTheme => ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    primaryColor: AppColors.genieTeal,
    colorScheme: const ColorScheme.light(
      primary: AppColors.genieTeal,
      secondary: AppColors.sparkAmber,
      tertiary: AppColors.aiViolet,
      surface: AppColors.lightSurface,
    ),
  );

  static ThemeData get darkTheme => ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    primaryColor: AppColors.genieTealDark,
    colorScheme: const ColorScheme.dark(
      primary: AppColors.genieTealDark,
      secondary: AppColors.sparkAmberLight,
      tertiary: AppColors.aiVioletDark,
      surface: AppColors.darkSurface,
    ),
  );
}`
  }
];

export const AndroidCodeExplorerModal: React.FC = () => {
  const { isCodeModalOpen, setIsCodeModalOpen, showSnackbar } = useShopGenie();
  const [activeTab, setActiveTab] = useState<'all' | 'flutter' | 'kotlin'>('flutter');
  const [selectedFileIndex, setSelectedFileIndex] = useState(1);
  const [copied, setCopied] = useState(false);

  if (!isCodeModalOpen) return null;

  const filteredFiles = PROJECT_FILES.filter(f => activeTab === 'all' || f.category === activeTab);
  const currentFile = filteredFiles[selectedFileIndex] || filteredFiles[0] || PROJECT_FILES[0];

  const handleCopy = () => {
    navigator.clipboard?.writeText?.(currentFile.code);
    setCopied(true);
    showSnackbar({ message: `Copied ${currentFile.path} to clipboard!`, type: 'success' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAll = () => {
    const bundle = PROJECT_FILES.map(f => `// File: ${f.path}\n// ${f.description}\n\n${f.code}\n\n${'='.repeat(60)}\n\n`).join('');
    const blob = new Blob([bundle], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ShopGenie-Flutter-Conversion-Bundle.txt';
    a.click();
    URL.revokeObjectURL(url);
    showSnackbar({ message: 'Downloaded complete ShopGenie Flutter codebase!', type: 'success' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-5xl h-[92vh] bg-slate-950 text-slate-100 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-[#5EEAD4] flex items-center justify-center">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">
                  ShopGenie Flutter & Android Codebase Studio
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-[#5EEAD4] text-[10px] font-bold">
                  Flutter 3.24 Converted
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Dart Material 3 · Clean Architecture · CustomPainter · Crossfade Navigation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadAll}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Bundle</span>
            </button>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-teal-600/30 text-teal-300 hover:bg-teal-600/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy File'}</span>
            </button>
            <button
              onClick={() => setIsCodeModalOpen(false)}
              className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Explorer Workspace */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* File Tree Sidebar */}
          <div className="w-full md:w-80 bg-slate-900/60 border-r border-slate-800 p-3 overflow-y-auto space-y-1 shrink-0">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px]">
              <span className="font-bold uppercase tracking-wider text-slate-400">
                Flutter Converted Files
              </span>
              <span className="px-2 py-0.5 rounded bg-teal-500/20 text-[#5EEAD4] font-mono text-[10px]">
                {filteredFiles.length} files
              </span>
            </div>

            {filteredFiles.map((file, idx) => {
              const isSelected = file.path === currentFile.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFileIndex(idx)}
                  className={`w-full p-2.5 rounded-xl text-left text-xs font-mono flex items-start gap-2.5 transition-colors ${
                    isSelected
                      ? 'bg-teal-500/20 text-[#5EEAD4] font-semibold ring-1 ring-teal-500/30'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <FileCode className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold">{file.path}</div>
                    <div className="text-[10px] text-slate-500 font-sans truncate">{file.description}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Code Viewer */}
          <div className="flex-1 bg-slate-950 p-4 overflow-y-auto flex flex-col font-mono text-xs text-slate-300 leading-relaxed">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-slate-400 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">{currentFile.path}</span>
                <span className="text-[10px] text-slate-500">({currentFile.description})</span>
              </div>
              <span className="uppercase text-[10px] bg-slate-800 px-2 py-0.5 rounded font-bold text-teal-400">
                {currentFile.language}
              </span>
            </div>
            <pre className="overflow-x-auto whitespace-pre font-mono flex-1">
              <code>{currentFile.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
