import { Button, ButtonText } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView } from "react-native";

// Define the subscription plans data
interface Plan {
  name: string;
  price: number;
  description: string;
  features: string[];
  isHighlighted?: boolean;
  bgColor: string;
  buttonColor: string;
}

const plans: Plan[] = [
  {
    name: "رایگان",
    price: 0,
    description: "مناسب برای شروع با ویژگی‌های پایه!",
    features: ["دسترسی به ویژگی‌های اصلی", "سهمیه استفاده محدود", "پشتیبانی جامعه کاربران"],
    bgColor: "bg-blue-100",
    buttonColor: "bg-blue-600 ",
    isHighlighted: true,
  },
  {
    name: "نامحدود",
    price: 100000,
    description: "دسترسی نامحدود به ویژگی‌های پیشرفته!",
    features: [
      "تمام ویژگی‌های طرح رایگان",
      "سهمیه استفاده نامحدود",
      "پشتیبانی اولویت‌دار از طریق ایمیل",
      "تحلیل‌های پیشرفته",
    ],
    bgColor: "bg-green-100",
    buttonColor: "bg-green-600 ",
  },
  {
    name: "نامحدود پلاس",
    price: 200000,
    description: "ویژگی‌های ممتاز برای کاربران حرفه‌ای!",
    features: [
      "تمام ویژگی‌های طرح نامحدود",
      "دسترسی به محتوای انحصاری",
      "پشتیبانی تلفنی ۲۴/۷",
      "یکپارچه‌سازی‌های سفارشی",
    ],
    bgColor: "bg-purple-100",
    buttonColor: "bg-purple-600",
  },
];

export default function SubscriptionsScreen() {
  return (
    <ScrollView className="bg-gradient-to-b from-gray-50 to-gray-200 flex-1 p-6">
      <VStack className="mb-4 items-center">
        <HStack space="lg" className="flex-row flex-wrap justify-center">
          {plans.map((plan) => (
            <VStack
              key={plan.name}
              className={`${plan.bgColor} rounded-3xl p-4 mx-4 shadow-2xl w-full sm:w-96  ${
                plan.isHighlighted ? "border-4 border-primary-500" : "border-2 border-gray-300"
              }`}
              style={{ direction: "rtl" }}
            >
              {/* <HStack className="items-center justify-between mb-4 flex-row-reverse">
                <Text
                  className={`text-2xl font-bold text-right ${
                    plan.isHighlighted ? "text-primary-600" : "text-gray-900"
                  }`}
                >
                  {plan.name}
                </Text>
                {plan.isHighlighted && <Ionicons name="checkmark-circle" size={28} color="#FCD34D" />}
              </HStack> */}
              {plan.price !== 0 && (
                <Text className="text-3xl font-medium text-primary-800 my-2">{plan.price}تومان/ماه</Text>
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
              <Button
                className={`${plan.buttonColor} rounded-2xl  `}
                onPress={() => router.push("/(tabs)/setting/pay")} // Replace with actual payment route
              >
                <ButtonText className="text-white text-lg font-bold">
                  {plan.name === "رایگان" ? "شروع رایگان" : "اکنون اشتراک کنید"}
                </ButtonText>
              </Button>
            </VStack>
          ))}
        </HStack>
      </VStack>
      <Divider className=" bg-gray-400 h-0.5" />
      <VStack className="items-center justify-center py-8">
        <HStack className="items-center flex-row-reverse">
          <Text className="text-gray-700 text-base font-medium" style={{ direction: "rtl" }}>
            سؤالی دارید؟{" "}
          </Text>
          <Pressable onPress={() => router.push("/contact")}>
            <Text className="text-primary-600 underline font-bold">با تیم پشتیبانی دوستانه ما تماس بگیرید! 😄</Text>
          </Pressable>
        </HStack>
      </VStack>
    </ScrollView>
  );
}
