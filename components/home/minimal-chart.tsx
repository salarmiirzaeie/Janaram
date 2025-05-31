import { useAppSelector } from "@/hooks/useAppSelector";
import { prepareLineData, preparePieData } from "@/utils/mood";
import React from "react";
import { View } from "react-native";
import { LineChart, PieChart } from "react-native-gifted-charts";

const MinimalChart = () => {
  const moods = useAppSelector((state) => state.mood);
  const pieData = preparePieData(moods);
  const lineData = prepareLineData(moods);
  console.log(lineData);
  const moodCount = moods.filter((mood) => mood.mood !== null).length;
  const mainLineData = lineData.map((item: any) => {
    return { value: item.value };
  });
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

      {moodCount > 3 ? (
        <LineChart
          height={140}
          width={250}
          curved
          data={mainLineData as any}
          thickness={2}
          color="#2979FF"
          startFillColor="#2979FF"
          endFillColor="#ffffff"
          startOpacity={0.4}
          endOpacity={0}
          xAxisThickness={0}
          yAxisThickness={0}
          hideDataPoints={false}
          showVerticalLines={false}
          spacing={40}
          hideYAxisText={true}
          hideAxesAndRules={true}
          noOfSections={6}
          maxValue={6}
          stepValue={1}
          rulesType="solid"
          initialSpacing={10}
          pointerConfig={{
            pointerStripUptoDataPoint: true,
            pointerColor: "#2979FF",
            pointerStripColor: "#2979FF",
            pointerStripWidth: 1,
            radius: 4,
            pointerLabelWidth: 120,
            pointerLabelHeight: 40,
          }}
        />
      ) : (
        <PieChart data={pieData} radius={80} textSize={14} focusOnPress innerRadius={70} />
      )}
    </View>
  );
};

export default MinimalChart;
