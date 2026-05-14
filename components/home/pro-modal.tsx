import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { isBazaar } from "@/constants/keys";
import { useCustomToast } from "@/hooks/useToast";
import { useZarinpalPayment } from "@/hooks/useZarinpalPayment";
import {
  usePlansQuery,
  useUpgradePlanMutation,
} from "@/services/upgrade/upgrade-adapter";
// import { useBazaar } from "@cafebazaar/react-native-poolakey";
// import { useMyket } from "iab-myket-reactnative/src/index";
import { AntDesign, Ionicons } from "@expo/vector-icons";

import React, { useEffect, useRef } from "react";

import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export type ProPlanModalProps = {
  visible: boolean;
  onClose: () => void;
};
let useBazaarHook: any = null;
let useMyketHook: any = null;

if (isBazaar) {
  useBazaarHook = require("@cafebazaar/react-native-poolakey").useBazaar;
} else {
  useMyketHook = require("iab-myket-reactnative/src/index").useMyket;
}
export default function ProPlanFullScreenModal({
  visible,
  onClose,
}: ProPlanModalProps) {
  const screenHeight = Dimensions.get("window").height;
  const scrollViewRef = useRef<ScrollView>(null);
  const isSmall = screenHeight < 700;
  const heroSize = isSmall ? 150 : 180;
  const titleFont = isSmall ? "text-xl" : "text-2xl";
  const descFont = isSmall ? "text-xs" : "text-md";
  const priceFont = isSmall ? "text-sm" : "text-base";
  const paddingX = isSmall ? "px-4" : "px-6";

  useEffect(() => {
    if (visible) StatusBar.setBarStyle("light-content");
  }, [visible]);

  const { data: plans, isLoading: isLoadingPlans } = usePlansQuery(null);
  const { startPayment, isLoading: isPaymentLoading } = useZarinpalPayment();
  const proPlan = plans?.data?.plans?.find((plan) => plan.name === "unlimited");
  const features = proPlan?.features;
  const toast = useCustomToast();
  const bazaar = isBazaar
    ? useBazaarHook?.(process.env.EXPO_PUBLIC_BAZAR_RSA_KEY)
    : null;

  const myketInstance = !isBazaar
    ? useMyketHook?.(process.env.EXPO_PUBLIC_MYKET_BILING_KEY)
    : null;
  const isActive = proPlan?.isActive;
  const isZarinPalEnabled = proPlan?.isZarinPalEnabled;
  const isLoading = isLoadingPlans || isPaymentLoading;
  const [upgradePlan, { isLoading: isUpgrading }] = useUpgradePlanMutation();

  const scaleValue = useSharedValue(1);

  const handlePressIn = () => {
    scaleValue.value = withTiming(0.97, { duration: 100 });
  };

  const handlePressOut = () => {
    scaleValue.value = withTiming(1, { duration: 100 });
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const handleSubscribe = async (id: string) => {
    if (id === "0") {
      toast.show({ msg: "پلن رایگان برای شما فعال شد", type: "success" });
      onClose();
      return;
    }

    if (isActive) {
      toast.show({ msg: "پلن Pro برای شما فعال است", type: "success" });
      onClose();
      return;
    }

    if (!proPlan) return;

    // ZarinPal (both apps)
    if (isZarinPalEnabled) {
      const amountInRials = proPlan.price * 1000;
      await startPayment(
        proPlan.id,
        amountInRials,
        `فعال‌سازی اشتراک Pro جانارام `
      );
      return;
    }

    // ---------------------------
    // BAZAAR VERSION
    // ---------------------------
    if (isBazaar) {
      await bazaar
        .subscribeProduct(id)
        .then(() => {
          upgradePlan({ id })
            .unwrap()
            .then((res) => {
              if (res.success) {
                toast.show({ msg: res.message, type: "success" });
                onClose();
              }
            });
        })
        .catch((e: any) => {
          toast.show({
            msg: e?.data?.message || "خرید ناموفق بود",
            type: "error",
          });
        });
      return;
    }

    // ---------------------------
    // MYKET VERSION
    // ---------------------------
    try {
      await myketInstance.connect(process.env.EXPO_PUBLIC_MYKET_BILING_KEY);
      const inventory = await myketInstance?.queryPurchaseProduct(true, [id]);
      const purchase = await myketInstance?.purchaseProduct(id, null);
      const res = await upgradePlan({ id }).unwrap();

      if (res.success) {
        toast.show({ msg: res.message, type: "success" });
        onClose();
      }
    } catch (error: any) {
      toast.show({
        msg: error?.data?.message || "خرید ناموفق بود",
        type: "error",
      });
    }
  };

  return (
    <Modal
      statusBarTranslucent={false}
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <LinearGradient
        colors={["#FFFFFF", "#FFFFFF", "#F0F6FA", "#F5F0FA"]}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View className="pb-2 px-5 pt-3">
          <HStack className="items-center justify-between">
            <Pressable onPress={onClose} hitSlop={10} className="rounded-full">
              <View className="w-10 h-10 rounded-full bg-white shadow-sm justify-center items-center">
                <AntDesign name="close" size={22} color="#666" />
              </View>
            </Pressable>
            <View className="bg-primary-500/10 px-3 py-1.5 rounded-full">
              <Text className="text-primary-600 font-vazirBold text-xs">
                پیشنهاد ویژه
              </Text>
            </View>
          </HStack>
        </View>

        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          bounces={false}
        >
          {isLoadingPlans ? (
            <VStack space="md" className={`${paddingX} py-4`}>
              <View style={styles.skeletonTitle} />
              <View style={styles.skeletonDesc} />
              <View className="items-center">
                <View
                  style={[
                    styles.skeletonHero,
                    { width: heroSize, height: heroSize },
                  ]}
                />
              </View>
              <View style={styles.skeletonPrice} />
              <VStack className="mt-4" space="md">
                {[...Array(3)].map((_, i) => (
                  <HStack key={i} space="md" className="items-start">
                    <View style={styles.skeletonIcon} />
                    <View style={styles.skeletonFeature} />
                  </HStack>
                ))}
              </VStack>
            </VStack>
          ) : (
            <>
              {/* Hero Section */}
              <View className={`${paddingX} py-2`}>
                <VStack space="md">
                  <Text
                    className={`${titleFont} font-vazirBold text-right text-primary-800`}
                  >
                    به جمع کاربران Pro بپیوندید ✨
                  </Text>
                  <Text
                    className={`text-gray-600 text-right font-vazir leading-5 ${descFont}`}
                  >
                    به همه تمرین‌ها، مدیتیشن‌های حرفه‌ای و ابزارهای پیشرفته
                    دسترسی پیدا کن و سفر آرامش رو با قدرت بیشتری ادامه بده.
                  </Text>

                  {/* Price Tag */}
                  <View className="self-start mt-1">
                    <LinearGradient
                      colors={["#FF9966", "#E6804D"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{
                        borderRadius: 16,
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                      }}
                    >
                      <HStack space="sm" className="items-center">
                        <Text
                          className={`text-white font-vazirBold ${priceFont}`}
                        >
                          {proPlan?.price?.toLocaleString()} هزار تومان
                        </Text>
                        {proPlan?.oldPrice && (
                          <Text
                            className={`text-white/70 font-vazir line-through text-xs`}
                          >
                            {proPlan.oldPrice.toLocaleString()} هزار تومان
                          </Text>
                        )}
                        <View className="bg-white/20 px-2 py-0.5 rounded-full">
                          <Text className="text-white font-vazirBold text-xs">
                            ماهانه
                          </Text>
                        </View>
                      </HStack>
                    </LinearGradient>
                  </View>
                </VStack>
              </View>

              {/* Benefits Section */}
              <View className={`${paddingX} mt-4 mb-4`}>
                <VStack space="md">
                  <Text className="text-primary-700 font-vazirBold text-right text-base">
                    🎁 مزایای ویژه Pro
                  </Text>
                  {features?.map((b: string, idx: number) => (
                    <Animated.View
                      key={idx}
                      entering={FadeInUp.duration(500)
                        .delay(idx * 100)
                        .springify()}
                    >
                      <HStack space="md" className="items-start">
                        <View className="bg-accent-500/20 rounded-full p-1">
                          <AntDesign name="check" size={16} color="#FF9966" />
                        </View>
                        <VStack space="xs" className="flex-1">
                          <Text
                            className={`text-right font-vazirBold ${descFont} text-gray-700`}
                          >
                            {b}
                          </Text>
                        </VStack>
                      </HStack>
                    </Animated.View>
                  ))}
                </VStack>
              </View>
            </>
          )}
        </ScrollView>

        {/* Bottom CTA - Fixed at bottom */}
        <View className="border-t border-gray-100 bg-white/95 p-4 pb-6">
          <VStack space="md">
            <TouchableOpacity
              onPress={() => handleSubscribe(proPlan?.id || "0")}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.9}
              disabled={isLoading}
            >
              <Animated.View style={buttonAnimatedStyle}>
                <LinearGradient
                  colors={["#79AED6", "#9966CC"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    borderRadius: 16,
                    paddingVertical: 14,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    gap: 8,
                  }}
                >
                  {isLoading ? (
                    <ButtonSpinner color="white" />
                  ) : (
                    <>
                      <Ionicons name="diamond" size={20} color="white" />
                      <Text className="text-white font-vazirBold text-base">
                        خرید اشتراک Pro
                      </Text>
                    </>
                  )}
                </LinearGradient>
              </Animated.View>
            </TouchableOpacity>

            <Button
              variant="outline"
              onPress={onClose}
              className="border-gray-200 rounded-full h-12"
            >
              <ButtonText className="text-gray-600 font-vazir">
                ادامه با نسخه رایگان
              </ButtonText>
            </Button>

            <Text className="text-center text-gray-400 text-xs font-vazir">
              با ادامه، با قوانین و حریم خصوصی موافقم
            </Text>
          </VStack>
        </View>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  skeletonTitle: {
    width: "70%",
    height: 26,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
    marginBottom: 12,
  },
  skeletonDesc: {
    width: "90%",
    height: 14,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
    marginBottom: 20,
  },
  skeletonHero: {
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    marginBottom: 16,
  },
  skeletonPrice: {
    width: "60%",
    height: 36,
    borderRadius: 16,
    backgroundColor: "#e0e0e0",
    marginBottom: 20,
  },
  skeletonIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#e0e0e0",
  },
  skeletonFeature: {
    flex: 1,
    height: 14,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
  },
});
