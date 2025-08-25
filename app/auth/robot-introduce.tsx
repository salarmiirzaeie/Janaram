import ProgressOnboarding from "@/components/auth/Pregoress-bar";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet } from "react-native";

const PsychologistIntro = () => {
  const handleStartChat = () => {
    // Navigate to the chatbot interface
    router.push("/auth/mood-tracking");
  };

  return (
    <VStack className="flex-1 bg-white items-center p-4 justify-between">
      <ProgressOnboarding onBack={() => router.back()} currentStep={4} totalSteps={8} />

      <VStack space="md" className="flex-1 items-center justify-center">
        <Image
          source={require("@/assets/illustrations/robot.png")} // Cute robot illustration
          style={styles.robotImage}
        />
        <Text className="text-2xl font-semiBold  tracking-wide">با ربات روانشناس ما آشنا شو!</Text>
        <Text className="text-typography-400 text-center text-md px-4">
          من یک ربات روانشناس که همیشه آماده‌ام تا بهت گوش بدم و کمکت کنم احساس بهتری داشته باشی.هر وفت خواستی بیا با هم
          گپ بزنیم!
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

export default PsychologistIntro;
