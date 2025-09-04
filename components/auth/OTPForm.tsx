import useAuth from "@/hooks/useAuth";
import { useCustomToast } from "@/hooks/useToast";
import { useVerifyOTPMutation } from "@/services/auth/auth-adapter";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput } from "react-native";
import * as yup from "yup";
import { Button, ButtonSpinner, ButtonText } from "../ui/button";
import { HStack } from "../ui/hstack";
import { VStack } from "../ui/vstack";

const schema = yup.object().shape({
  otp: yup.array().of(yup.string().required("کد الزامی است")).min(4, "کد را کامل وارد کنید").required(),
});

interface FormData {
  otp: string[];
  [key: string]: any;
}

interface OTPFormProps {
  onChangeNumber: () => void;
  phoneNumber: string;
}

const OTPForm: React.FC<OTPFormProps> = ({ onChangeNumber, phoneNumber }) => {
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<TextInput[]>([]);
  const toast = useCustomToast();
  const [verify, { isLoading }] = useVerifyOTPMutation();
  const { setUser } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
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

  const formatTime = (seconds: number) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const onSubmit = (data: FormData) => {
    const otpCode = data.otp.join("");
    verify({ code: otpCode, phoneNumber: phoneNumber })
      .unwrap()
      .then((res) => {
        if (res.success) {
          setUser({ accessToken: res.token });
        }
      })
      .catch((err) => {
        toast.show({ type: "error", msg: err?.data?.message || "خطایی رخ داده است" });
      });
  };

  return (
    <VStack className="w-full">
      <Text className="text-3xl font-vazirBold text-gray-800 text-center mb-2" style={{ fontFamily: "vazirBold" }}>
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
                  keyboardType="numeric"
                  maxLength={1}
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

        <Button onPress={onChangeNumber} variant="link" className="mt-4 self-start">
          <ButtonText className="text-blue-600 text-sm underline" style={{ fontFamily: "vazirBold" }}>
            تغییر شماره موبایل
          </ButtonText>
        </Button>
      </VStack>

      <Button className="rounded-lg bg-primary-600 p-3 mt-4" onPress={handleSubmit(onSubmit)} disabled={timeLeft === 0}>
        <ButtonText className="text-white text-base font-vazirBold" style={{ fontFamily: "vazirBold" }}>
          {isLoading ? <ButtonSpinner color="white" /> : " تایید کد"}
        </ButtonText>
      </Button>
    </VStack>
  );
};

export default OTPForm;
