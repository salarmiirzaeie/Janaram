import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import useAuth from "@/hooks/useAuth";
import { useCustomToast } from "@/hooks/useToast";
import { useGoogleLoginMutation, useSendOTPMutation } from "@/services/auth/auth-adapter";
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Image, KeyboardAvoidingView, Platform, SafeAreaView, StatusBar } from "react-native";
import OtpVerify from "react-native-otp-verify";
import * as yup from "yup";

const schema = yup.object().shape({
  phoneNumber: yup
    .string()
    .matches(/^(\+98|98|0)?9\d{9}$/, "شماره موبایل معتبر نیست")
    .required("وارد کردن شماره موبایل الزامی است"),
});

interface FormData {
  phoneNumber: string;
}

const Login: React.FC = () => {
  const [gLogin, { isLoading }] = useGoogleLoginMutation();
  const { setUser } = useAuth();
  const [sendOTP, { isLoading: isLoadingOTP }] = useSendOTPMutation();
  const toast = useCustomToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  const normalizePhoneNumber = (phoneNumber: string): string => {
    return phoneNumber.replace(/^(\+98|98|0)/, "").slice(-10);
  };

  const onSubmit = async (data: FormData) => {
    try {
      let appHash = null;
      if (Platform.OS === "android") {
        // Get the app hash
        const hash = await OtpVerify.getHash();
        appHash = hash[0]; // 11-character hash, e.g., "FA+9qCX9VSu"
      }

      // Send OTP request with phone number and app hash
      const normalizedPhoneNumber = normalizePhoneNumber(data.phoneNumber);
      const result = await sendOTP({
        phoneNumber: normalizedPhoneNumber,
        appHash: appHash || "", // Send null for iOS, hash for Android
      }).unwrap();

      if (result.success) {
        router.push({
          pathname: "/verifyOTP",
          params: {
            phoneNumber: data.phoneNumber,
          },
        });
      }
    } catch (err: any) {
      console.error("Error sending OTP:", err);
      toast.show({ type: "error", msg: err.data?.message || "خطا در درخواست کد" });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 py-10 px-4">
        <VStack className="w-full p-4">
          <Image source={require("@/assets/images/logo.png")} className="w-32 h-32 mx-auto mb-6" resizeMode="contain" />
          <VStack className="w-full">
            <Text className="text-3xl font-bold text-gray-800 text-center mb-2" style={{ fontFamily: "vazirBold" }}>
              خوش آمدید
            </Text>
            <Text className="text-base text-gray-600 text-center mb-8" style={{ fontFamily: "vazir" }}>
              برای ورود شماره موبایل خود را وارد کنید
            </Text>

            <Controller
              control={control}
              name="phoneNumber"
              render={({ field: { onChange, value } }) => (
                <VStack className="mb-4">
                  <Input
                    className={`border h-12 rounded-lg bg-white text-base text-gray-800 ${
                      errors.phoneNumber ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <InputField
                      autoFocus
                      placeholder="شماره موبایل را وارد کنید"
                      value={value}
                      onChangeText={onChange}
                      keyboardType="phone-pad"
                      autoCapitalize="none"
                      className="text-center"
                      style={{ fontFamily: "vazir" }}
                    />
                  </Input>
                  {errors.phoneNumber && (
                    <Text className="text-red-500 text-sm mt-1 text-right" style={{ fontFamily: "vazir" }}>
                      {errors.phoneNumber.message}
                    </Text>
                  )}
                </VStack>
              )}
            />

            <Button className="rounded-lg p-3 bg-primary-600 mt-4" onPress={handleSubmit(onSubmit)}>
              <ButtonText className="text-white text-base font-semibold" style={{ fontFamily: "vazirBold" }}>
                {isLoadingOTP ? <ButtonSpinner color={"white"} /> : "دریافت کد تایید"}
              </ButtonText>
            </Button>
          </VStack>
        </VStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
