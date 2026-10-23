import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shopgenie/main.dart';

void main() {
  testWidgets('ShopGenieApp initializes and renders successfully', (WidgetTester tester) async {
    await tester.pumpWidget(const ShopGenieApp(initialThemeMode: ThemeMode.light));
    await tester.pump();
    expect(find.byType(ShopGenieApp), findsOneWidget);
  });
}
