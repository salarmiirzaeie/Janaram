import Logo from "@/components/ui/logo";
import { Text } from "@/components/ui/text";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useCustomToast } from "@/hooks/useToast";
import { useGetMoodQuery } from "@/services/mood/mood-adapter";
import { usePlansQuery } from "@/services/upgrade/upgrade-adapter";
import { toPersianDigits } from "@/utils/persian";
import { FontAwesome6 } from "@expo/vector-icons";
import { Redirect, router, Stack } from "expo-router";
import React from "react";
import { Pressable } from "react-native";
import { useDispatch } from "react-redux";

const _layout = () => {
  const { authorized } = useAppSelector((state) => state.auth);
  const { data } = useGetMoodQuery({ page: 1, limit: 30 });
  const { data: plans, isLoading } = usePlansQuery(null);
  const toast = useCustomToast();
  const proPlan = plans?.data.plans?.find((plan) => plan.name === "unlimited");

  const dispatch = useDispatch();
  if (!authorized) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          headerTitle: () => <Logo className="h-10 w-16" />,
          headerShadowVisible: false,

          headerLeft() {
            return (
              <Pressable className="items-center flex-row pl-1 pr-4" onPress={() => router.navigate("/streak")}>
                <Text className="text-lg">🌱 </Text>
                <Text className="text-lg font-vazirBold mt-1">{toPersianDigits(data?.data.totalMoodDays || 0)}</Text>
              </Pressable>
            );
          },

          headerRight() {
            const isActive = proPlan?.isActive;

            return (
              <Pressable
                className="items-center flex-row space-x-2"
                onPress={() =>
                  !isActive
                    ? dispatch({
                        type: "initialize/setIsFirstModalShow",
                        payload: true,
                      })
                    : toast.show({ msg: "پلن Pro شما فعال است", type: "success" })
                }
              >
                <Text className={`text-lg font-vazirBold ${isActive ? "text-green-500" : "text-accent-400"}`}>Pro</Text>
                <FontAwesome6
                  size={24}
                  name="crown"
                  color={isActive ? "#4ade80" : "#FFB74D"} // اگه فعال بود سبز بشه
                />
              </Pressable>
            );
          },
        }}
      />
    </Stack>
  );
};

export default _layout;
