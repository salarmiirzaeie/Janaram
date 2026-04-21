import ProgressOnboarding from "@/components/auth/Pregoress-bar";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import useAuth from "@/hooks/useAuth";
import { useCustomToast } from "@/hooks/useToast";
import {
  useGoogleLoginMutation,
  useSendOTPMutation,
} from "@/services/auth/auth-adapter";
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Image, KeyboardAvoidingView, Platform } from "react-native";
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
      const normalizedPhoneNumber = normalizePhoneNumber(data.phoneNumber);
      const result = await sendOTP({
        phoneNumber: normalizedPhoneNumber,
      }).unwrap();
      if (result.success) {
        router.push({
          pathname: "/auth/verifyOTP",
          params: {
            phoneNumber: data.phoneNumber,
            otp: result.data.otp,
          },
        });
      }
    } catch (err: any) {
      console.error("Error sending OTP:", err);
      toast.show({
        type: "error",
        msg: err.data?.message || "خطا در درخواست کد",
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 p-4"
    >
      <ProgressOnboarding
        onBack={() => router.back()}
        currentStep={1}
        totalSteps={8}
      />
      <VStack className="w-full p-4">
        <Image
          source={require("@/assets/images/logo.png")}
          className="w-32 h-32 mx-auto mb-6"
          resizeMode="contain"
        />

        <VStack className="w-full">
          <Text className="text-3xl font-vazirBold text-primary-800 text-center mb-2">
            خوش آمدید
          </Text>
          <Text className="text-base font-vazir text-primary-600 text-center mb-8">
            برای ورود شماره موبایل خود را وارد کنید
          </Text>

          <Controller
            control={control}
            name="phoneNumber"
            render={({ field: { onChange, value } }) => (
              <VStack className="mb-4">
                <Input
                  className={`border h-12 rounded-lg bg-white text-base text-primary-800 ${
                    errors.phoneNumber ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <InputField
                    textContentType="oneTimeCode"
                    autoFocus
                    placeholder="شماره موبایل را وارد کنید"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                    className="text-right font-vazir"
                  />
                </Input>
                {errors.phoneNumber && (
                  <Text className="text-red-500 text-sm mt-1 text-right font-vazir">
                    {errors.phoneNumber.message}
                  </Text>
                )}
              </VStack>
            )}
          />

          <Button
            className="rounded-lg p-3 bg-primary-500 mt-4"
            onPress={handleSubmit(onSubmit)}
          >
            {isLoadingOTP ? (
              <ButtonSpinner color="white" />
            ) : (
              <ButtonText className="text-white text-base font-vazirBold">
                دریافت کد تایید
              </ButtonText>
            )}
          </Button>
        </VStack>
      </VStack>
    </KeyboardAvoidingView>
  );
};

export default Login;
