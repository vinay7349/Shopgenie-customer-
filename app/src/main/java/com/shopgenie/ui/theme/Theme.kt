package com.shopgenie.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val GenieTeal = Color(0xFF0F766E)
val GenieTealLight = Color(0xFF14B8A6)
val GenieTealDark = Color(0xFF5EEAD4)
val SparkAmber = Color(0xFFF59E0B)
val SparkAmberLight = Color(0xFFFBBF24)
val AiViolet = Color(0xFF6D5EF5)
val DarkBackground = Color(0xFF0B100F)
val DarkSurface = Color(0xFF141C1A)
val LightBackground = Color(0xFFF8FAFC)
val LightSurface = Color(0xFFFFFFFF)

private val LightColorScheme = lightColorScheme(
    primary = GenieTeal,
    onPrimary = Color.White,
    primaryContainer = Color(0xFFCCFBF1),
    onPrimaryContainer = Color(0xFF115E59),
    secondary = SparkAmber,
    onSecondary = Color(0xFF1E293B),
    secondaryContainer = Color(0xFFFEF3C7),
    onSecondaryContainer = Color(0xFF78350F),
    tertiary = AiViolet,
    background = LightBackground,
    surface = LightSurface,
    onBackground = Color(0xFF0F172A),
    onSurface = Color(0xFF0F172A)
)

private val DarkColorScheme = darkColorScheme(
    primary = GenieTealDark,
    onPrimary = Color(0xFF003833),
    primaryContainer = Color(0xFF005049),
    onPrimaryContainer = Color(0xFFCCFBF1),
    secondary = SparkAmberLight,
    onSecondary = Color(0xFF451A03),
    secondaryContainer = Color(0xFF78350F),
    onSecondaryContainer = Color(0xFFFEF3C7),
    tertiary = Color(0xFFB4ABFF),
    background = DarkBackground,
    surface = DarkSurface,
    onBackground = Color(0xFFF1F5F9),
    onSurface = Color(0xFFF1F5F9)
)

@Composable
fun ShopGenieTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}
