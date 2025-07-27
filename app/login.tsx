import LoginForm from "@/components/auth/LoginForm";
import OTPForm from "@/components/auth/OTPForm";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import React from "react";
import { Dimensions, Image, KeyboardAvoidingView, Platform, SafeAreaView } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

const Login: React.FC = () => {
  const translateX = useSharedValue(0);
  const translateX2 = useSharedValue(32);

  const handleAnimation = () => {
    translateX.value = withTiming(-Dimensions.get("window").width, { duration: 300 });
    translateX2.value = withTiming(-Dimensions.get("window").width + 56, { duration: 300 });
  };

  const handleAnimation2 = () => {
    translateX.value = withTiming(0, { duration: 300 });
    translateX2.value = withTiming(32, { duration: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    width: "100%",
  }));

  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX2.value }],
    width: "100%",
  }));

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 py-10 px-4">
        <VStack className="w-full p-4">
          <Image source={require("@/assets/images/logo.png")} className="w-32 h-32 mx-auto mb-6" resizeMode="contain" />
          <HStack className="w-full">
            <Animated.View style={animatedStyle}>
              <LoginForm handleAnimate={handleAnimation} />
            </Animated.View>
            <Animated.View style={animatedStyle2}>
              <OTPForm onChangeNumber={handleAnimation2} />
            </Animated.View>
          </HStack>
        </VStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
