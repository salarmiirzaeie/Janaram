import { yupResolver } from "@hookform/resolvers/yup";
import { GoogleSignin, GoogleSigninButton } from "@react-native-google-signin/google-signin";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Text } from "react-native";
import * as yup from "yup";
import { Button, ButtonText } from "../ui/button";
import { Divider } from "../ui/divider";
import { HStack } from "../ui/hstack";
import { Input, InputField } from "../ui/input";
import { VStack } from "../ui/vstack";

const schema = yup.object().shape({
  phoneNumber: yup
    .string()
    .matches(/^(\+98|98|0)?9\d{9}$/, "شماره موبایل معتبر نیست")
    .required("وارد کردن شماره موبایل الزامی است"),
});

interface FormData {
  phoneNumber: string;
}

interface OTPFormProps {
  handleAnimate: () => void;
}

const LoginForm: React.FC<OTPFormProps> = ({ handleAnimate }) => {
  async function signInWithGoogle() {
    try {
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo);

      const idToken = userInfo.data?.idToken;
      if (!idToken) throw new Error("توکنی دریافت نشد");

      const res = await fetch("http://192.168.39.130:3000/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: idToken }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`خطای سرور: ${res.status} - ${errorText}`);
      }

      const data = await res.json();
      console.log("کاربر وارد شده:", data);
    } catch (error) {
      console.error("خطا در ورود با گوگل:", error);
    }
  }

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

  const onSubmit = (data: FormData) => {
    console.log("فرم ارسال شد");
    handleAnimate();
  };

  return (
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
                placeholder="شماره موبایل را وارد کنید"
                value={value}
                onChangeText={onChange}
                keyboardType="phone-pad"
                autoCapitalize="none"
                className=" text-center"
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

      <Button className=" rounded-lg p-3 mt-4" onPress={handleSubmit(onSubmit)}>
        <ButtonText className="text-white text-base font-semibold" style={{ fontFamily: "vazirBold" }}>
          دریافت کد تایید
        </ButtonText>
      </Button>

      <HStack className="items-center w-full my-6">
        <Divider className="flex-1 bg-gray-300 h-px" />
        <Text className="text-gray-600 mx-4" style={{ fontFamily: "vazir" }}>
          یا
        </Text>
        <Divider className="flex-1 bg-gray-300 h-px" />
      </HStack>

      <VStack className="w-full">
        <GoogleSigninButton style={{ width: "100%", height: 48, marginBottom: 16 }} onPress={signInWithGoogle} />
      </VStack>
    </VStack>
  );
};

export default LoginForm;
