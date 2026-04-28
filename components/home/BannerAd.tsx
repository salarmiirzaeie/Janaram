// components/BannerAd.tsx
import { interstitialPlacement } from "@/constants/keys";
import { usePlansQuery } from "@/services/upgrade/upgrade-adapter";
import { Adivery } from "adivery";
import React, { useEffect, useMemo, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const showAd = () => {
  Adivery.prepareInterstitialAd(interstitialPlacement);
  Adivery.isLoaded(interstitialPlacement).then((isLoaded) => {
    if (isLoaded) {
      Adivery.showAd(interstitialPlacement);
    }
  });
};
// تلاش برای import ادیوری
let AdiveryBanner: any = null;
let Banner: any = null;
let LargeBanner: any = null;
let MediumRectangle: any = null;

try {
  const Adivery = require("adivery");
  AdiveryBanner = Adivery.AdiveryBanner;
  Banner = Adivery.Banner;
  LargeBanner = Adivery.LargeBanner;
  MediumRectangle = Adivery.MediumRectangle;
} catch (error) {
  console.warn("Adivery module not found:", error);
}

export type BannerSize = "BANNER" | "LARGE_BANNER" | "MEDIUM_RECTANGLE";

interface BannerAdProps {
  bannerSize?: BannerSize;
  onLoaded?: () => void;
  onClicked?: () => void;
  onError?: (message: string) => void;
}

const BannerAd: React.FC<BannerAdProps> = ({
  bannerSize = "BANNER",
  onLoaded,
  onClicked,
  onError,
}) => {
  const placementId = "d0fabdbf-c63e-4767-a2d9-0958d8611a82"; // از پنل ادیوری دریافت کنید
  const { data: plans } = usePlansQuery(null);

  const proPlan = useMemo(
    () => plans?.data.plans?.find((plan) => plan.name === "unlimited"),
    [plans?.data.plans]
  );

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // بررسی وجود کتابخانه
    if (!AdiveryBanner) {
      onError?.("Adivery library not installed");
      return;
    }

    if (placementId) {
      setIsReady(true);
    } else {
      onError?.("Placement ID is required");
    }
  }, [placementId]);

  const getBannerHeight = () => {
    switch (bannerSize) {
      case "LARGE_BANNER":
        return 100;
      case "MEDIUM_RECTANGLE":
        return 250;
      default:
        return 50;
    }
  };

  const getBannerWidth = () => {
    const screenWidth = Dimensions.get("window").width;
    switch (bannerSize) {
      case "MEDIUM_RECTANGLE":
        return Math.min(300, screenWidth - 32);
      default:
        return screenWidth - 32;
    }
  };

  const getBannerSizeObject = () => {
    switch (bannerSize) {
      case "LARGE_BANNER":
        return LargeBanner;
      case "MEDIUM_RECTANGLE":
        return MediumRectangle;
      default:
        return Banner;
    }
  };

  const handleLoad = () => {
    onLoaded?.();
  };

  const handleClick = () => {
    console.log("🖱️ Banner ad clicked:", placementId);
    onClicked?.();
  };

  const handleError = (message: string) => {
    console.error("❌ Banner ad error:", message);
    onError?.(message);
  };

  if (!isReady || !AdiveryBanner) {
    return (
      <View style={[styles.container, { height: getBannerHeight() }]}>
        <View style={styles.placeholder} />
      </View>
    );
  }
  if (!proPlan?.isActive) {
    return (
      <SafeAreaView edges={["bottom"]}>
        <View style={[styles.container, { height: getBannerHeight() }]}>
          <AdiveryBanner
            placementId={placementId}
            bannerSize={getBannerSizeObject()}
            onAdLoaded={handleLoad}
            onAdClicked={handleClick}
            onError={handleError}
          />
        </View>
      </SafeAreaView>
    );
  } else {
    return null;
  }
};
const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    marginVertical: 8,
  },
  placeholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
  },
});

export default BannerAd;
