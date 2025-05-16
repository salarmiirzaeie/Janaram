import React from "react";
import { View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const MinimalChart = () => {
  const data = [
    { value: 300 },
    { value: 350 },
    { value: 489 },
    { value: 200 },
    { value: 100 },
    { value: 180 },
    { value: 120 },
  ];

  return (
    <View>
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

      <LineChart
        height={180}
        width={250}
        curved
        data={data}
        thickness={2}
        color="#2979FF"
        startFillColor="#2979FF"
        endFillColor="#ffffff"
        startOpacity={0.4}
        endOpacity={0}
        noOfSections={4}
        maxValue={550}
        xAxisThickness={0}
        yAxisThickness={0}
        hideDataPoints={false}
        showVerticalLines={false}
        spacing={40}
        hideYAxisText={true}
        hideAxesAndRules={true}
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
    </View>
  );
};

export default MinimalChart;
