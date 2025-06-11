import { View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

const MoodBarChart = ({ lineData }: any) => {
  return (
    <View className=" flex-grow">
      <BarChart
        width={280}
        parentWidth={300}
        height={200}
        barWidth={22}
        noOfSections={6}
        maxValue={9}
        stepValue={1}
        barBorderRadius={6}
        frontColor="blue"
        data={lineData}
        yAxisThickness={1}
        xAxisThickness={1}
        yAxisColor="lightgray"
        xAxisColor="lightgray"
        xAxisLabelTextStyle={{ opacity: 0 }}
        yAxisTextStyle={{ fontSize: 12 }}
        spacing={30}
        isAnimated
      />
    </View>
  );
};

export default MoodBarChart;
