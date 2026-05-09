// components/rating-modal.tsx
import { colors } from "@/app/(tabs)/psychologist";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useCreateReviewMutation } from "@/services/psychologist/psychologist-adapter";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, TextInput, TouchableOpacity, View } from "react-native";

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
  const [hoveredRating, setHoveredRating] = useState(0);
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
      onClose();
      onSuccess?.();
    } catch (error: any) {
      console.error("Error submitting review:", error);
      alert(error?.data?.message || "خطا در ثبت نظر");
    }
  };

  const resetForm = () => {
    setRating(0);
    setComment("");
    setHoveredRating(0);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 20,
            paddingBottom: 30,
            maxHeight: "80%",
          }}
        >
          {/* هدر */}
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <View
              style={{
                width: 40,
                height: 4,
                backgroundColor: colors.gray[300],
                borderRadius: 2,
                marginBottom: 16,
              }}
            />
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: colors.accent[50],
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Ionicons
                name="star-outline"
                size={32}
                color={colors.accent[500]}
              />
            </View>
            <Text
              style={{
                fontSize: 20,
                fontFamily: "vazirBold",
                color: colors.gray[800],
                textAlign: "center",
              }}
            >
              ثبت نظر و امتیاز
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: colors.gray[500],
                textAlign: "center",
                marginTop: 4,
              }}
            >
              تجربه خود را از جلسه با {doctorName} به اشتراک بگذارید
            </Text>
          </View>

          {/* امتیاز دهی با ستاره */}
          <VStack space="sm" style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "vazirBold",
                color: colors.gray[700],
                textAlign: "center",
              }}
            >
              امتیاز شما
            </Text>
            <HStack
              space="md"
              style={{ justifyContent: "center", alignItems: "center" }}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Ionicons
                    name={
                      star <= (hoveredRating || rating)
                        ? "star"
                        : "star-outline"
                    }
                    size={36}
                    color={
                      star <= (hoveredRating || rating)
                        ? "#FBBF24"
                        : colors.gray[300]
                    }
                  />
                </TouchableOpacity>
              ))}
            </HStack>
            <Text
              style={{
                fontSize: 12,
                color: colors.gray[400],
                textAlign: "center",
                marginTop: 4,
              }}
            >
              {rating === 0 && "برای امتیاز دادن کلیک کنید"}
              {rating === 1 && "⭐ خیلی ضعیف"}
              {rating === 2 && "⭐⭐ ضعیف"}
              {rating === 3 && "⭐⭐⭐ متوسط"}
              {rating === 4 && "⭐⭐⭐⭐ خوب"}
              {rating === 5 && "⭐⭐⭐⭐⭐ عالی"}
            </Text>
          </VStack>

          {/* متن نظر */}
          <VStack space="sm" style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "vazirBold",
                color: colors.gray[700],
                textAlign: "right",
              }}
            >
              نظر شما
            </Text>
            <TextInput
              value={comment}
              onChangeText={setComment}
              placeholder="تجربه خود را بنویسید..."
              placeholderTextColor={colors.gray[400]}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={{
                backgroundColor: colors.gray[50],
                borderRadius: 16,
                padding: 14,
                fontSize: 14,
                color: colors.gray[800],
                fontFamily: "vazir",
                textAlign: "right",
                minHeight: 100,
                borderWidth: 1,
                borderColor: colors.gray[200],
              }}
            />
          </VStack>

          {/* دکمه‌ها */}
          <HStack space="md" style={{ gap: 12 }}>
            <Button
              onPress={handleClose}
              className="flex-1 rounded-full h-11"
              style={{ backgroundColor: colors.gray[100] }}
            >
              <ButtonText className="text-gray-600 text-sm">انصراف</ButtonText>
            </Button>
            <Button
              onPress={handleSubmit}
              disabled={rating === 0 || isLoading}
              className="flex-1 rounded-full h-11"
              style={{
                backgroundColor:
                  rating === 0 ? colors.gray[300] : colors.accent[500],
              }}
            >
              <ButtonText className="text-white text-sm">
                {isLoading ? "در حال ثبت..." : "ثبت نظر"}
              </ButtonText>
            </Button>
          </HStack>
        </View>
      </View>
    </Modal>
  );
}
