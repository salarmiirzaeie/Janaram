import { moods } from "@/utils/mood";
import { Dimensions, Image, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

const MoodBarChart = ({ lineData }: any) => {
  return (
    <View className="justify-center -ml-10 items-center self-center ">
      {lineData && lineData?.datasets?.[0]?.data?.length > 0 ? (
        <VStack>
          <BarChart
            data={lineData}
            width={Dimensions.get("window").width - 64}
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
              color: (opacity = 1) => `#1976D2`,

              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,

              style: {
                borderRadius: 16,
              },
              propsForHorizontalLabels: {
                wordSpacing: 0,
                fontSize: 6,
              },
              barPercentage: 0.4,
            }}
            xAxisLabel=""
            verticalLabelRotation={30}
          />
          <View
            className="flex-row justify-between  pl-[68px] pr-2 w -mt-6"
            style={{ width: Dimensions.get("window").width - 64 }}
          >
            {moods.map((label: any) => (
              <Image key={label.label} source={label.emoji} resizeMode="cover" className="h-5  w-5" />
            ))}
          </View>
        </VStack>
      ) : (
        <Text className="text-center text-gray-400">موردی برای نمایش وجود ندارد</Text>
      )}
    </View>
  );
};

export default MoodBarChart;
