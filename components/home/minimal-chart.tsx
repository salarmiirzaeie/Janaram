import { IMood } from "@/redux/mood/mood-slice";
import { preparePieData } from "@/utils/mood";
import React from "react";
import { View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
interface Props {
  moods: IMood[];
}
const MinimalChart: React.FC<Props> = ({ moods }) => {
  const pieData = preparePieData(moods);

  return (
    <View className="  items-center">
      <HStack className="items-center justify-between ">
        <PieChart
          data={pieData}
          radius={80}
          textSize={14}
          focusOnPress
          innerRadius={50}
          innerCircleColor={"#fff"}
          centerLabelComponent={() => (
            <Text className="text-sm font-vazirBold text-black">
              {" "}
              ماه گذشته
            </Text>
          )}
        />
        {/* PieChart Legend */}
        <VStack>
          {pieData.map((item, index) => (
            <Text key={index} className="text-right font-vazir text-sm">
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
