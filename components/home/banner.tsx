import {
  BannerPosition,
  BannerSize,
  destroyBannerAd,
  requestBannerAd,
  setUserConsent,
  showBannerAd,
} from "@react-native-tapsell-mediation/tapsell";
import React, { useCallback, useState } from "react";
import { Button, View } from "react-native";

const BannerScreen = () => {
  const ZONE_ID = "d217e3e6-0070-4120-925d-5d39d0298893";
  const [ad, setAd] = useState(null);
  setUserConsent(true);

  const showBannerAdCallBack = useCallback(() => {
    console.log("showAd");
    if (!ad) {
      console.log("AdId does not exist");
      return;
    }
    showBannerAd(ad, BannerPosition.Top, {
      onAdImpression: () => {
        console.log("onAdImpression");
      },
      onAdClicked: () => {
        console.log("onAdClicked");
      },
      onAdFailed: (error: string) => {
        console.log("onAdFailed", error);
      },
    });
  }, []);

  const destroyBannerAdCallBack = useCallback(() => {
    console.log("destroyAd");
    if (ad) {
      console.log("AdId does not exist");
      return;
    }
    destroyBannerAd(ad);
  }, []);

  return (
    <View>
      <Button
        title="Request Ad"
        onPress={() => {
          console.log("object");
          requestBannerAd(ZONE_ID, BannerSize.BANNER_320_50)
            .then((id: string) => {
              console.log(id);
              setAd(id);
            })
            .catch((res) => {
              console.log("Request failed:", JSON.stringify(res));
            });
        }}
      />
      <Button title="Show Ad" onPress={showBannerAdCallBack} />
      <Button title="Destroy Ad" onPress={destroyBannerAdCallBack} />
    </View>
  );
};

export default BannerScreen;
