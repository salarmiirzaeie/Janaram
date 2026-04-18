import AnalyzeModal from "@/components/chat/analyze-modal";
import MinimalChart from "@/components/home/minimal-chart";
import MoodBarChart from "@/components/reports/mood-bar-chart";
import MoodLogger from "@/components/reports/moodLogger";
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useGetMoodReportQuery } from "@/services/report/report-adapter";
import { usePlansQuery } from "@/services/upgrade/upgrade-adapter";
import {
  moods as moodsEmoji,
  prepareBarData,
  prepareLineDataForLastMonth,
} from "@/utils/mood";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Dimensions, Image, ScrollView, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useDispatch } from "react-redux";

const Test = () => {
  const { data, isLoading } = useGetMoodReportQuery({ page: 1, limit: 30 });
  const moods = data?.data || [];
  const barData = prepareBarData(moods);
  const lineData = prepareLineDataForLastMonth(moods);
  const [analyze, showAnalyze] = useState(false);

  const dispatch = useDispatch();
  const { data: plans } = usePlansQuery(null);
  const proPlan = plans?.data.plans?.find((plan) => plan.name === "unlimited");

  const handleOpenNotProModal = () => {
    dispatch({
      type: "pro/setShowNotProModal",
      payload: {
        message: "ابزار تحلیل شخصیت من مخصوص کاربران Pro می‌باشد.",
        showNotProModal: true,
      },
    });
  };
  const handleAnalyzeMyPersonality = () => {
    showAnalyze(true);
  };
  return (
    <ScrollView className="flex-1 bg-background-50">
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Spinner />
        </View>
      ) : (
        <VStack className="flex-1 p-4 space-y-6">
          {/* Pie Chart Section */}

          {/* Line Chart Section */}

          <VStack className="bg-white rounded-3xl mb-4 p-4">
            <Button
              onPress={() => {
                if (!proPlan?.isActive) {
                  handleOpenNotProModal();
                } else {
                  handleAnalyzeMyPersonality();
                }
              }}
              // disabled={isLoading || !input.trim()}
            >
              {isLoading ? (
                <ButtonSpinner color="#fff" />
              ) : (
                <>
                  <ButtonText>تحلیل شخصیت من</ButtonText>
                  <ButtonIcon
                    as={() => (
                      <AntDesign name="thunderbolt" size={22} color={"#fff"} />
                    )}
                  />
                </>
              )}
            </Button>

            <Button
              onPress={() => {
                router.navigate("/reports/tests");
              }}
              className="mt-2 bg-secondary-400"
              // disabled={isLoading || !input.trim()}
            >
              {isLoading ? (
                <ButtonSpinner color="#fff" />
              ) : (
                <>
                  <ButtonText className="text-white">
                    تست های خود شناسی
                  </ButtonText>
                  <ButtonIcon
                    as={() => (
                      <AntDesign
                        name="question-circle"
                        size={22}
                        color={"#fff"}
                      />
                    )}
                  />
                </>
              )}
            </Button>
          </VStack>
          <VStack className="bg-white rounded-3xl mb-4 p-4">
            <Text className="text-right font-vazirBold text-xl mb-2">
              روند حال من
            </Text>
            <VStack className=" justify-center items-center -ml-10  mt-4">
              {lineData?.datasets?.[0]?.data?.length > 0 && (
                <View className="absolute z-50 top-0 left-16 h-full  ">
                  {moodsEmoji.map((label: any) => (
                    <Image
                      key={label.label}
                      source={label.emoji}
                      resizeMode="cover"
                      className="h-5   mb-1 w-5"
                    />
                  ))}
                </View>
              )}
              {lineData?.datasets?.[0]?.data?.length > 0 ? (
                <LineChart
                  data={lineData}
                  width={Dimensions.get("window").width - 64} // from react-native
                  height={220}
                  withInnerLines={false}
                  // formatYLabel={(yValue) => formatValue(Number(yValue))}
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
                <Text className="text-center text-gray-400">
                  موردی برای نمایش وجود ندارد
                </Text>
              )}
            </VStack>
          </VStack>
          <VStack className="bg-white justify-center rounded-3xl mb-4  p-4">
            <Text className="text-right font-vazirBold text-xl mb-2">
              سهم هر حس از کل{" "}
            </Text>

            <MinimalChart moods={data?.data || []} />
          </VStack>
          <VStack className="bg-white rounded-3xl mb-4  p-4">
            <Text className="text-right font-vazirBold text-xl mb-2">
              {" "}
              بیشتر چه حالی داشتم
            </Text>
            <VStack className=" justify-center  my-4">
              <MoodBarChart lineData={barData} />
            </VStack>
          </VStack>
          {/* Notes Section */}
          <MoodLogger />
        </VStack>
      )}
      {analyze && (
        <AnalyzeModal visible={analyze} onClose={() => showAnalyze(false)} />
      )}
    </ScrollView>
  );
};

export default React.memo(Test);
