import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useCustomToast } from "@/hooks/useToast";
import {
  usePlansQuery,
  useUpgradePlanMutation,
} from "@/services/upgrade/upgrade-adapter";
import { AntDesign } from "@expo/vector-icons";
import { useMyket } from "iab-myket-reactnative/src/index";
import React, { useEffect } from "react";

import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type ProPlanModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function ProPlanFullScreenModal({
  visible,
  onClose,
}: ProPlanModalProps) {
  const screenHeight = Dimensions.get("window").height;
  // Decide layout sizes
  const isSmall = screenHeight < 700;
  const heroSize = isSmall ? 160 : 240;
  const titleFont = isSmall ? "text-2xl" : "text-3xl";
  const descFont = isSmall ? "text-sm" : "text-base";
  const priceFont = isSmall ? "text-base" : "text-lg";
  const paddingX = isSmall ? "px-4" : "px-6";
  useEffect(() => {
    if (visible) StatusBar.setBarStyle("dark-content");
  }, [visible]);

  const { data: plans, isLoading } = usePlansQuery(null);
  const [upgradePlan, { isLoading: isUpgrading }] = useUpgradePlanMutation();
  const proPlan = plans?.data.plans?.find((plan) => plan.name === "unlimited");
  const features = proPlan?.features;
  const toast = useCustomToast();
  const myketInstance = useMyket(process.env.EXPO_PUBLIC_MYKET_BILING_KEY);

  const handleSubscribe = async (id: string) => {
    if (id !== "0") {
      try {
        await myketInstance.connect(process.env.EXPO_PUBLIC_MYKET_BILING_KEY);

        const inventory = await myketInstance.queryPurchaseProduct(true, [id]);
        console.log("Inventory: ", JSON.stringify(inventory));

        const purchase = await myketInstance.purchaseProduct(id, null);
        const res = await upgradePlan({ id }).unwrap();
        if (res.success) {
          toast.show({ msg: res.message, type: "success" });
          onClose();
        }
      } catch (error: any) {
        toast.show({ msg: error.data.message, type: "error" });
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
      <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-white">
        {/* Header */}
        <View className="pb-6 px-5">
          <HStack className="items-center justify-start">
            <Pressable onPress={onClose} hitSlop={10} className="rounded-full">
              <AntDesign name="close" size={24} color="black" />
            </Pressable>
          </HStack>
        </View>

        {isLoading ? (
          // ---------------------- LOADING STATE ----------------------
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
          // ---------------------- REAL CONTENT ----------------------
          <>
            {/* Hero */}
            <VStack space="sm" className={`${paddingX}`}>
              <Text
                className={`${titleFont} font-vazirBold text-right text-indigo-800`}
              >
                آرامش عمیق‌تر با Pro
              </Text>
              <Text
                className={`text-gray-600 text-right font-vazir leading-6 ${descFont}`}
              >
                به همه تمرین‌ها، راهنمای صوتی و ابزارهای حرفه‌ای دسترسی پیدا کن
                و سفرت به سمت آرامش رو جدی‌تر ادامه بده.
              </Text>

              <View className="items-center mt-2">
                <Image
                  source={require("@/assets/illustrations/Upgrading.png")}
                  resizeMode="contain"
                  style={{ width: heroSize, height: heroSize }}
                />
              </View>

              <View className="self-start mt-2 bg-indigo-100 rounded-full px-4 py-1.5 flex-row items-center space-x-2">
                <Text className={`text-indigo-700 font-vazirBold ${priceFont}`}>
                  {proPlan?.price} هزار تومان / ماهانه
                </Text>
                <Text
                  className={`text-indigo-400 font-vazir line-through ml-2 ${priceFont}`}
                >
                  {proPlan?.oldPrice} هزار تومان
                </Text>
              </View>
            </VStack>

            {/* Benefits */}
            <VStack className={`${paddingX} mt-4`} space="md">
              {features?.map((b, idx) => (
                <HStack key={idx} space="sm" className="items-start">
                  <AntDesign
                    name="check-circle"
                    size={isSmall ? 16 : 20}
                    color="#22c55e"
                  />
                  <VStack space="xs" className="flex-1">
                    <Text
                      className={`text-right font-vazirBold ${descFont} text-gray-800`}
                    >
                      {b}
                    </Text>
                  </VStack>
                </HStack>
              ))}
            </VStack>
          </>
        )}

        {/* Bottom CTA */}
        <View className="mt-auto bg-white/95 border-t border-gray-200 p-4">
          <VStack space="md">
            <Button
              onPress={() => handleSubscribe(proPlan?.id || "0")}
              isDisabled={isUpgrading || isLoading}
            >
              <ButtonText className="text-white">ارتقا به Pro</ButtonText>
              {isUpgrading && <ButtonSpinner color="white" />}
            </Button>
            <Button
              variant="outline"
              onPress={onClose}
              className="border-gray-300"
            >
              <ButtonText className="text-gray-700">
                ادامه با نسخه رایگان
              </ButtonText>
            </Button>
            <Text className="text-center text-gray-500 text-xs">
              با ادامه، با قوانین و حریم خصوصی موافقم
            </Text>
          </VStack>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  skeletonTitle: {
    width: "70%",
    height: 24,
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
    marginBottom: 8,
  },
  skeletonDesc: {
    width: "90%",
    height: 14,
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
    marginBottom: 16,
  },
  skeletonHero: {
    borderRadius: 16,
    backgroundColor: "#e0e0e0",
    marginBottom: 16,
  },
  skeletonPrice: {
    width: "60%",
    height: 20,
    borderRadius: 12,
    backgroundColor: "#e0e0e0",
    marginBottom: 16,
  },
  skeletonIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
  },
  skeletonFeature: {
    flex: 1,
    height: 14,
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
  },
});
