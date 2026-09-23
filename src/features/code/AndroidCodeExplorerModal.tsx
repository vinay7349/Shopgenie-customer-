import React, { useState } from 'react';
import { useShopGenie } from '../../context/ShopGenieContext';
import { X, Copy, Check, FileCode, Folder, Download, Terminal, Smartphone } from 'lucide-react';

interface CodeFile {
  path: string;
  category: 'gradle' | 'manifest' | 'designsystem' | 'components' | 'domain' | 'data' | 'navigation' | 'features';
  language: 'kotlin' | 'xml' | 'groovy';
  code: string;
}

const ANDROID_FILES: CodeFile[] = [
  {
    path: 'build.gradle.kts (project)',
    category: 'gradle',
    language: 'kotlin',
    code: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
    alias(libs.plugins.hilt.android) apply false
    alias(libs.plugins.ksp) apply false
    alias(libs.plugins.kotlinx.serialization) apply false
}`
  },
  {
    path: 'app/build.gradle.kts',
    category: 'gradle',
    language: 'kotlin',
    code: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.hilt.android)
    alias(libs.plugins.ksp)
    alias(libs.plugins.kotlinx.serialization)
}

android {
    namespace = "com.shopgenie"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.shopgenie"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables.useSupportLibrary = true

        buildConfigField("Boolean", "USE_MOCK_DATA", "true")
        buildConfigField("String", "BASE_URL", "\\"https://api.shopgenie.local/v1/\\"")
    }

    buildFeatures {
        compose = true
        buildConfig = true
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    // Jetpack Compose & Material 3
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.ui.graphics)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.compose.material.icons.extended)

    // Navigation Compose & Lifecycle
    implementation(libs.androidx.navigation.compose)
    implementation(libs.androidx.lifecycle.runtime.compose)
    implementation(libs.androidx.lifecycle.viewmodel.compose)

    // Hilt Dependency Injection
    implementation(libs.hilt.android)
    ksp(libs.hilt.compiler)
    implementation(libs.androidx.hilt.navigation.compose)

    // Room Database & DataStore
    implementation(libs.androidx.room.runtime)
    implementation(libs.androidx.room.ktx)
    ksp(libs.androidx.room.compiler)
    implementation(libs.androidx.datastore.preferences)

    // Retrofit & OkHttp
    implementation(libs.retrofit)
    implementation(libs.retrofit.kotlinx.serialization)
    implementation(libs.okhttp)
    implementation(libs.okhttp.logging)
    implementation(libs.kotlinx.serialization.json)

    // CameraX & ML Kit Barcode Scanning
    implementation(libs.androidx.camera.core)
    implementation(libs.androidx.camera.camera2)
    implementation(libs.androidx.camera.lifecycle)
    implementation(libs.androidx.camera.view)
    implementation(libs.google.mlkit.barcode)

    // Coil Image Loading
    implementation(libs.coil.compose)
}`
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    category: 'manifest',
    language: 'xml',
    code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-feature android:name="android.hardware.camera" android:required="false" />

    <application
        android:name=".ShopGenieApp"
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.ShopGenie">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:windowSoftInputMode="adjustResize"
            android:theme="@style/Theme.ShopGenie">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>`
  },
  {
    path: 'app/src/main/java/com/shopgenie/core/designsystem/Theme.kt',
    category: 'designsystem',
    language: 'kotlin',
    code: `package com.shopgenie.core.designsystem

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

// ShopGenie Brand Color System
val GenieTealPrimaryLight = Color(0xFF0F766E)
val GenieTealPrimaryDark = Color(0xFF5EEAD4)
val SparkAmberSecondaryLight = Color(0xFFF59E0B)
val SparkAmberSecondaryDark = Color(0xFFFBBF24)
val AiVioletTertiaryLight = Color(0xFF6D5EF5)
val AiVioletTertiaryDark = Color(0xFFB4ABFF)

private val LightColorScheme = lightColorScheme(
    primary = GenieTealPrimaryLight,
    onPrimary = Color.White,
    primaryContainer = Color(0xFFCCFBF1),
    onPrimaryContainer = Color(0xFF115E59),
    secondary = SparkAmberSecondaryLight,
    onSecondary = Color(0xFF0F1F1C),
    secondaryContainer = Color(0xFFFEF3C7),
    tertiary = AiVioletTertiaryLight,
    background = Color(0xFFF7F8FA),
    surface = Color(0xFFFFFFFF),
    surfaceVariant = Color(0xFFEEF2F1),
    outline = Color(0xFFCBD5D2)
)

private val DarkColorScheme = darkColorScheme(
    primary = GenieTealPrimaryDark,
    onPrimary = Color(0xFF003833),
    primaryContainer = Color(0xFF005049),
    secondary = SparkAmberSecondaryDark,
    onSecondary = Color(0xFF432B00),
    tertiary = AiVioletTertiaryDark,
    background = Color(0xFF0F1412),
    surface = Color(0xFF171D1B),
    surfaceVariant = Color(0xFF222B28),
    outline = Color(0xFF3A4642)
)

@Composable
fun ShopGenieTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = ShopGenieTypography,
        shapes = ShopGenieShapes,
        content = content
    )
}`
  },
  {
    path: 'app/src/main/java/com/shopgenie/domain/model/Shop.kt',
    category: 'domain',
    language: 'kotlin',
    code: `package com.shopgenie.domain.model

