import "dotenv/config";

const isBazaar = process.env.APP_VARIANT === "bazaar";
const appVersion = "1.2.3";
const runtimeVersion = isBazaar ? `bazaar-${appVersion}` : `myket-${appVersion}`;

export default {
  expo: {
    name: "جانارام",
    slug: "Janaram",
    version: appVersion,
    runtimeVersion,

    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "janaram",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    platforms: ["ios", "android"],

    // ADD THIS - Include all assets
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: false,
      bundleIdentifier: "com.salarmiirzapour.Janaram",
      buildNumber: "1.2.3",
    },

    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },

      googleServicesFile: "./google-services.json",

      edgeToEdgeEnabled: true,

      package: "com.salarmiirzapour.Janaram",

      permissions: [
        "android.permission.FOREGROUND_SERVICE",
        "android.permission.MODIFY_AUDIO_SETTINGS",
        "com.google.android.gms.permission.AD_ID",
      ],

      blockedPermissions: ["android.permission.SYSTEM_ALERT_WINDOW", "android.permission.RECORD_AUDIO"],

      intentFilters: [
        {
          action: "VIEW",
          data: {
            scheme: "janaram",
          },
          category: ["BROWSABLE", "DEFAULT"],
        },
      ],
    },

    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },

    plugins: [
      "expo-router",

      // CONDITIONAL STORE PLUGIN
      ...(isBazaar ? ["./plugins/withPoolakey"] : ["./plugins/withMyketBilling"]),

      "expo-notifications",

      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          dark: {
            image: "./assets/images/splash-icon.png",
            backgroundColor: "#000000",
          },
          backgroundColor: "#ffffff",
        },
      ],

      [
        "expo-av",
        {
          microphonePermission: false,
        },
      ],

      [
        "expo-build-properties",
        {
          android: {
            removePermissions: ["android.permission.SYSTEM_ALERT_WINDOW", "android.permission.RECORD_AUDIO"],
            usesCleartextTraffic: true,
          },
        },
      ],
    ],

    extra: {
      router: {},

      appVariant: process.env.APP_VARIANT,

      eas: {
        projectId: "debb88c7-8a40-450b-8578-7a14c9bb202a",
      },
    },

    updates: {
      url: "https://janaram.ir/api/updates/manifest",
      enabled: true,
      fallbackToCacheTimeout: 30000, // Changed from 0 to 30000
      checkAutomatically: "ON_LOAD",
    },
  },
};
