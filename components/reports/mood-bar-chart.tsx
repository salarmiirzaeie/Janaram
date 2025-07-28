import { Dimensions, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { Text } from "../ui/text";

const MoodBarChart = ({ lineData }: any) => {
  console.log(lineData, "lineData");
  return (
    <View className="justify-center items-center self-center ">
      {lineData && lineData?.datasets?.[0]?.data?.length > 0 ? (
        <BarChart
          data={lineData}
          width={Dimensions.get("window").width}
          style={{ flex: 1 }}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          showValuesOnTopOfBars={false}
          withInnerLines={false}
          chartConfig={{
            backgroundColor: "#000",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            strokeWidth: 2,
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,

            style: {
              borderRadius: 16,
            },
            propsForHorizontalLabels: {
              wordSpacing: 0,
              fontSize: 6,
            },
          }}
          verticalLabelRotation={30}
        />
      ) : (
        <Text className="text-center text-gray-400">موردی برای نمایش وجود ندارد</Text>
      )}
    </View>
  );
};

export default MoodBarChart;
