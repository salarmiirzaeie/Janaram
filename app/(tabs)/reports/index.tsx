import MoodBarChart from "@/components/reports/mood-bar-chart";
import MoodLogger from "@/components/reports/moodLogger";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAppSelector } from "@/hooks/useAppSelector";
import { prepareBarData, prepareLineDataForLastMonth, preparePieData } from "@/utils/mood";
import React from "react";
import { ScrollView } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const Test = () => {
  const moods = useAppSelector((state) => state.mood);
  const pieData = preparePieData(moods);
  const barData = prepareBarData(moods);
  const lineData = prepareLineDataForLastMonth(moods);

  return (
    <ScrollView className="flex-1 bg-background-50">
      <VStack className="flex-1 p-4 space-y-6">
        {/* Pie Chart Section */}
        {/* <VStack className="bg-white rounded-3xl mb-4 p-4">
          <Text className="text-right font-semiBold text-xl">سهم هر مود در این ماه</Text>

          <HStack className="items-center justify-between ">
            <PieChart
              data={pieData}
              radius={100}
              textSize={14}
              focusOnPress
              innerRadius={70}
              centerLabelComponent={() => <Text className="text-sm font-bold text-black"> ماه گذشته</Text>}
            />
            <VStack>
              {pieData.map((item, index) => (
                <Text key={index} className="text-right text-sm">
                  <Text style={{ color: item.color }}>● </Text>
                  {item.text}
                </Text>
              ))}
            </VStack>
          </HStack>
        </VStack> */}

        {/* Line Chart Section */}

        <VStack className="bg-white rounded-3xl mb-4 p-4">
          <Text className="text-right font-semiBold text-xl mb-2">روند حال من</Text>
          <VStack className=" justify-center  my-4">
            <LineChart
              data={lineData}
              width={280}
              height={220}
              spacing={9}
              maxValue={9}
              hideDataPoints={false}
              hideRules={false}
              yAxisTextStyle={{ fontSize: 10 }}
              xAxisLabelTextStyle={{ fontSize: 10, rotate: 45, opacity: 0 }}
              initialSpacing={10}
              yAxisColor="lightgray"
              xAxisColor="lightgray"
              color1="#64B5F6"
              animateOnDataChange
              stepValue={1}
            />
          </VStack>
        </VStack>
        <VStack className="bg-white rounded-3xl mb-4 p-4">
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
