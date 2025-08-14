import { unNormalizePhoneNumber } from "@/utils/phone";
import { router } from "expo-router";
import React from "react";

import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useCustomToast } from "@/hooks/useToast";
import { useEditProfileMutation, useProfileQuery } from "@/services/auth/auth-adapter";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";

// Validation schema with Yup
const profileSchema = Yup.object().shape({
  name: Yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
  phoneNumber: Yup.string()
    .required("Phone number is required")
    .matches(/^(\+98|0)?9\d{9}$/, "Enter a valid Iranian phone number (e.g., +989123456789 or 09123456789)"),
});

type FormData = {
  name: string;
  phoneNumber: string;
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
      phoneNumber: unNormalizePhoneNumber(data?.data.phoneNumber || ""),
    },
  });

  const onSubmit = async (formData: FormData) => {
    try {
      const response = await updateProfile(formData).unwrap();
      if (response.success) {
        router.back();
        toast.show({ msg: response.message, type: "success" });
      } else {
        console.error("Server response error:", response.message);
        toast.show({ msg: response.message || "Failed to update profile", type: "error" });
      }
    } catch (error: any) {
      console.error("Update profile error:", error);
      toast.show({
        msg: error?.data?.message || `Failed to update profile: ${error.message || "Network error"}`,
        type: "error",
      });
    }
  };

  if (isLoading) {
    return (
      <VStack className="flex-1 bg-background-0 p-4">
        <Skeleton variant="circular" className="h-[96px] w-[96px]" />
        <SkeletonText _lines={1} className="h-4 w-24 mt-6 self-center" />
        <SkeletonText _lines={1} className="h-4 w-32 mt-2 self-center" />
        <Skeleton className="h-12 w-full mt-4" />
        <Skeleton className="h-12 w-full mt-4" />
      </VStack>
    );
  }

  return (
    <VStack className="flex-1 bg-background-0 p-4">
      <VStack space="md" className="mt-6">
        <VStack>
          <Text className="text-sm text-right font-medium text-typography-900">نام</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input>
                <InputField value={value} onChangeText={onChange} autoCapitalize="words" className="text-right" />
              </Input>
            )}
          />
          {errors.name && <Text className="text-error-500 text-sm mt-1">{errors.name.message}</Text>}
        </VStack>

        <VStack>
          <Text className="text-sm text-right font-medium text-typography-900">شماره موبایل</Text>
          <Controller
            control={control}
            name="phoneNumber"
            render={({ field: { onChange, value } }) => (
              <Input isDisabled>
                <InputField value={value} onChangeText={onChange} keyboardType="phone-pad" />
              </Input>
            )}
          />
          {errors.phoneNumber && <Text className="text-error-500 text-sm mt-1">{errors.phoneNumber.message}</Text>}
        </VStack>
      </VStack>

      <HStack space="md" className="mt-8">
        <Button className="flex-1" onPress={handleSubmit(onSubmit)} disabled={isUpdating}>
          <ButtonText>Save</ButtonText>
        </Button>
        <Button className="flex-1 bg-gray-200" onPress={() => router.back()} disabled={isUpdating}>
          <ButtonText>Cancel</ButtonText>
        </Button>
      </HStack>
    </VStack>
  );
};

export default EditProfile;
