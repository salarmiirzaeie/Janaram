import MoodLogger from "@/components/reports/moodLogger";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import React from "react";
import { ScrollView } from "react-native";
import { LineChart, PieChart } from "react-native-gifted-charts";

const Test = () => {
  const pieData = [
    { value: 40, color: "#A5D6A7", text: "آرامش" },
    { value: 25, color: "#FFCC80", text: "استرس" },
    { value: 20, color: "#EF9A9A", text: "ناراحتی" },
    { value: 15, color: "#90CAF9", text: "خوشحالی" },
  ];

  const lineData = [
    { value: 2, label: "شنبه" },
    { value: 3, label: "یک‌شنبه" },
    { value: 4, label: "دوشنبه" },
    { value: 3, label: "سه‌شنبه" },
    { value: 5, label: "چهارشنبه" },
    { value: 4, label: "پنج‌شنبه" },
    { value: 2, label: "جمعه" },
  ];

  const notes = [
    {
      id: 1,
      date: "شنبه ۲۲ اردیبهشت",
      emotion: "استرس",
      content: "امتحان داشتم و خیلی نگران بودم.",
    },
    {
      id: 2,
      date: "سه‌شنبه ۲۵ اردیبهشت",
      emotion: "آرامش",
      content: "بعد از مدیتیشن حس سبکی داشتم.",
    },
    {
      id: 3,
      date: "پنج‌شنبه ۲۷ اردیبهشت",
      emotion: "ناراحتی",
      content: "با دوستم بحثم شد، حالم گرفته شد.",
    },
  ];

  const getColorByEmotion = (emotion: string) => {
    switch (emotion) {
      case "آرامش":
        return "#4CAF50";
      case "استرس":
        return "#FF9800";
      case "ناراحتی":
        return "#F44336";
      case "خوشحالی":
        return "#2196F3";
      default:
        return "#9E9E9E";
    }
  };

  return (
    <ScrollView className="flex-1 bg-background-50">
      <VStack className="flex-1 p-4 space-y-6">
        {/* Pie Chart Section */}
        <VStack className="bg-white rounded-3xl mb-4 p-4">
          <Text className="text-right font-semiBold text-xl">مود این هفته</Text>

          <HStack className="items-center justify-between ">
            <PieChart
              data={pieData}
              radius={100}
              textSize={14}
              focusOnPress
              innerRadius={70}
              centerLabelComponent={() => (
                <Text className="text-sm font-bold text-white">این هفته</Text>
              )}
            />
            {/* PieChart Legend */}
            <VStack>
              {pieData.map((item, index) => (
                <Text key={index} className="text-right text-sm">
                  <Text style={{ color: item.color }}>● </Text>
                  {item.text}
                </Text>
              ))}
            </VStack>
          </HStack>
        </VStack>

        {/* Line Chart Section */}
        <VStack className="bg-white rounded-3xl mb-4 p-4">
          <Text className="text-right font-semiBold text-xl mb-2">
            روند مود هفته
          </Text>
          <VStack className="items-center justify-center  my-4">
            <LineChart
              width={270}
              height={180}
              data={lineData}
              thickness={2}
              color="#60A5FA"
              hideDataPoints={false}
              dataPointsColor="#3B82F6"
              startFillColor="#93C5FD"
              endFillColor="#BFDBFE"
              startOpacity={0.3}
              endOpacity={0.1}
              curved
              spacing={40}
              xAxisLabelTextStyle={{ fontSize: 12 }}
              yAxisTextStyle={{ fontSize: 12 }}
              yAxisColor="lightgray"
              xAxisColor="lightgray"
              noOfSections={4}
              maxValue={5}
              stepValue={1}
            />
          </VStack>
        </VStack>

        {/* Notes Section */}
        <MoodLogger />
        {/* <VStack>
          <HStack className="items-center mt-4 justify-between">
            <Pressable onPress={() => router.navigate("/(tabs)/reports/notes")}>
              <Text className="text-sm text-gray-600">مشاهده همه</Text>
            </Pressable>

            <Text className="text-right font-bold text-lg my-2">
              یادداشت‌های اخیر
            </Text>
          </HStack>

          <VStack className="mt-4" space="md">
            {notes.map((note) => (
              <View
                key={note.id}
                className="bg-white  rounded-xl shadow shadow-md p-4 border-r-4"
                style={{ borderRightColor: getColorByEmotion(note.emotion) }}
              >
                <Text className="text-right text-sm text-gray-600 mb-1">
                  {note.date} - {note.emotion}
                </Text>
                <Text className="text-right">{note.content}</Text>
              </View>
            ))}
          </VStack>
        </VStack> */}
      </VStack>
    </ScrollView>
  );
};

export default Test;
