import { Badge, BadgeText } from "@/components/ui/badge";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import Logo from "@/components/ui/logo";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { VStack } from "@/components/ui/vstack";
import { useCompleteExerciseMutation, useGetExerciseQuery, UserExercise } from "@/services/exercise/exercise-adapter";
import { useGetMoodQuery } from "@/services/mood/mood-adapter";
import { toPersianDigits } from "@/utils/persian";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import React from "react";
import { FlatList, Text, View } from "react-native";

const Train = () => {
  const animationRef = React.useRef(null);
  const { data, isLoading } = useGetExerciseQuery(null);
  const { data: mood, isLoading: moodLoading } = useGetMoodQuery(null);
  const [completeExercise, { isLoading: completeLoading }] = useCompleteExerciseMutation();

  const renderItem = ({ item }: { item: UserExercise }) => (
    <HStack space="md" className="bg-white shadow-md mb-2 items-center justify-between rounded-2xl p-4">
      <Button
        onPress={() => {
          if (!item.done) completeExercise({ exerciseId: item._id });
          if (item.type === "meditation") {
            router.push({ pathname: "/player", params: { id: item.exerciseId } });
          }
          if (item.type === "chatbot") {
            router.push({ pathname: "/chat-bot", params: { id: item.exerciseId } });
          }
          if (item.type === "breathing") {
            router.push({ pathname: "/breathingPlayer", params: { id: item.exerciseId } });
          }
        }}
        className={item.done ? "bg-calm-500" : "bg-primary-500"}
        size="sm"
      >
        <ButtonIcon
          size="xl"
          as={(props) => <FontAwesome {...props} size={12} color="white" name={item.done ? "check" : "play"} />}
        />
        <ButtonText className="text-white font-vazirBold">{item.done ? "انجام شد" : "شروع"}</ButtonText>
      </Button>

      <VStack className="flex-1 mr-4 items-end">
        <Text className="text-right font-vazirBold text-md text-primary-800">{item.title}</Text>
        {item.description && (
          <Text className="text-right font-vazir text-sm text-primary-700">
            {item.description.length > 50 ? item.description.slice(0, 50) + "..." : item.description}
          </Text>
        )}
        <Badge className="mt-2 flex-grow-0">
          <BadgeText className="text-right font-vazir text-xs text-gray-600">{item.duration} دقیقه</BadgeText>
        </Badge>
      </VStack>

      {item.type !== "meditation" ? (
        <FontAwesome6
          name={
            item.type === "text-activity"
              ? "book-open"
              : item.type === "step-activity"
              ? "list-check"
              : item.type === "chatbot"
              ? "message"
              : item.type === "breathing"
              ? "wind"
              : "book-open"
          }
          size={24}
          color="#47A9DA" // primary-500
        />
      ) : (
        <Logo className="h-8 w-8" />
      )}
    </HStack>
  );

  return (
    <View className="flex-1 p-4 bg-background-50">
      {/* Mood Progress */}
      <View className="bg-white shadow-md rounded-2xl p-4 mb-6">
        <HStack className="justify-between items-center">
          <Text className="text-xl text-primary-800">
            {toPersianDigits(mood?.data.completedExercises || 0)} / {toPersianDigits(mood?.data.totalExercises || 0)}
          </Text>
          <Text className="text-xl font-vazirBold text-primary-800">پیشرفت امروز</Text>
        </HStack>
        <Progress
          value={mood?.data.progressPercent}
          size="md"
          orientation="horizontal"
          className="w-full my-4 bg-primary-100 rounded-full"
        >
          <ProgressFilledTrack className="bg-primary-500" />
        </Progress>
      </View>

      {/* Exercises List */}
      <Text className="text-right font-vazirBold text-xl text-primary-800 mb-4">تمرینات امروز</Text>

      {isLoading ? (
        <VStack className="flex-1 justify-center items-center">
          <LottieView
            style={{ width: 260, height: 260 }}
            ref={animationRef}
            source={require("@/assets/animations/robot-meditation.json")}
            autoPlay
            loop
          />
          <Text className="text-right font-vazir text-md text-primary-700 mt-4">در حال آماده سازی...</Text>
        </VStack>
      ) : (
        <FlatList data={data?.data} renderItem={renderItem} keyExtractor={(item) => item._id} />
      )}
    </View>
  );
};

export default Train;
