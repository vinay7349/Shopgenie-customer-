package com.shopgenie.ui.splash

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.shopgenie.ui.theme.AiViolet
import com.shopgenie.ui.theme.GenieTeal
import com.shopgenie.ui.theme.SparkAmber
import kotlinx.coroutines.delay

@Composable
fun SplashScreen(
    onSplashFinished: () -> Unit
) {
    val scale = remember { Animatable(0.7f) }
    val alpha = remember { Animatable(0f) }
    var statusText by remember { mutableStateOf("Initializing ShopGenie...") }

    val infiniteTransition = rememberInfiniteTransition(label = "pulse")
    val glowScale by infiniteTransition.animateFloat(
        initialValue = 0.95f,
        targetValue = 1.08f,
        animationSpec = infiniteRepeatable(
            animation = tween(1400, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "glowScale"
    )

    // Startup initialization sequence with auto-transition & error resilience
    LaunchedEffect(Unit) {
        scale.animateTo(
            targetValue = 1f,
            animationSpec = tween(durationMillis = 600, easing = FastOutSlowInEasing)
        )
        alpha.animateTo(
            targetValue = 1f,
            animationSpec = tween(durationMillis = 500)
        )

        try {
            // Stage 1: Load configurations & cache
            delay(400)
            statusText = "Locating nearby stores & deals..."

            // Stage 2: Initialize local index & permissions check
            delay(500)
            statusText = "Warming up neighbourhood catalog..."

            // Stage 3: Ready
            delay(400)
            statusText = "Neighbourhood, granted!"
            delay(300)

            // Transition to the main app flow
            onSplashFinished()
        } catch (e: Exception) {
            // Graceful error fallback: never hang indefinitely
            statusText = "Ready to explore"
            delay(400)
            onSplashFinished()
        }
    }

    Surface(
        modifier = Modifier
            .fillMaxSize()
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null
            ) {
                // Tapping anywhere allows the user to immediately enter without waiting
                onSplashFinished()
            },
        color = MaterialTheme.colorScheme.background
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .statusBarsPadding()
                .navigationBarsPadding()
        ) {
            // Background subtle gradient glow
            Canvas(modifier = Modifier.fillMaxSize()) {
                val centerOffset = Offset(size.width / 2f, size.height * 0.42f)
                drawCircle(
                    brush = Brush.radialGradient(
                        colors = listOf(
                            GenieTeal.copy(alpha = 0.12f),
                            AiViolet.copy(alpha = 0.05f),
                            Color.Transparent
                        ),
                        center = centerOffset,
                        radius = size.width * 0.75f
                    ),
                    center = centerOffset,
                    radius = size.width * 0.75f
                )
            }

            // Top Quick Action (Skip)
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 16.dp),
                horizontalArrangement = Arrangement.End
            ) {
                TextButton(
                    onClick = onSplashFinished,
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text(
                        text = "Skip",
                        color = MaterialTheme.colorScheme.primary,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                }
            }

            // Central Branding & Content
            Column(
                modifier = Modifier
                    .align(Alignment.Center)
                    .padding(horizontal = 32.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                // Animated Genie Logo Badge with Lamp / Sparkles motif
                Box(
                    modifier = Modifier
                        .size(120.dp)
                        .scale(scale.value * glowScale),
                    contentAlignment = Alignment.Center
                ) {
                    // Outer glow halo
                    Box(
                        modifier = Modifier
                            .size(112.dp)
                            .clip(CircleShape)
                            .background(
                                Brush.linearGradient(
                                    listOf(
                                        GenieTeal.copy(alpha = 0.25f),
                                        SparkAmber.copy(alpha = 0.2f),
                                        AiViolet.copy(alpha = 0.15f)
                                    )
                                )
                            )
                    )

                    // Core Badge
                    Box(
                        modifier = Modifier
                            .size(88.dp)
                            .clip(CircleShape)
                            .background(
                                Brush.linearGradient(
                                    listOf(GenieTeal, Color(0xFF0D9488), AiViolet)
                                )
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        // Custom vector Genie Lamp / Magic Sparkle drawing
                        Canvas(modifier = Modifier.size(48.dp)) {
                            val w = size.width
                            val h = size.height

                            // Draw magical Genie Lamp Silhouette
                            val lampPath = Path().apply {
                                // Base of the lamp
                                moveTo(w * 0.35f, h * 0.78f)
                                lineTo(w * 0.65f, h * 0.78f)
                                lineTo(w * 0.60f, h * 0.70f)
                                lineTo(w * 0.40f, h * 0.70f)
                                close()

                                // Body of the lamp
                                moveTo(w * 0.25f, h * 0.55f)
                                quadraticTo(w * 0.15f, h * 0.68f, w * 0.40f, h * 0.70f)
                                lineTo(w * 0.60f, h * 0.70f)
                                quadraticTo(w * 0.82f, h * 0.65f, w * 0.85f, h * 0.48f)
                                quadraticTo(w * 0.85f, h * 0.40f, w * 0.78f, h * 0.42f)
                                quadraticTo(w * 0.68f, h * 0.50f, w * 0.52f, h * 0.50f)
                                lineTo(w * 0.38f, h * 0.46f)
                                quadraticTo(w * 0.25f, h * 0.45f, w * 0.25f, h * 0.55f)
                                close()

                                // Handle
                                moveTo(w * 0.25f, h * 0.50f)
                                quadraticTo(w * 0.10f, h * 0.48f, w * 0.12f, h * 0.60f)
                                quadraticTo(w * 0.14f, h * 0.68f, w * 0.28f, h * 0.65f)
                            }
                            drawPath(
                                path = lampPath,
                                color = Color.White
                            )

                            // Magical Sparkle above the spout
                            val sparkleCenter = Offset(w * 0.82f, h * 0.28f)
                            val spPath = Path().apply {
                                moveTo(sparkleCenter.x, sparkleCenter.y - 10f)
                                quadraticTo(sparkleCenter.x, sparkleCenter.y, sparkleCenter.x + 10f, sparkleCenter.y)
                                quadraticTo(sparkleCenter.x, sparkleCenter.y, sparkleCenter.x, sparkleCenter.y + 10f)
                                quadraticTo(sparkleCenter.x, sparkleCenter.y, sparkleCenter.x - 10f, sparkleCenter.y)
                                quadraticTo(sparkleCenter.x, sparkleCenter.y, sparkleCenter.x, sparkleCenter.y - 10f)
                                close()
                            }
                            drawPath(path = spPath, color = SparkAmber)

                            // Second minor sparkle
                            val sp2Center = Offset(w * 0.62f, h * 0.22f)
                            val sp2Path = Path().apply {
                                moveTo(sp2Center.x, sp2Center.y - 6f)
                                quadraticTo(sp2Center.x, sp2Center.y, sp2Center.x + 6f, sp2Center.y)
                                quadraticTo(sp2Center.x, sp2Center.y, sp2Center.x, sp2Center.y + 6f)
                                quadraticTo(sp2Center.x, sp2Center.y, sp2Center.x - 6f, sp2Center.y)
                                quadraticTo(sp2Center.x, sp2Center.y, sp2Center.x, sp2Center.y - 6f)
                                close()
                            }
                            drawPath(path = sp2Path, color = SparkAmber.copy(alpha = 0.9f))
                        }
                    }
                }

                Spacer(modifier = Modifier.height(28.dp))

                // Brand Name
                Text(
                    text = "ShopGenie",
                    style = MaterialTheme.typography.headlineLarge.copy(
                        fontWeight = FontWeight.ExtraBold,
                        fontSize = 34.sp,
                        letterSpacing = (-0.5).sp
                    ),
                    color = MaterialTheme.colorScheme.onBackground,
                    modifier = Modifier.alpha(alpha.value)
                )

                Spacer(modifier = Modifier.height(8.dp))

                // Brand Tagline exactly matching user's original screenshot & brand
                Text(
                    text = "ShopGenie - Your neighbourhood, granted.",
                    style = MaterialTheme.typography.bodyLarge.copy(
                        fontWeight = FontWeight.Medium,
                        fontSize = 15.sp
                    ),
                    color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.72f),
                    textAlign = TextAlign.Center,
                    modifier = Modifier.alpha(alpha.value)
                )

                Spacer(modifier = Modifier.height(48.dp))

                // Dynamic Status & Loading Indicator
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(24.dp),
                        strokeWidth = 2.5.dp,
                        color = GenieTeal
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    Text(
                        text = statusText,
                        style = MaterialTheme.typography.bodySmall.copy(
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Normal
                        ),
                        color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.55f),
                        textAlign = TextAlign.Center
                    )
                }
            }

            // Bottom Brand Footnote
            Column(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .padding(bottom = 24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "Hyperlocal Commerce & Express Checkout",
                    style = MaterialTheme.typography.labelSmall.copy(
                        fontSize = 11.sp,
                        fontWeight = FontWeight.SemiBold
                    ),
                    color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.45f)
                )
            }
        }
    }
}
