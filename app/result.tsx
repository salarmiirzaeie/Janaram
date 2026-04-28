// app/(app)/tests/result.tsx
import BannerAd from "@/components/home/BannerAd";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function TestResult() {
  const { result, testName } = useLocalSearchParams();
  const data = result ? JSON.parse(result as string) : null;

  if (!data) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>نتیجه‌ای یافت نشد</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="px-5 py-6">
        <Text className="text-2xl font-bold text-center text-indigo-700 mb-4">
          {testName}
        </Text>
        <View className="bg-indigo-50 rounded-2xl p-6 mb-6">
          <Text className="text-xl font-bold text-center text-indigo-800 mb-2">
            {data.resultTitle}
          </Text>
          <Text className="text-base text-gray-700 text-right leading-7">
            {data.resultDescription}
          </Text>
          <Text className="text-sm text-gray-500 text-center mt-4">
            نمره شما: {data.totalScore}
          </Text>
        </View>
        {/* {data.meditationSuggestion && (
          <View className="bg-gray-50 rounded-xl p-4 mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-2">
              پیشنهاد مدیتیشن:
            </Text>
            <Text className="text-gray-600 text-right">
              {data.meditationSuggestion}
            </Text>
          </View>
        )} */}
        <TouchableOpacity
          onPress={() => router.replace("/")}
          className="bg-indigo-600 py-3 rounded-xl mt-4"
        >
          <Text className="text-white text-center font-medium text-lg">
            بازگشت به خانه
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <BannerAd bannerSize="BANNER" />
    </View>
  );
}
