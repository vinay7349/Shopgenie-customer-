package com.shopgenie

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.Crossfade
import androidx.compose.animation.core.tween
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.shopgenie.ui.home.HomeScreen
import com.shopgenie.ui.onboarding.OnboardingScreen
import com.shopgenie.ui.splash.SplashScreen
import com.shopgenie.ui.theme.ShopGenieTheme

enum class AppScreen {
    SPLASH,
    ONBOARDING,
    HOME
}

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        // Enable edge-to-edge display so content extends smoothly behind system bars
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)

        setContent {
            ShopGenieTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    ShopGenieAppNavigation()
                }
            }
        }
    }
}

@Composable
fun ShopGenieAppNavigation() {
    var currentScreen by rememberSaveable { mutableStateOf(AppScreen.SPLASH) }

    Crossfade(
        targetState = currentScreen,
        animationSpec = tween(durationMillis = 350),
        label = "screen_transition"
    ) { screen ->
        when (screen) {
            AppScreen.SPLASH -> {
                SplashScreen(
                    onSplashFinished = {
                        currentScreen = AppScreen.ONBOARDING
                    }
                )
            }
            AppScreen.ONBOARDING -> {
                OnboardingScreen(
                    onFinished = {
                        currentScreen = AppScreen.HOME
                    }
                )
            }
            AppScreen.HOME -> {
                HomeScreen()
            }
        }
    }
}
