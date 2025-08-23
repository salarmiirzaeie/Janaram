import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { useAppSelector } from "@/hooks/useAppSelector";
import useAuth from "@/hooks/useAuth";
import { useCustomToast } from "@/hooks/useToast";
import { useSendOTPMutation, useVerifyOTPMutation } from "@/services/auth/auth-adapter";
import { yupResolver } from "@hookform/resolvers/yup";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Image, KeyboardAvoidingView, Platform, SafeAreaView, Text, TextInput } from "react-native";
import OtpVerify from "react-native-otp-verify";
import * as yup from "yup";

const schema = yup.object().shape({
  otp: yup.array().of(yup.string().required("کد الزامی است")).length(6, "کد باید ۶ رقمی باشد").required(),
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
  const { goal } = useAppSelector((state) => state.initialize);
  const { phoneNumber } = useLocalSearchParams<{ phoneNumber: string }>();
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

  // ⌨️ Auto focus first input on mount
  useEffect(() => {
    const timeout = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 300);
    return () => clearTimeout(timeout);
  }, []);

  // 📬 Start SMS OTP Verification for Android
  useEffect(() => {
    if (Platform.OS !== "android") return;

    OtpVerify.getOtp()
      .then(() =>
        OtpVerify.addListener((message: string) => {
          const otpMatch = message.match(/\d{6}/); // For 6-digit OTP
          if (otpMatch) {
            const otp = otpMatch[0].split("");
            setOtpValues(otp);
            otp.forEach((digit, index) => {
              setValue(`otp.${index}`, digit);
            });
            inputRefs.current[otp.length - 1]?.focus();
            OtpVerify.removeListener();

            // Auto-submit the form after setting OTP
            handleSubmit(onSubmit)();
          }
        })
      )
      .catch((error: any) => {
        console.error("Error starting OTP verification:", error);
        toast.show({ type: "error", msg: "خطا در خواندن پیامک" });
      });

    return () => {
      OtpVerify.removeListener();
    };
  }, [setValue, toast, handleSubmit]);

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
      let appHash = null;
      if (Platform.OS === "android") {
        const hash = await OtpVerify.getHash();
        appHash = hash[0]; // 11-character hash, e.g., "FA+9qCX9VSu"
      }

      const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);
      const result = await sendOTP({
        phoneNumber: normalizedPhoneNumber,
        appHash: appHash || "", // Send null for iOS, hash for Android
      }).unwrap();

      if (result.success) {
        setTimeLeft(120); // Reset timer
        toast.show({ type: "success", msg: "کد جدید ارسال شد" });
      }
    } catch (err: any) {
      console.error("Error resending OTP:", err);
      toast.show({ type: "error", msg: err.data?.message || "خطا در ارسال کد جدید" });
    }
  };

  const onSubmit = (data: FormData) => {
    const otpCode = data.otp.join("");
    verify({ code: otpCode, phoneNumber: normalizePhoneNumber(phoneNumber), goals: goal })
      .unwrap()
      .then((res) => {
        if (res.success) {
          if (res.isNewUser) {
            setUser({ accessToken: res.token });
            router.push({
              pathname: "/auth/enter-name",
              params: {
                phoneNumber: normalizePhoneNumber(phoneNumber),
              },
            });
          } else {
            setUser({ accessToken: res.token });
            setUserAuthorized(true);
          }
          // setUser({ accessToken: res.token });
        }
      })
      .catch((err) => {
        toast.show({ type: "error", msg: err?.data?.message || "خطایی رخ داده است" });
      });
  };

  // Handle paste behavior
  const handlePaste = (text: string, index: number) => {
    if (text.length > 1) {
      const newOtp = text.split("").slice(0, 6); // Assuming 6-digit OTP
      setOtpValues(newOtp);
      newOtp.forEach((digit, i) => {
        setValue(`otp.${i}`, digit);
      });
      inputRefs.current[newOtp.length - 1]?.focus();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 py-10 px-4">
        <VStack className="w-full p-4">
          <Image source={require("@/assets/images/logo.png")} className="w-32 h-32 mx-auto mb-6" resizeMode="contain" />
          <VStack className="w-full">
            <Text className="text-3xl font-bold text-gray-800 text-center mb-2" style={{ fontFamily: "vazirBold" }}>
              تایید شماره موبایل
            </Text>
            <Text className="text-base text-gray-600 text-center mb-2" style={{ fontFamily: "vazir" }}>
              کد برای شماره {phoneNumber} ارسال شده است
            </Text>
            <Text className="text-base text-gray-600 text-center mb-6" style={{ fontFamily: "vazir" }}>
              لطفا کدی که برای شما پیامک شده را وارد کنید
            </Text>

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
                        className={`border w-14 h-14 text-center text-lg text-gray-800 rounded-lg bg-white ${
                          errors.otp ? "border-red-500" : "border-gray-300"
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
                        autoComplete="sms-otp" // For Android AutoFill
                        textContentType="oneTimeCode" // For iOS AutoFill
                      />
                    )}
                  />
                ))}
              </HStack>

              {errors.otp && (
                <Text className="text-red-500 text-sm mt-1 text-right" style={{ fontFamily: "vazir" }}>
                  {(errors.otp as any)?.message || "کد نامعتبر است"}
                </Text>
              )}

              <Text className="text-sm text-center mt-4 text-gray-600" style={{ fontFamily: "vazir" }}>
                {timeLeft > 0 ? `زمان باقی‌مانده: ${formatTime(timeLeft)}` : "مهلت وارد کردن کد به پایان رسید"}
              </Text>

              <HStack className="mt-4 justify-between">
                <Button onPress={onChangeNumber} variant="link">
                  <ButtonText className="text-blue-600 text-sm underline" style={{ fontFamily: "vazirBold" }}>
                    تغییر شماره موبایل
                  </ButtonText>
                </Button>
                {timeLeft === 0 && (
                  <Button onPress={onResendOTP} variant="link" disabled={isLoadingOTP}>
                    <ButtonText className="text-blue-600 text-sm underline" style={{ fontFamily: "vazirBold" }}>
                      {isLoadingOTP ? <ButtonSpinner color={"white"} /> : "ارسال مجدد کد"}
                    </ButtonText>
                  </Button>
                )}
              </HStack>
            </VStack>

            <Button className="rounded-lg bg-primary-600 p-3 mt-4" onPress={handleSubmit(onSubmit)}>
              <ButtonText className="text-white text-base font-semibold" style={{ fontFamily: "vazirBold" }}>
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
