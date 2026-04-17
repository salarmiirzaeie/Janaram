import ProgressOnboarding from "@/components/auth/Pregoress-bar";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import useAuth from "@/hooks/useAuth";
import { useCustomToast } from "@/hooks/useToast";
import {
  useSendOTPMutation,
  useVerifyOTPMutation,
} from "@/services/auth/auth-adapter";
import { yupResolver } from "@hookform/resolvers/yup";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
} from "react-native";
import * as yup from "yup";

const schema = yup.object().shape({
  otp: yup
    .array()
    .of(yup.string().required("کد الزامی است"))
    .length(6, "کد باید ۶ رقمی باشد")
    .required(),
});

interface FormData {
  otp: string[];
  [key: string]: any;
}

const OTPForm = () => {
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<TextInput[]>([]);
  const toast = useCustomToast();
  const [verify, { isLoading }] = useVerifyOTPMutation();
  const [sendOTP, { isLoading: isLoadingOTP }] = useSendOTPMutation();
  const { setUser, setUserAuthorized } = useAuth();
  const { phoneNumber, otp } = useLocalSearchParams<{
    phoneNumber: string;
    otp: string;
  }>();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      otp: ["", "", "", "", "", ""],
    },
  });

  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes

  // ⏱ Countdown Timer
  useEffect(() => {
    if (timeLeft === 0) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  // 📬 Start SMS OTP Verification for Android
  useEffect(() => {
    const newOtp = otp.split("");
    setTimeout(() => {
      setOtpValues(newOtp);
      newOtp.forEach((digit, index) => {
        setValue(`otp.${index}`, digit);
      });
      handleSubmit(onSubmit)();
    }, 1000);
  }, []);

  const normalizePhoneNumber = (phoneNumber: string): string => {
    return phoneNumber.replace(/^(\+98|98|0)/, "").slice(-10);
  };

  const formatTime = (seconds: number) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const onChangeNumber = () => {
    router.back();
  };

  const onResendOTP = async () => {
    try {
      const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);
      const result = await sendOTP({
        phoneNumber: normalizedPhoneNumber,
      }).unwrap();

      if (result.success) {
        setTimeLeft(120);
        toast.show({ type: "success", msg: "کد جدید ارسال شد" });
      }
    } catch (err: any) {
      console.error("Error resending OTP:", err);
      toast.show({
        type: "error",
        msg: err.data?.message || "خطا در ارسال کد جدید",
      });
    }
  };

  const onSubmit = () => {
    verify({
      phoneNumber: normalizePhoneNumber(phoneNumber),
    })
      .unwrap()
      .then((res) => {
        if (res.success) {
          setUser({ accessToken: res.token });
          if (res.isNewUser) {
            router.push({
              pathname: "/auth/enter-name",
              params: { phoneNumber: normalizePhoneNumber(phoneNumber) },
            });
          } else {
            if (!res.isOnboardingSelected) {
              router.push({
                pathname: "/auth/robot-introduce",
                params: { phoneNumber: normalizePhoneNumber(phoneNumber) },
              });
            } else {
              setUserAuthorized(true);
            }
          }
        }
      })
      .catch((err) => {
        toast.show({
          type: "error",
          msg: err?.data?.message || "خطایی رخ داده است",
        });
      });
  };

  const handlePaste = (text: string, index: number) => {
    if (text.length > 1) {
      const newOtp = text.split("").slice(0, 6);
      setOtpValues(newOtp);
      newOtp.forEach((digit, i) => setValue(`otp.${i}`, digit));
      inputRefs.current[newOtp.length - 1]?.focus();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 p-4"
      >
        <ProgressOnboarding
          onBack={() => router.back()}
          currentStep={2}
          totalSteps={8}
        />

        <VStack className="w-full p-4">
          <Image
            source={require("@/assets/images/logo.png")}
            className="w-32 h-32 mx-auto mb-6"
            resizeMode="contain"
          />

          <VStack className="w-full">
            <Text
              className="text-3xl font-vazirBold text-primary-800 text-center mb-2"
              style={{ fontFamily: "vazirBold" }}
            >
              تایید شماره موبایل
            </Text>
            <Text
              className="text-base text-primary-600 text-center mb-2"
              style={{ fontFamily: "vazir" }}
            >
              کد برای شماره {phoneNumber} ارسال شده است
            </Text>
            <Text
              className="text-base text-primary-600 text-center mb-6"
              style={{ fontFamily: "vazir" }}
            >
              لطفا کدی که برای شما پیامک شده را وارد کنید
            </Text>

            {/* OTP Inputs */}
            <VStack className="mt-4 w-full">
              <HStack className="justify-between">
                {otpValues.map((_, index) => (
                  <Controller
                    key={index}
                    control={control}
                    name={`otp.${index}` as const}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        ref={(ref) => {
                          if (ref) inputRefs.current[index] = ref;
                        }}
                        className={`border w-14 h-14 text-center text-lg rounded-lg ${
                          errors.otp
                            ? "border-accent-500 bg-accent-100 text-accent-500"
                            : "border-primary-300 bg-white text-primary-500"
                        }`}
                        style={{ fontFamily: "vazir" }}
                        value={value || ""}
                        onChangeText={(text) => {
                          const newOtpValues = [...otpValues];
                          newOtpValues[index] = text.slice(0, 1);
                          setOtpValues(newOtpValues);
                          onChange(text.slice(0, 1));

                          if (text && index < otpValues.length - 1) {
                            inputRefs.current[index + 1]?.focus();
                          } else if (!text && index > 0) {
                            inputRefs.current[index - 1]?.focus();
                          }
                        }}
                        onChange={(e) => handlePaste(e.nativeEvent.text, index)}
                        keyboardType="numeric"
                        maxLength={1}
                        autoComplete="sms-otp"
                        textContentType="oneTimeCode"
                      />
                    )}
                  />
                ))}
              </HStack>

              {errors.otp && (
                <Text
                  className="text-accent-500 text-sm mt-1 text-right"
                  style={{ fontFamily: "vazir" }}
                >
                  {(errors.otp as any)?.message || "کد نامعتبر است"}
                </Text>
              )}

              <Text
                className="text-sm text-center mt-4 text-primary-600"
                style={{ fontFamily: "vazir" }}
              >
                {timeLeft > 0
                  ? `زمان باقی‌مانده: ${formatTime(timeLeft)}`
                  : "مهلت وارد کردن کد به پایان رسید"}
              </Text>

              <HStack className="mt-4 justify-between">
                <Button onPress={onChangeNumber} variant="link">
                  <ButtonText
                    className="text-secondary-500 text-sm underline"
                    style={{ fontFamily: "vazirBold" }}
                  >
                    تغییر شماره موبایل
                  </ButtonText>
                </Button>
                {timeLeft === 0 && (
                  <Button
                    onPress={onResendOTP}
                    variant="link"
                    disabled={isLoadingOTP}
                  >
                    <ButtonText
                      className="text-secondary-500 text-sm underline"
                      style={{ fontFamily: "vazirBold" }}
                    >
                      {isLoadingOTP ? (
                        <ButtonSpinner color={"white"} />
                      ) : (
                        "ارسال مجدد کد"
                      )}
                    </ButtonText>
                  </Button>
                )}
              </HStack>
            </VStack>

            {/* Submit Button */}
            <Button
              className="rounded-lg bg-primary-500 p-3 mt-4"
              onPress={handleSubmit(onSubmit)}
            >
              <ButtonText
                className="text-white text-base font-vazirBold"
                style={{ fontFamily: "vazirBold" }}
              >
                {isLoading ? <ButtonSpinner color={"white"} /> : "تایید کد"}
              </ButtonText>
            </Button>
          </VStack>
        </VStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OTPForm;
