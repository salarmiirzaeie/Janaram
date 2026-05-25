import { router } from "expo-router";
import React from "react";

import { ButtonSpinner } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useCustomToast } from "@/hooks/useToast";
import {
  useEditProfileMutation,
  useProfileQuery,
} from "@/services/auth/auth-adapter";
import { Feather } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
import Animated, { FadeInUp } from "react-native-reanimated";
import * as Yup from "yup";

// Validation schema with Yup
const profileSchema = Yup.object().shape({
  name: Yup.string()
    .required("نام الزامی است")
    .min(2, "نام باید حداقل ۲ کاراکتر باشد")
    .max(50, "نام نباید بیشتر از ۵۰ کاراکتر باشد"),
  phoneNumber: Yup.string()
    .required("شماره موبایل الزامی است")
    .matches(/^(\+98|0)?9\d{9}$/, "شماره موبایل معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹"),
  baleId: Yup.string()
    .nullable()
    .optional()
    .matches(
      /^@?[a-zA-Z0-9_]{3,32}$/,
      "آیدی بله معتبر نیست (مثال: @username یا username"
    ),
});

type FormData = {
  name: string;
  phoneNumber: string;
  baleId?: string | null;
};

const EditProfile = () => {
  const { data, isLoading } = useProfileQuery(null);
  const [updateProfile, { isLoading: isUpdating }] = useEditProfileMutation();
  const toast = useCustomToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: data?.data.name || "",
      phoneNumber: data?.data.phoneNumber || "",
      baleId: data?.data.baleId || "",
    },
  });

  const onSubmit = async (formData: FormData) => {
    try {
      const response = await updateProfile(formData).unwrap();
      if (response.success) {
        router.back();
        toast.show({ msg: response.message, type: "success" });
      } else {
        toast.show({
          msg: response.message || "خطا در به‌روزرسانی پروفایل",
          type: "error",
        });
      }
    } catch (error: any) {
      toast.show({
        msg: error?.data?.message || "خطا در ارتباط با سرور",
        type: "error",
      });
    }
  };

  if (isLoading) {
    return (
      <LinearGradient
        colors={["#F0F6FA", "#FFFFFF", "#F5F0FA"]}
        style={{ flex: 1 }}
      >
        <View className="flex-1 p-6">
          <View className="items-center mb-8">
            <Skeleton variant="circular" className="h-28 w-28 rounded-full" />
          </View>
          <VStack space="md" className="mt-4">
            <SkeletonText _lines={1} className="h-4 w-24" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <SkeletonText _lines={1} className="h-4 w-32 mt-2" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl mt-4" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </VStack>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#F0F6FA", "#FFFFFF", "#F5F0FA"]}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View className="flex-1 p-6">
            {/* Header Avatar */}
            <Animated.View
              entering={FadeInUp.duration(600).springify()}
              className="items-center mb-8"
            >
              <LinearGradient
                colors={["#79AED6", "#9966CC"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: "#79AED6",
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.3,
                  shadowRadius: 12,
                  elevation: 6,
                }}
              >
                <Feather name="user" size={48} color="white" />
              </LinearGradient>
              <Text className="font-vazirBold text-primary-700 text-lg mt-4">
                ویرایش پروفایل
              </Text>
              <Text className="font-vazir text-tertiary-500 text-sm mt-1">
                اطلاعات خود را به‌روزرسانی کنید
              </Text>
            </Animated.View>

            {/* Form Fields */}
            <Animated.View entering={FadeInUp.duration(600).delay(100)}>
              <VStack space="lg" className="mt-4">
                {/* Name Field */}
                <VStack space="sm">
                  <HStack className="items-center justify-end">
                    <Feather name="user" size={16} color="#79AED6" />
                    <Text className="text-sm font-vazirBold text-primary-700 mr-2">
                      نام و نام خانوادگی
                    </Text>
                  </HStack>
                  <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, value } }) => (
                      <LinearGradient
                        colors={["#FFFFFF", "#F9F9FF"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                          borderWidth: errors.name ? 1 : 0,
                          borderColor: errors.name ? "#FF6B6B" : "transparent",
                          overflow: "hidden",
                        }}
                      >
                        <Input className="border rounded-xl bg-transparent">
                          <InputField
                            value={value}
                            onChangeText={onChange}
                            autoCapitalize="words"
                            className="text-right font-vazir text-base"
                            placeholder="مثال: سارا محمدی"
                            placeholderTextColor="#CCC"
                          />
                        </Input>
                      </LinearGradient>
                    )}
                  />
                  {errors.name && (
                    <HStack
                      space="sm"
                      className="items-center justify-end mt-1"
                    >
                      <Feather name="alert-circle" size={12} color="#FF6B6B" />
                      <Text className="text-error-500 text-xs font-vazir">
                        {errors.name.message}
                      </Text>
                    </HStack>
                  )}
                </VStack>

                {/* Phone Number Field (Disabled) */}
                <VStack space="sm">
                  <HStack className="items-center justify-end">
                    <View className="bg-primary-100 mr-2 rounded-full px-2 py-0.5">
                      <Text className="text-primary-500 font-vazir text-xs">
                        غیر قابل تغییر
                      </Text>
                    </View>
                    <Text className="text-sm font-vazirBold text-primary-700 mr-2">
                      شماره موبایل
                    </Text>
                    <Feather name="phone" size={16} color="#79AED6" />
                  </HStack>
                  <Controller
                    control={control}
                    name="phoneNumber"
                    render={({ field: { onChange, value } }) => (
                      <LinearGradient
                        colors={["#F5F5F5", "#EFEFEF"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                          borderRadius: 10,
                          overflow: "hidden",
                        }}
                      >
                        <Input
                          isDisabled
                          className="border-0 bg-transparent opacity-70"
                        >
                          <InputField
                            value={value}
                            onChangeText={onChange}
                            keyboardType="phone-pad"
                            className="text-right font-vazir text-base"
                            editable={false}
                          />
                        </Input>
                      </LinearGradient>
                    )}
                  />
                </VStack>

                {/* Bale ID Field - اضافه شده */}
                <VStack space="sm">
                  <HStack className="items-center justify-end">
                    <Feather name="message-circle" size={16} color="#79AED6" />
                    <Text className="text-sm font-vazirBold text-primary-700 mr-2">
                      آیدی بله (Bale ID)
                    </Text>
                  </HStack>
                  <Controller
                    control={control}
                    name="baleId"
                    render={({ field: { onChange, value } }) => (
                      <LinearGradient
                        colors={["#FFFFFF", "#F9F9FF"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                          borderWidth: errors.baleId ? 1 : 0,
                          borderColor: errors.baleId
                            ? "#FF6B6B"
                            : "transparent",
                          overflow: "hidden",
                        }}
                      >
                        <Input className="border rounded-xl bg-transparent">
                          <InputField
                            value={value || ""}
                            onChangeText={onChange}
                            autoCapitalize="none"
                            className="text-right font-vazir text-base"
                            placeholder="@username یا username"
                            placeholderTextColor="#CCC"
                          />
                        </Input>
                      </LinearGradient>
                    )}
                  />
                  {errors.baleId && (
                    <HStack
                      space="sm"
                      className="items-center justify-end mt-1"
                    >
                      <Feather name="alert-circle" size={12} color="#FF6B6B" />
                      <Text className="text-error-500 text-xs font-vazir">
                        {errors.baleId.message}
                      </Text>
                    </HStack>
                  )}
                  <Text className="text-right text-gray-400 text-xs mt-1">
                    برای استفاده از چت و تماس، آیدی خود را در پیام‌رسان بله وارد
                    کنید
                  </Text>
                </VStack>
              </VStack>
            </Animated.View>

            {/* Action Buttons */}
            <Animated.View entering={FadeInUp.duration(600).delay(200)}>
              <HStack space="md" className="mt-10">
                <TouchableOpacity
                  onPress={handleSubmit(onSubmit)}
                  disabled={isUpdating}
                  activeOpacity={0.8}
                  className="flex-1"
                >
                  <LinearGradient
                    colors={["#79AED6", "#9966CC"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      borderRadius: 16,
                      paddingVertical: 14,
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "row",
                      gap: 8,
                    }}
                  >
                    {isUpdating ? (
                      <ButtonSpinner color="white" />
                    ) : (
                      <>
                        <Feather name="check" size={18} color="white" />
                        <Text className="text-white font-vazirBold text-base">
                          ذخیره تغییرات
                        </Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => router.back()}
                  disabled={isUpdating}
                  activeOpacity={0.8}
                  className="flex-1"
                >
                  <LinearGradient
                    colors={["#F5F5F5", "#EFEFEF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      borderRadius: 16,
                      paddingVertical: 14,
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 1,
                      borderColor: "#E0E0E0",
                    }}
                  >
                    <Text className="text-gray-600 font-vazirBold text-base">
                      انصراف
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </HStack>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default EditProfile;