enum class ShopCategory(val label: String) {
    SUPERMARKET("Supermarket"),
    FOOD_CART("Food Cart"),
    POP_UP("Pop-up Store"),
    FASHION("Fashion & Apparel"),
    BAKERY_CAFE("Bakery & Cafe"),
    ELECTRONICS("Electronics & Gadgets"),
    MOTO_AUTO("Moto & Auto Gear"),
    BOUTIQUE("Boutique"),
    PHARMACY("Pharmacy"),
    HOME_DECOR("Home & Decor")
}

data class Shop(
    val id: String,
    val name: String,
    val category: ShopCategory,
    val logoUrl: String,
    val coverUrl: String,
    val latitude: Double,
    val longitude: Double,
    val distanceM: Int,
    val rating: Float,
    val reviewCount: Int,
    val followerCount: Int,
    val productCount: Int,
    val isOpen: Boolean,
    val hours: String,
    val address: String,
    val area: String,
    val phone: String,
    val supportsSelfCheckout: Boolean,
    val verified: Boolean,
    val paymentMethods: List<String>,
    val description: String
)`
  },
  {
    path: 'app/src/main/java/com/shopgenie/domain/repository/ShopRepository.kt',
    category: 'domain',
    language: 'kotlin',
    code: `package com.shopgenie.domain.repository

import com.shopgenie.domain.model.Product
import com.shopgenie.domain.model.Shop
import com.shopgenie.domain.model.ShopCategory
import kotlinx.coroutines.flow.Flow

interface ShopRepository {
    fun getNearbyShops(lat: Double, lng: Double, radiusM: Int = 3000): Flow<List<Shop>>
    suspend fun getShopById(shopId: String): Shop?
    fun getFollowedShops(): Flow<List<Shop>>
    suspend fun toggleFollowShop(shopId: String): Boolean
    fun searchShopsAndProducts(query: String, category: ShopCategory?): Flow<Pair<List<Shop>, List<Product>>>
}`
  },
  {
    path: 'app/src/main/java/com/shopgenie/data/repository/FakeShopRepository.kt',
    category: 'data',
    language: 'kotlin',
    code: `package com.shopgenie.data.repository

