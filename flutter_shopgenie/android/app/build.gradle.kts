import java.util.Properties

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    // Apply the Flutter plugin after the Android and Kotlin plugins.
    id("dev.flutter.flutter-gradle-plugin")
}

val mapsProperties = Properties().apply {
    val localPropertiesFile = rootProject.file("local.properties")
    if (localPropertiesFile.exists()) {
        localPropertiesFile.inputStream().use(::load)
    }
}

android {
    namespace = "com.shopgenie"
    compileSdk = flutter.compileSdkVersion
    ndkVersion = flutter.ndkVersion

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    defaultConfig {
        applicationId = "com.shopgenie"
        minSdk = 24
        targetSdk = flutter.targetSdkVersion
        versionCode = flutter.versionCode
        versionName = flutter.versionName
        manifestPlaceholders["googleMapsApiKey"] =
            System.getenv("GOOGLE_MAPS_API_KEY_DEBUG")
                ?: mapsProperties.getProperty("googleMapsApiKeyDebug")
                ?: mapsProperties.getProperty("googleMapsApiKey")
                ?: ""
    }

    buildTypes {
        getByName("debug") {
            manifestPlaceholders["googleMapsApiKey"] =
                System.getenv("GOOGLE_MAPS_API_KEY_DEBUG")
                    ?: mapsProperties.getProperty("googleMapsApiKeyDebug")
                    ?: mapsProperties.getProperty("googleMapsApiKey")
                    ?: ""
        }
        getByName("release") {
            // Keep debug signing for local release-mode runs, as in the original setup.
            signingConfig = signingConfigs.getByName("debug")
            manifestPlaceholders["googleMapsApiKey"] =
                System.getenv("GOOGLE_MAPS_API_KEY_RELEASE")
                    ?: mapsProperties.getProperty("googleMapsApiKeyRelease")
                    ?: ""
        }
    }
}

kotlin {
    compilerOptions {
        jvmTarget = org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_17
    }
}

flutter {
    source = "../.."
}
