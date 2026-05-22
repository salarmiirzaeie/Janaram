// app/psychologist/[id]/reviews.tsx
import { colors } from "@/app/(tabs)/psychologist";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import {
  useGetPsychologistByIdQuery,
  useGetReviewsByDoctorIdQuery,
} from "@/services/psychologist/psychologist-adapter";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import moment from "moment-jalaali";
import React, { useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StatusBar, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

moment.loadPersian({ dialect: "persian-modern", usePersianDigits: false });

const formatDate = (dateStr: string) => {
  const m = moment(dateStr);
  return m.format("jD jMMMM jYYYY");
};

const RatingStars = ({ rating, size = 14 }: { rating: number; size?: number }) => {
  return (
    <HStack space="xs" className="items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Ionicons
          key={star}
          name={star <= rating ? "star" : "star-outline"}
          size={size}
          color={star <= rating ? "#FBBF24" : colors.gray[300]}
        />
      ))}
    </HStack>
  );
};

export default function PsychologistReviewsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const { data: doctor, isLoading: isLoadingDoctor } = useGetPsychologistByIdQuery(id);

  const {
    data: reviewsData,
    isLoading: isLoadingReviews,
    isFetching,
    refetch,
  } = useGetReviewsByDoctorIdQuery({ id, page, limit: 10 }, { skip: !id });

  const reviews = reviewsData?.reviews || [];
  const pagination = reviewsData?.pagination;
  const hasMore = pagination ? pagination.page < pagination.totalPages : false;

  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await refetch();
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (!hasMore || isFetching) return;
    setPage((prev) => prev + 1);
  };

  const renderReviewCard = ({ item }: { item: any }) => (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.gray[200],
        padding: 16,
        marginBottom: 12,
        flexDirection: "row-reverse",
      }}
    >
      <View
        style={{
          backgroundColor: colors.primary[50],
          width: 44,
          height: 44,
          borderRadius: 22,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons name="person" size={24} color={colors.primary[500]} />
      </View>
      <VStack className="flex-1 ml-3" style={{ marginRight: 12 }}>
        <Text className="font-vazirBold text-gray-800 text-right">{item.user.name}</Text>
        <Text className="text-xs text-gray-500 mt-0.5 text-right">{formatDate(item.createdAt)}</Text>
        <RatingStars rating={item.rating} size={12} />
        {item.comment && <Text className="text-sm text-gray-600 mt-2 leading-6 text-right">{item.comment}</Text>}
      </VStack>
    </View>
  );

  const renderHeader = () => (
    <View>
      {/* اطلاعات پزشک */}
      {doctor && (
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 20,
            borderWidth: 1,
            borderColor: colors.gray[200],
            padding: 16,
            marginBottom: 16,
            flexDirection: "row-reverse",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: colors.primary[100],
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="person" size={28} color={colors.primary[500]} />
          </View>
          <VStack className="flex-1 ml-3" style={{ marginRight: 12 }}>
            <Text className="text-base font-vazirBold text-gray-800 text-right">{doctor.name}</Text>
            <Text className="text-xs text-gray-500 text-right">{doctor.specialty || "روانشناس"}</Text>
          </VStack>
        </View>
      )}

      {/* عنوان نظرات کاربران */}
      <Text className="text-base font-vazirBold text-gray-800 text-right mb-3">
        💬 نظرات کاربران ({reviews.length})
      </Text>
    </View>
  );

  const renderEmptyState = () => (
    <View className="py-20 items-center">
      <Ionicons name="chatbubble-outline" size={64} color={colors.gray[300]} />
      <Text className="text-gray-500 mt-3 text-center">هیچ نظری ثبت نشده است</Text>
      {/* <Text className="text-gray-400 text-xs mt-1 text-center">
        اولین نفری باشید که نظر می‌دهید
      </Text> */}
    </View>
  );

  const renderFooter = () => {
    if (!hasMore) return null;
    if (isFetching && page > 1) {
      return (
        <View className="py-4 items-center">
          <ActivityIndicator size="small" color={colors.primary[500]} />
        </View>
      );
    }
    return null;
  };

  if (isLoadingDoctor || (isLoadingReviews && page === 1)) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* هدر */}
      <LinearGradient
        colors={[colors.primary[50], colors.secondary[50]]}
        style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 }}
      >
        <HStack className="items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "white",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="chevron-back" size={24} color={colors.gray[600]} />
          </TouchableOpacity>
          <View className="flex-1 mr-4">
            <Text className="text-xl font-vazirBold text-gray-800 text-right">نظرات کاربران</Text>
            <Text className="text-gray-600 text-right text-sm mt-1">{doctor?.name}</Text>
          </View>
        </HStack>
      </LinearGradient>

      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={renderReviewCard}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 40,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary[500]} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