import com.shopgenie.domain.model.*
import com.shopgenie.domain.repository.ShopRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class FakeShopRepository @Inject constructor() : ShopRepository {

    private val shopsState = MutableStateFlow<List<Shop>>(INITIAL_MOCK_SHOPS)
    private val followedIds = MutableStateFlow<Set<String>>(setOf("shop-1", "shop-2"))

    override fun getNearbyShops(lat: Double, lng: Double, radiusM: Int): Flow<List<Shop>> =
        shopsState

    override suspend fun getShopById(shopId: String): Shop? =
        shopsState.value.find { it.id == shopId }

    override fun getFollowedShops(): Flow<List<Shop>> =
        followedIds.map { ids -> shopsState.value.filter { it.id in ids } }

    override suspend fun toggleFollowShop(shopId: String): Boolean {
        val current = followedIds.value
        val isFollowed = shopId in current
        followedIds.value = if (isFollowed) current - shopId else current + shopId
        return !isFollowed
    }

    override fun searchShopsAndProducts(
        query: String,
        category: ShopCategory?
    ): Flow<Pair<List<Shop>, List<Product>>> =
        shopsState.map { list ->
            val matchedShops = list.filter {
                (category == null || it.category == category) &&
                (it.name.contains(query, ignoreCase = true) || it.address.contains(query, ignoreCase = true))
            }
            Pair(matchedShops, emptyList())
        }
}`
  },
  {
    path: 'app/src/main/java/com/shopgenie/feature/scan/ScanViewModel.kt',
    category: 'features',
    language: 'kotlin',
    code: `package com.shopgenie.feature.scan

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.shopgenie.domain.model.Product
import com.shopgenie.domain.model.Shop
import com.shopgenie.domain.repository.ProductRepository
import com.shopgenie.domain.repository.ShopRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

sealed interface ScanUiState {
    data object Idle : ScanUiState
    data class ProductFound(val product: Product, val shop: Shop?) : ScanUiState
    data class StoreEntered(val shop: Shop) : ScanUiState
    data class Error(val message: String) : ScanUiState
}

@HiltViewModel
class ScanViewModel @Inject constructor(
    private val productRepository: ProductRepository,
    private val shopRepository: ShopRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<ScanUiState>(ScanUiState.Idle)
    val uiState: StateFlow<ScanUiState> = _uiState.asStateFlow()

    fun onBarcodeDetected(rawValue: String) {
        viewModelScope.launch {
            if (rawValue.startsWith("shop-")) {
                val shop = shopRepository.getShopById(rawValue)
                if (shop != null) {
                    _uiState.value = ScanUiState.StoreEntered(shop)
                }
            } else {
                val product = productRepository.getProductByBarcode(rawValue)
                if (product != null) {
                    val shop = shopRepository.getShopById(product.shopId)
                    _uiState.value = ScanUiState.ProductFound(product, shop)
                } else {
                    _uiState.value = ScanUiState.Error("Product not found for barcode: $rawValue")
                }
            }
        }
    }

    fun resetScanner() {
        _uiState.value = ScanUiState.Idle
    }
}`
  }
];

export const AndroidCodeExplorerModal: React.FC = () => {
  const { isCodeModalOpen, setIsCodeModalOpen, showSnackbar } = useShopGenie();
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isCodeModalOpen) return null;

  const currentFile = ANDROID_FILES[selectedFileIndex];

  const handleCopy = () => {
    navigator.clipboard?.writeText?.(currentFile.code);
    setCopied(true);
    showSnackbar({ message: `Copied ${currentFile.path} to clipboard!`, type: 'success' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl h-[90vh] bg-slate-950 text-slate-100 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-[#5EEAD4] flex items-center justify-center">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm text-white">
                ShopGenie Android Architecture & Kotlin Studio
              </h3>
              <p className="text-[11px] text-slate-400">
                Jetpack Compose · MVVM · Hilt · Room · DRF Retrofit · Production Spec
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-teal-600/30 text-teal-300 hover:bg-teal-600/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
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
          <div className="w-full md:w-72 bg-slate-900/60 border-r border-slate-800 p-3 overflow-y-auto space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-2">
              Project Structure
            </span>
            {ANDROID_FILES.map((file, idx) => {
              const isSelected = idx === selectedFileIndex;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFileIndex(idx)}
                  className={`w-full p-2 rounded-xl text-left text-xs font-mono flex items-center gap-2 transition-colors ${
                    isSelected
                      ? 'bg-teal-500/20 text-[#5EEAD4] font-semibold'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{file.path}</span>
                </button>
              );
            })}
          </div>

          {/* Code Viewer */}
          <div className="flex-1 bg-slate-950 p-4 overflow-y-auto flex flex-col font-mono text-xs text-slate-300 leading-relaxed">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-slate-400 text-[11px]">
              <span>{currentFile.path}</span>
              <span className="uppercase text-[10px] bg-slate-800 px-2 py-0.5 rounded">
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
