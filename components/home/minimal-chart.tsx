import { useAppSelector } from "@/hooks/useAppSelector";
import { preparePieData } from "@/utils/mood";
import React from "react";
import { View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

const MinimalChart = () => {
  const moods = useAppSelector((state) => state.mood);
  const pieData = preparePieData(moods);
  const moodCount = moods.filter((mood) => mood.mood !== null).length;

  return (
    <View className="  h-[210px] items-center">
      {/* <Text
        style={{
          fontSize: 14,
          color: "gray",
          textAlign: "center",
          marginBottom: 16,
        }}
      >
        15 April - 21 April
      </Text> */}
      <HStack className="items-center justify-between ">
        <PieChart
          data={pieData}
          radius={80}
          textSize={14}
          focusOnPress
          innerRadius={50}
          innerCircleColor={"#dbeafe"}
          centerLabelComponent={() => <Text className="text-sm font-bold text-black"> ماه گذشته</Text>}
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
    </View>
  );
};

export default MinimalChart;
