import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useCustomToast } from "@/hooks/useToast";
import { usePlansQuery, useUpgradePlanMutation } from "@/services/upgrade/upgrade-adapter";
import { toPersianDigits } from "@/utils/persian";
import { useBazaar } from "@cafebazaar/react-native-poolakey";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, View } from "react-native";

export default function SubscriptionsScreen() {
  const bazaar = useBazaar(process.env.EXPO_PUBLIC_BAZAR_RSA_KEY || "");
  const [upgradePlan, { isLoading: isUpgrading }] = useUpgradePlanMutation();
  const { data: plans, isLoading } = usePlansQuery(null);
  const toast = useCustomToast();
  const handleSubscribe = async (id: string) => {
    if (id !== "free") {
      await bazaar
        .subscribeProduct(id)
        .then(() => {
          upgradePlan()
            .unwrap()
            .then((res) => {
              if (res.success) {
                toast.show({ msg: res.message, type: "success" });
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
    <ScrollView className="bg-gradient-to-b from-gray-50 to-gray-200 flex-1 p-6">
      <VStack className="mb-4 items-center">
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <Spinner />
          </View>
        ) : (
          <HStack space="lg" className="flex-row flex-wrap justify-center">
            {plans &&
              plans.data.plans.map((plan) => (
                <VStack
                  key={plan.name}
                  className={`bg-white rounded-3xl p-4 mx-4 shadow-2xl w-full sm:w-96  ${
                    plan.isActive ? "border-4 border-primary-500" : "border-2 border-gray-300"
                  }`}
                  style={{ direction: "rtl" }}
                >
                  {plan.isActive && <FontAwesome name="star" size={24} color="#facc15" />}

                  {plan.price !== 0 && (
                    <Text className="text-3xl font-medium text-primary-800 my-2">
                      {toPersianDigits(plan.price) + " "}تومان/ماه
                    </Text>
                  )}
                  <Text className="text-gray-600 text-base mb-6 leading-relaxed">{plan.description}</Text>
                  <VStack className="mb-4 ">
                    {plan.features.map((feature, index) => (
                      <HStack key={index} className="items-center mb-2 justify-between flex-row-reverse">
                        <Ionicons name="checkmark-circle" size={24} color="#34D399" />
                        <Text className="text-gray-800 text-right text-base mr-3 font-medium">{feature}</Text>
                      </HStack>
                    ))}
                  </VStack>
                  {plan.price !== 0 && (
                    <Button
                      className={`bg-primary-600 rounded-2xl  `}
                      onPress={() => {
                        handleSubscribe(plan.id);
                      }} // Replace with actual payment route
                    >
                      <ButtonText className="text-white text-lg font-bold">
                        {isUpgrading ? <ButtonSpinner /> : !plan.price ? "شروع رایگان" : " خرید اشتراک "}
                      </ButtonText>
                    </Button>
                  )}
                </VStack>
              ))}
          </HStack>
        )}
      </VStack>
      {/* <Divider className=" bg-gray-400 h-0.5" /> */}
      {/* <VStack className="items-center justify-center py-8">
        <HStack className="items-center flex-row-reverse">
          <Text className="text-gray-700 text-base font-medium" style={{ direction: "rtl" }}>
            سؤالی دارید؟{" "}
          </Text>
          <Pressable onPress={() => router.push("/contact")}>
            <Text className="text-primary-600 underline font-bold">با تیم پشتیبانی دوستانه ما تماس بگیرید! 😄</Text>
          </Pressable>
        </HStack>
      </VStack> */}
    </ScrollView>
  );
}
