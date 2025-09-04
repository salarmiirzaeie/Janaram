import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAppSelector } from "@/hooks/useAppSelector";
import { setAuthorized } from "@/redux/auth/auth-slice";
import { usePersonalizeMutation } from "@/services/auth/auth-adapter";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
const Personalizing = () => {
  const animationRef = React.useRef(null);
  const dispatch = useDispatch();
  const [personalize, { isLoading }] = usePersonalizeMutation();
  const { goal, meditationTimer } = useAppSelector((state) => state.initialize);
  const handleStartChat = () => {
    // Navigate to the chatbot interface
    dispatch(setAuthorized(true));
    router.replace("/");
  };
  useEffect(() => {
    const timeout = setTimeout(() => {
      personalize({ goals: goal, meditationTime: meditationTimer })
        .unwrap()
        .then(() => {
          if (!isLoading) {
            handleStartChat();
          }
        });
    }, 4000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <VStack className="flex-1 bg-white items-center p-4 justify-between">
      {/* <ProgressOnboarding onBack={() => router.back()} currentStep={7} totalSteps={7} /> */}

      <VStack space="md" className="flex-1 items-center justify-center">
        <Text className="text-2xl font-vazirBold mb-8  tracking-wide"> در حال شخصی‌سازی</Text>
        <LottieView
          style={{ width: 260, height: 260 }}
          ref={animationRef}
          source={require("@/assets/animations/robot-meditation.json")} // Replace with your Lottie JSON file
          autoPlay
          loop // Enables looping
        />

        <Text className="text-typography-400 text-center text-md px-4"> با جانارام آرامشت رو پیدا کن </Text>
      </VStack>
      {/* <VStack className="w-full p-4">
        <Button onPress={handleStartChat} className="w-full  rounded-xl" size="xl">
          <ButtonText className="text-white font-vazirBold">ادامه</ButtonText>
        </Button>
      </VStack> */}
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

export default Personalizing;
