import ProgressOnboarding from "@/components/auth/Pregoress-bar";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import useAuth from "@/hooks/useAuth";
import { useEditProfileMutation } from "@/services/auth/auth-adapter";
import { yupResolver } from "@hookform/resolvers/yup";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import { Image, KeyboardAvoidingView, Platform, SafeAreaView, Text } from "react-native";
import * as yup from "yup";

const schema = yup.object().shape({
  name: yup.string().required("وارد کردن نام الزامی است"),
  phoneNumber: yup
    .string()
    .required("وارد کردن شماره تلفن الزامی است")
    .matches(/^(\+98|0)?9\d{9}$/, "شماره تلفن نامعتبر است"),
  profilePhoto: yup.string().nullable().optional(),
});

interface FormData {
  name: string;
  phoneNumber: string;
  profilePhoto: string | null | undefined;
}

const resolver: Resolver<FormData> = yupResolver(schema) as Resolver<FormData>;

const EnterName = () => {
  const { phoneNumber: phoneNumberFromParams } = useLocalSearchParams<{ phoneNumber: string }>();
  const [updateProfile, { isLoading, error }] = useEditProfileMutation();
  const { setUserAuthorized } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver,
    defaultValues: {
      name: "",
      phoneNumber: phoneNumberFromParams || "",
      profilePhoto: null,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await updateProfile({
        name: data.name,
        phoneNumber: data.phoneNumber,
      }).unwrap();

      if (response.success) {
        router.push("/auth/robot-introduce");
      } else {
        throw new Error(response.message || "خطا در به‌روزرسانی پروفایل");
      }
    } catch (err: any) {
      console.error("Error updating profile:", err);
      alert(err.message || "خطای سرور");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 py-10 px-4">
        <ProgressOnboarding onBack={() => router.back()} currentStep={3} totalSteps={8} />

        <VStack className="w-full p-4">
          <Image source={require("@/assets/images/logo.png")} className="w-32 h-32 mx-auto mb-6" resizeMode="contain" />

          <VStack className="w-full">
            <Text
              className="text-3xl font-vazirBold text-primary-800 text-center mb-2"
              style={{ fontFamily: "vazirBold" }}
            >
              تکمیل پروفایل
            </Text>
            <Text className="text-base text-primary-600 text-center mb-8" style={{ fontFamily: "vazir" }}>
              لطفا نام خودتون رو وارد کنید
            </Text>

            {/* Name Input */}
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <VStack className="mb-4">
                  <Input
                    className={`border h-12 rounded-lg bg-white text-base text-primary-500 ${
                      errors.name ? "border-accent-500" : "border-primary-300"
                    }`}
                  >
                    <InputField
                      autoFocus
                      value={value}
                      onChangeText={onChange}
                      placeholder="نام"
                      autoCapitalize="words"
                      className="text-center"
                      style={{ fontFamily: "vazir" }}
                    />
                  </Input>
                  {errors.name && (
                    <Text className="text-accent-500 text-sm mt-1 text-right" style={{ fontFamily: "vazir" }}>
                      {errors.name.message}
                    </Text>
                  )}
                </VStack>
              )}
            />

            {/* API Error Message */}
            {error && (
              <Text className="text-accent-500 text-sm mb-4 text-center" style={{ fontFamily: "vazir" }}>
                {(error as any).data?.message || "خطا در به‌روزرسانی پروفایل"}
              </Text>
            )}

            {/* Submit Button */}
            <Button
              className="rounded-lg p-3 bg-primary-500 mt-4"
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              <ButtonText className="text-white text-base font-vazirBold" style={{ fontFamily: "vazirBold" }}>
                {isLoading ? <ButtonSpinner color="white" /> : "ثبت"}
              </ButtonText>
            </Button>
          </VStack>
        </VStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EnterName;
