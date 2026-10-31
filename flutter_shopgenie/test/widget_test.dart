import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shopgenie/main.dart';
import 'package:shopgenie/services/auth_api_service.dart';
import 'package:shopgenie/services/token_storage.dart';
import 'package:http/http.dart' as http;

void main() {
  testWidgets('ShopGenieApp initializes and renders successfully', (WidgetTester tester) async {
    final authApiService = AuthApiService(client: http.Client());
    final tokenStorage = TokenStorage();

    await tester.pumpWidget(
      ShopGenieApp(
        initialThemeMode: ThemeMode.light,
        authApiService: authApiService,
        tokenStorage: tokenStorage,
      ),
    );
    await tester.pump();
    expect(find.byType(ShopGenieApp), findsOneWidget);

    authApiService.close();
  });
}