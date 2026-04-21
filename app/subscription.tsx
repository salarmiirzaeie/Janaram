import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useCustomToast } from "@/hooks/useToast";
import {
  usePlansQuery,
  useUpgradePlanMutation,
} from "@/services/upgrade/upgrade-adapter";
import { toPersianDigits } from "@/utils/persian";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, View } from "react-native";

export default function SubscriptionsScreen() {
  // const bazaar = useBazaar(process.env.EXPO_PUBLIC_BAZAR_RSA_KEY || "");
  const [upgradePlan, { isLoading: isUpgrading }] = useUpgradePlanMutation();
  const { data: plans, isLoading } = usePlansQuery(null);
  const toast = useCustomToast();
  const handleSubscribe = async (id: string) => {
    if (id !== "0") {
      // await bazaar
      //   .subscribeProduct(id)
      //   .then(() => {
      //     upgradePlan({ id })
      //       .unwrap()
      //       .then((res) => {
      //         if (res.success) {
      //           toast.show({ msg: res.message, type: "success" });
      //         }
      //       });
      //   })
      //   .catch((e) => {
      //     console.log(e);
      //   });
    } else {
      toast.show({ msg: "پلن رایگان برای شما فعال شد", type: "success" });
    }
  };
  return (
    <ScrollView className="bg-gradient-to-b from-gray-50 to-gray-200 flex-1 mb-4 p-6">
      <VStack className="mb-4 pb-4 items-center">
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <Spinner />
          </View>
        ) : (
          <HStack space="lg" className="flex-row flex-wrap justify-center">
            {plans &&
              plans.data.plans.map((plan, index) => {
                const color = index % 2 === 0 ? "primary-500" : "secondary-500";
                return (
                  <VStack
                    key={plan.id}
                    className={`bg-white rounded-3xl p-4 mx-4 shadow-md w-full sm:w-96 ${
                      plan.isActive
                        ? `border-4 border-${color}`
                        : "border-2 border-gray-300"
                    }`}
                    style={{ direction: "rtl" }}
                  >
                    {plan.isActive && (
                      <FontAwesome name="star" size={24} color="#facc15" />
                    )}

                    <Text className="text-gray-600 text-xl mb-6 font-vazirBold leading-relaxed">
                      {plan.description}
                    </Text>

                    <VStack>
                      {plan.features.map((feature, i) => (
                        <HStack
                          key={i}
                          className="items-center mb-2 justify-between flex-row-reverse"
                        >
                          <Ionicons
                            name="checkmark-circle"
                            size={24}
                            color={
                              color === "primary-500" ? "#1E88E5" : "#ad46ff"
                            }
                          />
                          <Text className="text-gray-800 text-right text-sm mr-3 font-vazir">
                            {feature}
                          </Text>
                        </HStack>
                      ))}
                    </VStack>

                    {plan.price !== 0 && (
                      <Text
                        className={`text-lg self-end font-vazirBold my-2 text-${color}`}
                      >
                        {toPersianDigits(plan.price)} هزار تومان
                      </Text>
                    )}

                    {plan.price !== 0 && (
                      <Button
                        className={`bg-${color} rounded-2xl`}
                        onPress={() => handleSubscribe(plan.id)}
                      >
                        <ButtonText className="text-white text-lg font-vazirBold">
                          {!plan.price ? "شروع رایگان" : "خرید اشتراک"}
                        </ButtonText>
                      </Button>
                    )}
                  </VStack>
                );
              })}
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
