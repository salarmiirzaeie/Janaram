import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
} from "@/components/ui/actionsheet";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { VStack } from "@/components/ui/vstack";
import { useCreateReviewMutation } from "@/services/psychologist/psychologist-adapter";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface RatingModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  appointmentId: string;
  doctorId: string;
  doctorName: string;
}

export default function RatingModal({
  visible,
  onClose,
  onSuccess,
  appointmentId,
  doctorId,
  doctorName,
}: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [createReview, { isLoading }] = useCreateReviewMutation();

  const handleSubmit = async () => {
    if (rating === 0) return;

    try {
      await createReview({
        appointmentId,
        doctorId,
        rating,
        comment: comment.trim(),
      }).unwrap();

      resetForm();
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error("Error submitting review:", error);
      alert(error?.data?.message || "خطا در ثبت نظر");
    }
  };

  const resetForm = () => {
    setRating(0);
    setComment("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const ratingLabels: Record<number, string> = {
    1: "⭐ خیلی ضعیف",
    2: "⭐⭐ ضعیف",
    3: "⭐⭐⭐ متوسط",
    4: "⭐⭐⭐⭐ خوب",
    5: "⭐⭐⭐⭐⭐ عالی",
  };

  return (
    <Actionsheet isOpen={visible} closeOnOverlayClick onClose={handleClose}>
      <ActionsheetBackdrop />
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={
            visible
              ? Platform.OS === "ios"
                ? "padding"
                : "height"
              : undefined
          }
          className="w-full"
          keyboardVerticalOffset={0}
        >
          <ActionsheetContent className="px-5 pb-8 pt-4">
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              bounces={false}
              className="w-full"
            >
              <VStack space="lg" className="w-full items-center">
                <View className="w-16 h-16 rounded-full bg-accent-50 items-center justify-center">
                  <Ionicons name="star-outline" size={32} color="#F59E0B" />
                </View>

                <Text className="text-2xl font-vazirBold text-primary-800 text-center">
                  ثبت نظر و امتیاز
                </Text>
                <Text className="text-sm font-vazir text-tertiary-500 text-center">
                  تجربه خود را از جلسه با {doctorName} به اشتراک بگذارید
                </Text>

                <VStack space="sm" className="w-full items-center">
                  <Text className="text-base font-vazirBold text-primary-800">
                    امتیاز شما
                  </Text>
                  <HStack space="md" className="justify-center items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Pressable key={star} onPress={() => setRating(star)}>
                        <Ionicons
                          name={star <= rating ? "star" : "star-outline"}
                          size={36}
                          color={star <= rating ? "#FBBF24" : "#CBD5E1"}
                        />
                      </Pressable>
                    ))}
                  </HStack>
                  <Text className="text-xs font-vazir text-tertiary-500 text-center mt-1">
                    {rating === 0
                      ? "برای امتیاز دادن کلیک کنید"
                      : ratingLabels[rating]}
                  </Text>
                </VStack>

                <VStack space="md" className="w-full">
                  <HStack className="items-center justify-end">
                    <Text className="text-sm font-vazir text-tertiary-500">
                      (اختیاری)
                    </Text>
                    <Text className="text-lg font-vazirBold text-primary-800 ml-2">
                      نظر شما
                    </Text>
                  </HStack>
                  <Textarea
                    size="md"
                    className="w-full bg-primary-50 rounded-3xl border-0 p-4"
                  >
                    <TextareaInput
                      value={comment}
                      className="text-right font-vazir text-primary-700 min-h-[100px]"
                      onChangeText={setComment}
                      placeholder="تجربه خود را بنویسید..."
                      placeholderTextColor="#91A5BE"
                      multiline
                      textAlignVertical="top"
                    />
                  </Textarea>
                </VStack>

                <HStack space="md" className="w-full gap-3">
                  <Button
                    onPress={handleClose}
                    className="flex-1 rounded-xl bg-primary-100"
                  >
                    <ButtonText className="text-primary-600 font-vazirBold">
                      انصراف
                    </ButtonText>
                  </Button>
                  <Button
                    onPress={handleSubmit}
                    disabled={rating === 0 || isLoading}
                    className={`flex-1 rounded-xl ${
                      rating === 0 ? "bg-tertiary-400" : "bg-accent-500"
                    }`}
                  >
                    {isLoading && <ButtonSpinner color="white" />}
                    <ButtonText className="text-white font-vazirBold">
                      {isLoading ? "در حال ثبت..." : "ثبت نظر"}
                    </ButtonText>
                  </Button>
                </HStack>
              </VStack>
            </ScrollView>
          </ActionsheetContent>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Actionsheet>
  );
}
