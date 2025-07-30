import MoodBarChart from "@/components/reports/mood-bar-chart";
import MoodLogger from "@/components/reports/moodLogger";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAppSelector } from "@/hooks/useAppSelector";
import { formatValue, prepareBarData, prepareLineDataForLastMonth } from "@/utils/mood";
import React from "react";
import { Dimensions, ScrollView } from "react-native";
import { LineChart } from "react-native-chart-kit";

const Test = () => {
  const moods = useAppSelector((state) => state.mood);
  console.log(moods);
  const barData = prepareBarData(moods);
  const lineData = prepareLineDataForLastMonth(moods);
  console.log(barData);
  return (
    <ScrollView className="flex-1 bg-background-50">
      <VStack className="flex-1 p-4 space-y-6">
        {/* Pie Chart Section */}

        {/* Line Chart Section */}

        <VStack className="bg-white rounded-3xl mb-4 p-4">
          <Text className="text-right font-semiBold text-xl mb-2">روند حال من</Text>
          <VStack className=" justify-center items-center -ml-10  mt-4">
            {lineData?.datasets?.[0]?.data?.length > 0 ? (
              <LineChart
                data={lineData}
                width={Dimensions.get("window").width - 64} // from react-native
                height={220}
                withInnerLines={false}
                formatYLabel={(yValue) => formatValue(Number(yValue))}
                yAxisInterval={1} // optional, defaults to 1
                bezier // ✅ This makes the line smooth/curved
                chartConfig={{
                  backgroundColor: "#fff",
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",

                  color: (opacity = 1) => `#1976D2`,
                  labelColor: (opacity = 1) => `transparent`,

                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    strokeWidth: "2",
                    stroke: "rgb(134,179,210)",
                  },
                }}
                withDots={false}
                style={{
                  borderRadius: 16,
                }}
              />
            ) : (
              <Text className="text-center text-gray-400">موردی برای نمایش وجود ندارد</Text>
            )}
          </VStack>
        </VStack>
        <VStack className="bg-white rounded-3xl mb-4  p-4">
          <Text className="text-right font-semiBold text-xl mb-2"> بیشتر چه حالی داشتم</Text>
          <VStack className=" justify-center  my-4">
            <MoodBarChart lineData={barData} />
          </VStack>
        </VStack>
        {/* Notes Section */}
        <MoodLogger />
      </VStack>
    </ScrollView>
  );
};

export default Test;
