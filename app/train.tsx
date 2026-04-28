import { Badge, BadgeText } from "@/components/ui/badge";
import { HStack } from "@/components/ui/hstack";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { VStack } from "@/components/ui/vstack";
import {
  useCompleteExerciseMutation,
  useGetExerciseQuery,
  UserExercise,
} from "@/services/exercise/exercise-adapter";
import { useGetMoodQuery } from "@/services/mood/mood-adapter";
import { usePlansQuery } from "@/services/upgrade/upgrade-adapter";
import { toPersianDigits } from "@/utils/persian";
import {
  Feather,
  FontAwesome,
  FontAwesome6,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
// import { Adivery } from "adivery";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect, useMemo } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { useDispatch } from "react-redux";

const Train = () => {
  const animationRef = React.useRef(null);
  const { data, isLoading } = useGetExerciseQuery(null);
  const { data: mood, isLoading: moodLoading } = useGetMoodQuery(null);
  const [fakeLoading, setFakeLoading] = React.useState(true);
  const [completeExercise, { isLoading: completeLoading }] =
    useCompleteExerciseMutation();
  const { data: plans } = usePlansQuery(null);
  const dispatch = useDispatch();
  const proPlan = useMemo(
    () => plans?.data.plans?.find((plan) => plan.name === "unlimited"),
    [plans?.data.plans]
  );

  useEffect(() => {
    setTimeout(() => {
      setFakeLoading(false);
    }, 6000);
  }, []);

  const getTypeIcon = (type: string, done: boolean) => {
    const color = done ? "#4D1A80" : "#79AED6";
    switch (type) {
      case "meditation":
        return <Feather name="wind" size={24} color={color} />;
      case "chatbot":
        return <Ionicons name="chatbubble-ellipses" size={24} color={color} />;
      case "breathing":
        return <MaterialIcons name="air" size={24} color={color} />;
      case "text-activity":
        return <FontAwesome6 name="book-open" size={22} color={color} />;
      default:
        return <FontAwesome6 name="clipboard-list" size={24} color={color} />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "meditation":
        return { text: "مدیتیشن", color: "bg-primary-100" };
      case "chatbot":
        return { text: "چت بات", color: "bg-secondary-100" };
      case "breathing":
        return { text: "تنفس", color: "bg-accent-100" };
      case "text-activity":
        return { text: "متن", color: "bg-tertiary-100" };
      default:
        return { text: "تمرین", color: "bg-gray-100" };
    }
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: UserExercise;
    index: number;
  }) => {
    const typeBadge = getTypeBadge(item.type);
    const isDone = item.done;
    const isProAndNotActive = item.isPro && !proPlan?.isActive;
    const handleOpenNotProModal = () => {
      dispatch({
        type: "pro/setShowNotProModal",
        payload: {
          message: "🌙 این مدیتیشن مخصوص کاربران Pro است",
          showNotProModal: true,
        },
      });
    };
    return (
      <Animated.View entering={FadeInUp.duration(400).delay(index * 100)}>
        <TouchableOpacity
          onPress={() => {
            if (isProAndNotActive) {
              handleOpenNotProModal();
              return;
            }
            if (!proPlan?.isActive) {
              // Adivery.prepareInterstitialAd(interstitialPlacement);
              // Adivery.isLoaded(interstitialPlacement).then((isLoaded) => {
              //   if (isLoaded) {
              //     Adivery.showAd(interstitialPlacement);
              //   }
              // });
            }
            if (!item.done) completeExercise({ exerciseId: item._id });
            if (item.type === "meditation") {
              router.push({
                pathname: "/player",
                params: { id: item.exerciseId },
              });
            }
            if (item.type === "chatbot") {
              router.push({
                pathname: "/chat-bot",
                params: { id: item.exerciseId },
              });
            }
            if (item.type === "breathing") {
              router.push({
                pathname: "/breathingPlayer",
                params: { id: item.exerciseId },
              });
            }
            if (item.type === "text-activity") {
              router.push({
                pathname: "/text-activity",
                params: { subType: item.exerciseId, title: item.title },
              });
            }
          }}
          activeOpacity={0.8}
        >
          {item.isPro && (
            <Badge className="absolute right-10 bg-black z-50 rounded-b-xl top-0">
              <BadgeText className="font-vazir text-white">Pro</BadgeText>
            </Badge>
          )}
          <LinearGradient
            colors={isDone ? ["#F0F6FA", "#FFFFFF"] : ["#FFFFFF", "#F9F9FF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 20,
              marginBottom: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: isDone ? "#E9EDF2" : "#E9EDF2",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <HStack className="items-center justify-between">
              {/* Icon */}
              <View
                className={`rounded-full p-3 ${
                  isDone ? "bg-secondary-300" : "bg-primary-100"
                }`}
              >
                {getTypeIcon(item.type, isDone)}
              </View>

              {/* Content */}
              <VStack className="flex-1 mx-3">
                <HStack className="items-center gap-2 mb-1">
                  <View
                    className={`px-2 py-0.5 rounded-full ${typeBadge.color}`}
                  >
                    <Text className="font-vazir text-xs text-primary-600">
                      {typeBadge.text}
                    </Text>
                  </View>
                </HStack>

                <Text className="text-right font-vazirBold text-base text-gray-800">
                  {item.title}
                </Text>

                {item.description && (
                  <Text
                    className="text-right font-vazir text-sm text-gray-500 mt-1"
                    numberOfLines={2}
                  >
                    {item.description.length > 60
                      ? item.description.slice(0, 60) + "..."
                      : item.description}
                  </Text>
                )}

                <HStack className="items-center mt-2 gap-2">
                  <View className="flex-row items-center gap-1">
                    <Feather name="clock" size={12} color="#999" />
                    <Text className="font-vazir text-xs text-gray-400">
                      {toPersianDigits(item.duration || 0)} دقیقه
                    </Text>
                  </View>
                </HStack>
              </VStack>

              {/* Start Button */}
              <LinearGradient
                colors={
                  isDone ? ["#330D66", "#804DB3"] : ["#79AED6", "#9966CC"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                }}
              >
                <HStack space="sm" className="items-center">
                  <FontAwesome
                    name={isDone ? "check" : "play"}
                    size={12}
                    color="white"
                  />
                  <Text className="text-white font-vazirBold text-sm">
                    {isDone ? "انجام شد" : "شروع"}
                  </Text>
                </HStack>
              </LinearGradient>
            </HStack>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <LinearGradient colors={["#F0F6FA", "#FFFFFF"]} style={{ flex: 1 }}>
      <View className="flex-1  p-4">
        {/* Mood Progress Card */}
        <Animated.View entering={FadeInUp.duration(600).springify()}>
          <LinearGradient
            colors={["#FFFFFF", "#F5F0FA"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 24,
              padding: 20,
              marginBottom: 24,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <HStack className="justify-between items-center mb-3">
              <HStack space="md" className="items-center">
                <Text className="text-3xl font-vazirBold text-primary-600">
                  {mood?.data.completedExercises || 0}
                </Text>
                <Text className="text-xl font-vazir text-primary-400">/</Text>
                <Text className="text-xl font-vazir text-primary-400">
                  {mood?.data.totalExercises || 0}
                </Text>
              </HStack>
              <HStack space="sm" className="items-center">
                <Text className="font-vazirBold text-primary-800 text-base">
                  پیشرفت امروز
                </Text>
                <Feather name="trending-up" size={20} color="#79AED6" />
              </HStack>
            </HStack>

            <Progress
              value={mood?.data.progressPercent}
              size="md"
              orientation="horizontal"
              className="w-full rounded-full bg-primary-100"
            >
              <LinearGradient
                colors={["#79AED6", "#9966CC"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ borderRadius: 999, overflow: "hidden" }}
              >
                <ProgressFilledTrack className="bg-transparent" />
              </LinearGradient>
            </Progress>

            <Text className="text-right text-primary-500 text-xs font-vazir mt-2">
              {Math.round(mood?.data.progressPercent || 0)}% تکمیل
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Exercises Header */}
        <Animated.View entering={FadeInUp.duration(600).delay(100)}>
          <HStack className="items-center justify-between mb-4">
            <View className="bg-primary-100 rounded-full px-3 py-1">
              <Text className="text-primary-600 font-vazir text-xs">
                {toPersianDigits(data?.data?.length || 0)} تمرین
              </Text>
            </View>
            <HStack space="sm" className="items-center">
              <Text className="font-vazirBold text-primary-800 text-xl">
                تمرینات امروز
              </Text>
              <Feather name="calendar" size={20} color="#79AED6" />
            </HStack>
          </HStack>
        </Animated.View>

        {/* Exercises List */}
        {isLoading || fakeLoading ? (
          <Animated.View
            entering={FadeIn.duration(400)}
            className="flex-1 justify-center items-center"
          >
            <LottieView
              style={{ width: 260, height: 260 }}
              ref={animationRef}
              source={require("@/assets/animations/robot-meditation.json")}
              autoPlay
              loop
            />
            <Text className="text-right font-vazirBold text-primary-700 text-lg mt-4">
              در حال آماده سازی با هوش مصنوعی...
            </Text>
            <Text className="text-gray-500 font-vazir text-center text-sm mt-2 px-8">
              اینجا تمرین‌های متناسب با حالت رو می‌بینی. برای دریافت تمرینات
              پیشرفته‌تر و تخصصی‌تر، می‌تونی به نسخه Pro ارتقا بدی.
            </Text>
          </Animated.View>
        ) : (
          <FlatList
            data={data?.data}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        )}
      </View>
    </LinearGradient>
  );
};

export default Train;
