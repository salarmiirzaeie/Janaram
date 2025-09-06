import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useCustomToast } from "@/hooks/useToast";
import { usePlansQuery, useUpgradePlanMutation } from "@/services/upgrade/upgrade-adapter";
import { useBazaar } from "@cafebazaar/react-native-poolakey";
import { AntDesign } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Image, Modal, Pressable, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type ProPlanModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function ProPlanFullScreenModal({ visible, onClose }: ProPlanModalProps) {
  useEffect(() => {
    if (visible) StatusBar.setBarStyle("dark-content");
  }, [visible]);

  const { data: plans, isLoading } = usePlansQuery(null);
  const bazaar = useBazaar(process.env.EXPO_PUBLIC_BAZAR_RSA_KEY || "");
  const [upgradePlan, { isLoading: isUpgrading }] = useUpgradePlanMutation();
  const proPlan = plans?.data.plans?.find((plan) => plan.name === "unlimited");
  const features = proPlan?.features;
  const toast = useCustomToast();

  const handleSubscribe = async (id: string) => {
    if (id !== "0") {
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
        .catch((e) => {
          console.log(e);
        });
    } else {
      toast.show({ msg: "پلن رایگان برای شما فعال شد", type: "success" });
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-white">
        {/* Header */}
        <View className="pt-4 pb-6 px-5">
          <HStack className="items-center justify-start">
            <Pressable onPress={onClose} hitSlop={10} className="rounded-full ">
              <AntDesign name="close" size={24} color="black" />
            </Pressable>
          </HStack>
        </View>

        {isLoading ? (
          // ---------------------- LOADING STATE ----------------------
          <VStack space="md" className="px-6">
            <View style={styles.skeletonTitle} />
            <View style={styles.skeletonDesc} />
            <View className="items-center">
              <View style={styles.skeletonHero} />
            </View>
            <View style={styles.skeletonPrice} />
            <VStack className="mt-8" space="lg">
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
            <VStack space="md" className="px-6">
              <Text className="text-3xl font-vazirBold text-right text-indigo-800">آرامش عمیق‌تر با Pro</Text>
              <Text className="text-gray-600 text-right font-vazir leading-6">
                به همه تمرین‌ها، راهنمای صوتی و ابزارهای حرفه‌ای دسترسی پیدا کن و سفرت به سمت آرامش رو جدی‌تر ادامه بده.
              </Text>

              <View className="items-center ">
                <Image
                  source={require("@/assets/illustrations/Upgrading.png")}
                  resizeMode="contain"
                  className="w-64 h-64"
                />
              </View>

              <View className="self-start mt-2 bg-indigo-100 rounded-full px-5 py-2 flex-row items-center space-x-2">
                <Text className="text-indigo-700 text-lg font-vazirBold">{proPlan?.price} هزار تومان / ماهانه</Text>
                <Text className="text-indigo-400 text-lg font-vazir line-through ml-2">
                  {proPlan?.oldPrice} هزار تومان
                </Text>
              </View>
            </VStack>

            {/* Benefits */}
            <VStack className="px-6 mt-8" space="lg">
              {features?.map((b, idx) => (
                <HStack key={idx} space="md" className="items-start">
                  <AntDesign name="checkcircle" size={20} color="#22c55e" />
                  <VStack space="xs" className="flex-1">
                    <Text className="text-right font-vazirBold text-base text-gray-800">{b}</Text>
                  </VStack>
                </HStack>
              ))}
            </VStack>
          </>
        )}

        {/* Bottom CTA */}
        <View className="absolute left-0 right-0 bottom-0 bg-white/95 border-t border-gray-200 p-4">
          <VStack space="md">
            <Button onPress={() => handleSubscribe(proPlan?.id || "0")} isDisabled={isUpgrading || isLoading}>
              <ButtonText className="text-white">ارتقا به Pro</ButtonText>
              {isUpgrading && <ButtonSpinner color="white" />}
            </Button>
            <Button variant="outline" onPress={onClose} className="border-gray-300">
              <ButtonText className="text-gray-700">ادامه با نسخه رایگان</ButtonText>
            </Button>
            <Text className="text-center text-gray-500 text-xs">با ادامه، با قوانین و حریم خصوصی موافقم</Text>
          </VStack>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // Skeleton styles
  skeletonTitle: {
    width: "70%",
    height: 28,
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
    marginBottom: 8,
  },
  skeletonDesc: {
    width: "90%",
    height: 16,
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
    marginBottom: 20,
  },
  skeletonHero: {
    width: 240,
    height: 240,
    borderRadius: 16,
    backgroundColor: "#e0e0e0",
    marginBottom: 20,
  },
  skeletonPrice: {
    width: "60%",
    height: 22,
    borderRadius: 12,
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
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
  },
});
