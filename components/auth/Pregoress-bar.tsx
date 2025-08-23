import { Center } from "@/components/ui/center";
import { Pressable } from "@/components/ui/pressable";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HStack } from "../ui/hstack";
import { VStack } from "../ui/vstack";

interface ProgressOnboardingProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void; // تابع برای بازگشت
  className?: string;
}

const ProgressOnboarding: React.FC<ProgressOnboardingProps> = ({ currentStep, totalSteps, onBack, className }) => {
  const insets = useSafeAreaInsets();
  // محاسبه درصد پیشرفت
  const progress = (currentStep / totalSteps) * 100;

  return (
    <VStack className="justify-center w-full">
      <HStack className="justify-between items-center w-full">
        <Pressable onPress={onBack} className="p-2">
          <AntDesign name="left" size={24} color="black" />
        </Pressable>
        <Center className="flex-1">
          <Progress value={progress} size="md" orientation="horizontal" className="w-full bg-gray-200 rounded-full">
            <ProgressFilledTrack className={className} />
          </Progress>
        </Center>
        <Pressable className="p-2" onPress={onBack} />
      </HStack>
    </VStack>
  );
};

export default ProgressOnboarding;
