import { normalizePhoneNumber, unNormalizePhoneNumber } from "@/utils/phone";
import { AntDesign } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert } from "react-native";

import { Avatar, AvatarBadge, AvatarImage } from "@/components/ui/avatar";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
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
  const [profilePhoto, setProfilePhoto] = useState<string | null>(data?.data.profilePhoto || null);
  const toast = useCustomToast();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: data?.data.name || "",
      phoneNumber: unNormalizePhoneNumber(data?.data.phoneNumber || ""),
    },
  });

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Please allow access to your photo library.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      console.log("Selected image:", {
        uri: result.assets[0].uri,
        mimeType: result.assets[0].mimeType,
        fileSize: result.assets[0].fileSize,
        fileName: result.assets[0].fileName,
      });
      setProfilePhoto(result.assets[0].uri);
    } else {
      console.log("Image selection canceled or failed:", result);
    }
  };

  const onSubmit = async (formData: FormData) => {
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    const normalizedPhone = normalizePhoneNumber(formData.phoneNumber);
    formDataToSend.append("phoneNumber", normalizedPhone);

    if (profilePhoto) {
      try {
        const fileInfo = await FileSystem.getInfoAsync(profilePhoto);
        console.log("File info:", fileInfo);
        if (!fileInfo.exists) {
          throw new Error("Image file does not exist");
        }
        if (fileInfo.size > 5 * 1024 * 1024) {
          throw new Error("Image size exceeds 5MB limit");
        }
        console.log(profilePhoto, "profilePhoto");
        const response = await fetch(profilePhoto);
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
        const blob = await response.blob();
        console.log("Image blob:", {
          type: blob.type,
          size: blob.size,
          fileName: profilePhoto.split("/").pop(),
        });
        if (!["image/jpeg", "image/png"].includes(blob.type)) {
          throw new Error("Invalid image type. Only JPEG and PNG are allowed.");
        }
        const fileName = profilePhoto.split("/").pop() || `profile-photo.${blob.type.split("/")[1] || "jpg"}`;
        console.log("profilePhoto", blob, fileName);
        formDataToSend.append("files", blob, fileName);
      } catch (error: any) {
        console.error("Error preparing image for upload:", error.message);
        toast.show({ msg: `Failed to process image: ${error.message}`, type: "error" });
        return;
      }
    }

    try {
      const response = await updateProfile(formDataToSend).unwrap();
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
      <VStack className="items-center mt-4">
        <Avatar size="xl">
          <AvatarImage
            source={
              profilePhoto
                ? { uri: profilePhoto.startsWith("file://") ? profilePhoto : `http://192.168.5.96:3000${profilePhoto}` }
                : require("@/assets/images/defaultAvatar.png")
            }
          />
          <AvatarBadge size="2xl" className="justify-center items-center bg-blue-200">
            <Pressable onPress={pickImage}>
              <AntDesign color="purple" name="camera" size={20} />
            </Pressable>
          </AvatarBadge>
        </Avatar>
        <Pressable onPress={pickImage}>
          <Text className="text-primary-500 mt-2 font-semibold">Change Profile Photo</Text>
        </Pressable>
      </VStack>

      <VStack space="md" className="mt-6">
        <VStack>
          <Text className="text-sm font-medium text-typography-900">Name</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input>
                <InputField
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter your name"
                  autoCapitalize="words"
                />
              </Input>
            )}
          />
          {errors.name && <Text className="text-error-500 text-sm mt-1">{errors.name.message}</Text>}
        </VStack>

        <VStack>
          <Text className="text-sm font-medium text-typography-900">Phone Number</Text>
          <Controller
            control={control}
            name="phoneNumber"
            render={({ field: { onChange, value } }) => (
              <Input>
                <InputField
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter your phone number (e.g., +989123456789)"
                  keyboardType="phone-pad"
                />
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
