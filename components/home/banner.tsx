import {
  BannerPosition,
  BannerSize,
  destroyBannerAd,
  requestBannerAd,
  setUserConsent,
  showBannerAd,
} from "@react-native-tapsell-mediation/tapsell";
import React, { useCallback, useState } from "react";
import { Alert, Button, View } from "react-native";

const BannerScreen = () => {
  const ZONE_ID = "e3d5999c-5990-4e31-8ce9-642ce040a7f4";
  const [ad, setAd] = useState(null);

  // فقط setUserConsent (اگر SDK خودکار مقداردهی می‌شود)
  React.useEffect(() => {
    setUserConsent(true);
    console.log("✅ User consent set");
  }, []);

  const requestBanner = useCallback(async () => {
    console.log("📢 Requesting banner ad...");
    await requestBannerAd(ZONE_ID, BannerSize.BANNER_320_50)
      .then((res) => {
        console.log(res);
        // console.log("✅ Ad loaded:", id);
        //       setAd(id);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const showBannerAdCallBack = useCallback(() => {
    if (!ad) {
      Alert.alert("توجه", "ابتدا تبلیغ را درخواست کنید");
      return;
    }

    showBannerAd(ad, BannerPosition.Top, {
      onAdImpression: () => console.log("onAdImpression"),
      onAdClicked: () => console.log("onAdClicked"),
      onAdFailed: (error: string) => console.log("onAdFailed", error),
    });
  }, [ad]);

  const destroyBannerAdCallBack = useCallback(() => {
    if (!ad) return;
    destroyBannerAd(ad);
    setAd(null);
  }, [ad]);

  return (
    <View style={{ justifyContent: "center", gap: 10, padding: 20 }}>
      <Button title="Request Ad" onPress={requestBanner} />
      <Button title="Show Ad" onPress={showBannerAdCallBack} disabled={!ad} />
      <Button
        title="Destroy Ad"
        onPress={destroyBannerAdCallBack}
        disabled={!ad}
      />
    </View>
  );
};

export default BannerScreen;
