import Logo from "@/components/ui/logo";
import { Text } from "@/components/ui/text";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useGetMoodQuery } from "@/services/mood/mood-adapter";
import { toPersianDigits } from "@/utils/persian";
import { FontAwesome6 } from "@expo/vector-icons";
import { Redirect, router, Stack } from "expo-router";
import React from "react";
import { Pressable } from "react-native";

const _layout = () => {
  const { authorized } = useAppSelector((state) => state.auth);
  const { data } = useGetMoodQuery({ page: 1, limit: 30 });
  if (!authorized) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/auth/login" />;
  }

  return (
    <>
      {/* <StatusBar backgroundColor="#fff" barStyle="dark-content" /> */}
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
              return (
                <Pressable className="items-center w-10" onPress={() => router.navigate("/subscription")}>
                  <FontAwesome6 size={24} name="crown" color={"gold"} />
                </Pressable>
              );
            },
          }}
        />
      </Stack>
    </>
  );
};

export default _layout;
