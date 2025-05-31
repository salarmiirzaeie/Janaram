import MoodLogger from "@/components/reports/moodLogger";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAppSelector } from "@/hooks/useAppSelector";
import { prepareLineData, preparePieData } from "@/utils/mood";
import React from "react";
import { ScrollView } from "react-native";
import { LineChart, PieChart } from "react-native-gifted-charts";

const Test = () => {
  const moods = useAppSelector((state) => state.mood);
  const pieData = preparePieData(moods);
  const lineData = prepareLineData(moods);
  return (
    <ScrollView className="flex-1 bg-background-50">
      <VStack className="flex-1 p-4 space-y-6">
        {/* Pie Chart Section */}
        <VStack className="bg-white rounded-3xl mb-4 p-4">
          <Text className="text-right font-semiBold text-xl">مود هفت روز گذشته</Text>

          <HStack className="items-center justify-between ">
            <PieChart
              data={pieData}
              radius={100}
              textSize={14}
              focusOnPress
              innerRadius={70}
              centerLabelComponent={() => <Text className="text-sm font-bold text-black">این هفته</Text>}
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
        </VStack>

        {/* Line Chart Section */}
        <VStack className="bg-white rounded-3xl mb-4 p-4">
          <Text className="text-right font-semiBold text-xl mb-2">روند مود هفت روز گذشته</Text>
          <VStack className="items-center justify-center  my-4">
            {lineData.length > 0 ? (
              <LineChart
                width={270}
                height={180}
                data={lineData as any}
                thickness={2}
                color="#60A5FA"
                hideDataPoints={false}
                dataPointsColor="#3B82F6"
                startFillColor="#93C5FD"
                endFillColor="#BFDBFE"
                startOpacity={0.3}
                endOpacity={0.1}
                curved
                spacing={40}
                xAxisLabelTextStyle={{ fontSize: 12 }}
                yAxisTextStyle={{ fontSize: 12 }}
                yAxisColor="lightgray"
                xAxisColor="lightgray"
                noOfSections={6}
                maxValue={6}
                stepValue={1}
                isAnimated
              />
            ) : (
              <Text>هیچ داده ای وجود ندارد</Text>
            )}
          </VStack>
        </VStack>

        {/* Notes Section */}
        <MoodLogger />
      </VStack>
    </ScrollView>
  );
};

export default Test;
