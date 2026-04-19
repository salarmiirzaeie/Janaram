import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import useCustomBazar from "@/hooks/useCustomBazar";
import { useCustomToast } from "@/hooks/useToast";
import { apiSlice } from "@/redux/api-slice";
import {
  usePlansQuery,
  useUpgradePlanMutation,
} from "@/services/upgrade/upgrade-adapter";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import {
  Dimensions,
  Image,
  Linking,
  Modal,
  Platform,
  Pressable,
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
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

export type ProPlanModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function ProPlanFullScreenModal({
  visible,
  onClose,
}: ProPlanModalProps) {
  const screenHeight = Dimensions.get("window").height;
  const bazaar = useCustomBazar(process.env.EXPO_PUBLIC_BAZAR_RSA_KEY);
  const isSmall = screenHeight < 700;
  const heroSize = isSmall ? 180 : 220;
  const titleFont = isSmall ? "text-2xl" : "text-3xl";
  const descFont = isSmall ? "text-sm" : "text-base";
  const priceFont = isSmall ? "text-base" : "text-lg";
  const paddingX = isSmall ? "px-4" : "px-6";
  const dispatch = useDispatch();

  useEffect(() => {
    if (visible) StatusBar.setBarStyle("light-content");
  }, [visible]);

  const { data: plans, isLoading } = usePlansQuery(null);
  const [upgradePlan, { isLoading: isUpgrading }] = useUpgradePlanMutation();
  const proPlan = plans?.data.plans?.find((plan) => plan.name === "unlimited");
  const features = proPlan?.features;
  const toast = useCustomToast();

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
    if (id !== "0") {
      if (Platform.OS === "android") {
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
            console.log(e);
          });
      } else if (Platform.OS === "ios") {
        const packageId = id;
        const url = `sibapp://package_purchase?package=${packageId}&developer_payload=`;
        const supported = await Linking.canOpenURL(url);
        if (!supported) {
          console.log("لینک پرداخت سیب‌اپ پشتیبانی نمی‌شو");
          throw new Error("لینک پرداخت سیب‌اپ پشتیبانی نمی‌شود");
        }
        await Linking.openURL(url);
        setTimeout(() => {
          dispatch(apiSlice.util.invalidateTags(["Plans"]));
        }, 20000);
      }
    } else {
      toast.show({ msg: "پلن رایگان برای شما فعال شد", type: "success" });
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
        <SafeAreaView edges={["top", "bottom"]} className="flex-1">
          {/* Header */}
          <View className="pb-4 px-5 pt-2">
            <HStack className="items-center justify-between">
              <Pressable
                onPress={onClose}
                hitSlop={10}
                className="rounded-full"
              >
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

          {isLoading ? (
            <VStack space="md" className={`${paddingX}`}>
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
              <View>
                <VStack space="md" className={`${paddingX}`}>
                  <View className="items-center">
                    <Image
                      source={require("@/assets/illustrations/Upgrading.png")}
                      resizeMode="contain"
                      style={{ width: heroSize, height: heroSize }}
                    />
                  </View>

                  <Text
                    className={`${titleFont} font-vazirBold text-right text-primary-800`}
                  >
                    به جمع کاربران Pro بپیوندید ✨
                  </Text>
                  <Text
                    className={`text-gray-600 text-right font-vazir leading-6 ${descFont}`}
                  >
                    به همه تمرین‌ها، مدیتیشن‌های حرفه‌ای و ابزارهای پیشرفته
                    دسترسی پیدا کن و سفر آرامش رو با قدرت بیشتری ادامه بده.
                  </Text>

                  {/* Price Tag */}
                  <View className="self-start mt-2">
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
                          {proPlan?.price} هزار تومان
                        </Text>
                        <Text
                          className={`text-white/70 font-vazir line-through text-sm`}
                        >
                          {proPlan?.oldPrice} هزار تومان
                        </Text>
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

              {/* Benefits Section - Only this has animations */}
              <View className={`${paddingX} mt-6`}>
                <VStack space="lg">
                  <Text className="text-primary-700 font-vazirBold text-right text-base">
                    🎁 مزایای ویژه Pro
                  </Text>
                  {features?.map((b, idx) => (
                    <Animated.View
                      key={idx}
                      entering={FadeInUp.duration(500)
                        .delay(idx * 150)
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

          {/* Bottom CTA */}
          <View className="mt-auto border-t border-gray-100 p-4">
            <VStack space="md">
              <TouchableOpacity
                onPress={() => handleSubscribe(proPlan?.id || "0")}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.9}
                disabled={isUpgrading || isLoading}
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
                    {isUpgrading ? (
                      <ButtonSpinner color="white" />
                    ) : (
                      <>
                        <Ionicons name="diamond" size={20} color="white" />
                        <Text className="text-white font-vazirBold text-base">
                          ارتقا به نسخه Pro
                        </Text>
                      </>
                    )}
                  </LinearGradient>
                </Animated.View>
              </TouchableOpacity>

              <Button
                variant="outline"
                onPress={onClose}
                className="border-gray-200 rounded-full"
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
        </SafeAreaView>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  skeletonTitle: {
    width: "70%",
    height: 28,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
    marginBottom: 12,
  },
  skeletonDesc: {
    width: "90%",
    height: 16,
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
    height: 40,
    borderRadius: 16,
    backgroundColor: "#e0e0e0",
    marginBottom: 20,
  },
  skeletonIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#e0e0e0",
  },
  skeletonFeature: {
    flex: 1,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
  },
});
