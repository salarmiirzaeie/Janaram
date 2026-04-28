// app/(app)/tests/[id].tsx
import {
  useGetSingleTestQuery,
  useSubmitTestMutation,
} from "@/services/test/test-adapter";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type Answer = {
  questionId: number;
  score: number;
};

const SingleTest = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, error } = useGetSingleTestQuery({ id });
  const [submitTest, { isLoading: isSubmitting }] = useSubmitTestMutation();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Initialize answers array when test data loads
  useEffect(() => {
    if (data?.data?.questions) {
      const initialAnswers: Answer[] = data.data.questions.map((q: any) => ({
        questionId: q.id,
        score: -1, // -1 means not answered yet
      }));
      setAnswers(initialAnswers);
    }
  }, [data]);

  const questions = data?.data?.questions || [];
  const totalQuestions = questions.length;

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentIndex]?.score;

  const handleAnswer = (score: number) => {
    if (isTransitioning) return;

    // Update answer for current question
    const newAnswers = [...answers];
    newAnswers[currentIndex] = { questionId: currentQuestion.id, score };
    setAnswers(newAnswers);

    // Auto-advance to next question if not last
    if (currentIndex + 1 < totalQuestions) {
      goToNext();
    } else {
      // Last question answered -> optionally auto-submit or show submit button
      // We'll let user manually press "Submit" after last question.
    }
  };

  const goToNext = () => {
    if (currentIndex + 1 < totalQuestions && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
      // Allow next transition after animation (300ms)
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev - 1);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  const handleSubmit = async () => {
    // Check if all questions answered (no -1)
    const allAnswered = answers.every((a) => a.score !== -1);
    if (!allAnswered) {
      alert("لطفاً به همه سوالات پاسخ دهید");
      return;
    }

    // Prepare payload: only questionId and score
    const payload = {
      answers: answers.map(({ questionId, score }) => ({ questionId, score })),
    };

    try {
      const result = await submitTest({ id, data: payload }).unwrap();
      // Navigate to result screen with result data
      router.push({
        pathname: "/result",
        params: {
          result: JSON.stringify(result.data),
          testName: data?.data?.test_name,
        },
      });
    } catch (err) {
      console.error("Submit error:", err);
      alert("خطا در ارسال پاسخ‌ها. لطفاً دوباره تلاش کنید.");
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (error || !data?.data) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-red-500 font-vazir text-lg">
          خطا در دریافت تست
        </Text>
      </View>
    );
  }

  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1">
      <View className="flex-1 bg-white">
        {/* Header with progress */}

        <View className="px-5 pt-4 pb-2">
          <Text className="text-lg font-vazirBold text-gray-800 text-right">
            {data.data.test_name}
          </Text>
          <View className="h-2 bg-gray-200 rounded-full mt-2">
            <View
              className="h-2 bg-indigo-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </View>
          <Text className="text-sm text-gray-500 font-vazir text-right mt-1">
            سوال {currentIndex + 1} از {totalQuestions}
          </Text>
        </View>

        {/* Question card with animation */}
        <View className="flex-1 px-5">
          <Animated.View
            key={currentIndex}
            entering={SlideInRight.duration(300)}
            exiting={SlideOutLeft.duration(300)}
            className="flex-1"
          >
            <View className="bg-gray-50 rounded-2xl p-6 shadow-sm mb-6">
              <Text className="text-xl font-vazirBold text-gray-800 text-right leading-8">
                {currentQuestion.text}
              </Text>
            </View>

            {/* Options */}
            <View className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = currentAnswer === option.score;
                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => handleAnswer(option.score)}
                    className={`p-4 mb-2 rounded-xl border ${
                      isSelected
                        ? "bg-indigo-100 border-indigo-500"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <Text
                      className={`text-right font-vazir  ${
                        isSelected ? "text-indigo-700 " : "text-gray-700"
                      }`}
                    >
                      {option.text}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
        </View>
        {/* <BannerAd bannerSize="BANNER" /> */}

        {/* Navigation buttons */}
        <View className="flex-row justify-between px-5 py-4 border-t border-gray-100">
          {currentIndex > 0 ? (
            <TouchableOpacity
              onPress={goToPrev}
              disabled={isTransitioning}
              className="px-6 py-3 rounded-xl bg-gray-200"
            >
              <Text className="text-gray-700 font-vazir  ">قبلی</Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}

          {currentIndex === totalQuestions - 1 ? (
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting || isTransitioning}
              className="px-6 py-3  rounded-xl bg-indigo-600"
            >
              <Text className="text-white  font-vazir">
                {isSubmitting ? "در حال ارسال..." : "دریافت نتیجه"}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={goToNext}
              disabled={isTransitioning}
              className="px-6 py-3 rounded-xl bg-indigo-600"
            >
              <Text className="text-white text-base font-vazir">بعدی</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SingleTest;
