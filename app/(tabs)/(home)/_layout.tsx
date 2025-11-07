import CustomHeader from "@/components/home/header";
import Logo from "@/components/ui/logo";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useGetMoodQuery } from "@/services/mood/mood-adapter";
import { usePlansQuery } from "@/services/upgrade/upgrade-adapter";
import { Redirect, Stack } from "expo-router";
import React from "react";

const _layout = () => {
  const { authorized } = useAppSelector((state) => state.auth);
  const { data } = useGetMoodQuery({ page: 1, limit: 30 });
  const { data: plans } = usePlansQuery(null);
  const proPlan = plans?.data.plans?.find((plan) => plan.name === "unlimited");

  if (!authorized) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Stack screenOptions={{ headerBackTitle: "بازگشت" }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          headerTitle: () => <Logo className="h-10 w-16" />,
          headerShadowVisible: false,
          header(props) {
            return <CustomHeader data={data} proPlan={proPlan} />;
          },
        }}
      />
    </Stack>
  );
};

export default _layout;
