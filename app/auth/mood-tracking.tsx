import ProgressOnboarding from "@/components/auth/Pregoress-bar";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet } from "react-native";

const MoodTrackingIntro = () => {
  const handleStartChat = () => {
    // Navigate to the chatbot interface
    router.push("/auth/goal-select");
  };

  return (
    <VStack className="flex-1 bg-white items-center p-4 justify-between">
      <ProgressOnboarding onBack={() => router.back()} currentStep={5} totalSteps={8} />

      <VStack space="md" className="flex-1 items-center justify-center">
        <Text className="text-2xl font-semiBold mb-8  tracking-wide"> ردیابی حال روحی </Text>

        <Image
          source={require("@/assets/images/mood-onboarding.png")} // Cute robot illustration
          style={styles.robotImage}
        />
        <Text className="text-typography-400 text-center text-md px-4">
          تو این بخش می‌تونی حال و روزت رو ببینی و باهاش آشنا شی! جانارام با ردیابی خلق‌وخو بهت کمک می‌کنه روندت رو
          بشناسی. می‌تونی حالتو ثبت کنی و پیشرفتتو دنبال کنی.
        </Text>
      </VStack>
      <VStack className="w-full p-4">
        <Button onPress={handleStartChat} className="w-full  rounded-xl" size="xl">
          <ButtonText className="text-white font-bold">ادامه</ButtonText>
        </Button>
      </VStack>
    </VStack>
  );
};

const styles = StyleSheet.create({
  robotImage: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
});

export default MoodTrackingIntro;
