import { View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

const MoodBarChart = ({ lineData }: any) => {
  return (
    <View className=" flex-grow">
      <BarChart
        width={280}
        parentWidth={300}
        height={250}
        barWidth={12}
        noOfSections={0}
        maxValue={30}
        stepValue={1}
        barBorderRadius={6}
        frontColor="blue"
        data={lineData}
        yAxisThickness={1}
        xAxisThickness={1}
        yAxisColor="lightgray"
        xAxisColor="lightgray"
        hideRules
        xAxisLabelTextStyle={{ fontSize: 10, transform: [{ rotate: "30deg" }] }}
        yAxisTextStyle={{ fontSize: 8, transform: [{ rotate: "10deg" }] }}
        spacing={19}
        isAnimated
      />
    </View>
  );
};

export default MoodBarChart;
