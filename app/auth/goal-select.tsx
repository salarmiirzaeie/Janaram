import ProgressOnboarding from "@/components/auth/Pregoress-bar";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useCustomToast } from "@/hooks/useToast";
import { setGoal } from "@/redux/intialize/initialize-slice";
import { router } from "expo-router";
import React, { useState } from "react";
import { FlatList, Image } from "react-native";
import { useDispatch } from "react-redux";

const GoalSelection = () => {
  const dispatch = useDispatch();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const goals: { id: string; label: string }[] = [
    { id: "calm", label: "آرامش روزانه" },
    { id: "stress", label: "مدیریت استرس" },
    { id: "sleep", label: "بهبود خواب" },
    { id: "focus", label: "افزایش تمرکز" },
    { id: "confidence", label: "تقویت عزت‌نفس" },
    { id: "control", label: "کنترل احساسات" },
  ];
  const toast = useCustomToast();
  const handleGoalToggle = (goalId: string) => {
    setSelectedGoals((prev) => (prev.includes(goalId) ? prev.filter((id) => id !== goalId) : [...prev, goalId]));
  };

  const handleNext = () => {
    // منطق بعدی (مثلاً ذخیره انتخاب‌ها و رفتن به صفحه بعد)
    if (selectedGoals.length < 2) {
      toast.show({ msg: "لطفا حداقل دو مورد انتخاب کنید", type: "error" });
      return;
    }
    dispatch(setGoal(selectedGoals));

    router.push("/auth/select-time");
  };

  return (
    <VStack className="flex-1 bg-white items-center p-4  justify-between">
      <ProgressOnboarding onBack={() => router.back()} currentStep={6} totalSteps={8} />
      <VStack space="md" className="flex-1 items-center justify-center">
        {/* <Image
          source={require("@/assets/illustrations/GoalSelection.png")} // تصویر سفارشی اضافه کن
          className="h-40 mb-16 w-56"
        /> */}
        <Text className="text-2xl font-semiBold">هدفت چیه؟ </Text>
        <Text className="text-typography-400 text-center text-md">{"بگو دنبال چی هستی تا برات شخصی‌سازی کنیم!"}</Text>
        <Text className="text-typography-400 text-center text-sm">{"(حداقل ۲ مورد)"}</Text>
        <VStack space="sm" className="w-full mt-6 items-center">
          <Image source={require("@/assets/illustrations/Teamwork.png")} className="h-40 mb-16 w-40" />

          <FlatList
            data={goals}
            numColumns={2}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable onPress={() => handleGoalToggle(item.id)}>
                <HStack
                  key={item.id}
                  className={`p-4 rounded-lg m-2  w-40 items-center justify-center ${
                    selectedGoals.includes(item.id) ? "bg-[#6B7280] bg-opacity-20" : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={`text-md ${
                      selectedGoals.includes(item.id) ? "text-white" : "text-typography-600 text-right"
                    }`}
                  >
                    {item.label}
                  </Text>
                </HStack>
              </Pressable>
            )}
          />
        </VStack>
      </VStack>
      <VStack className="w-full p-4">
        <Button onPress={handleNext} className="w-full " size="xl">
          <ButtonText>ادامه</ButtonText>
        </Button>
      </VStack>
    </VStack>
  );
};

export default GoalSelection;
