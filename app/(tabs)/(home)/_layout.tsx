import CustomHeader from "@/components/home/header";
import Logo from "@/components/ui/logo";
import { useAppSelector } from "@/hooks/useAppSelector";
import { Redirect, Stack } from "expo-router";
import React from "react";

const _layout = () => {
  const { authorized } = useAppSelector((state) => state.auth);

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
            return <CustomHeader />;
          },
        }}
      />

      <Stack.Screen
        name="success"
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          headerTitle: "پرداخت",
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="failed"
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          headerTitle: "پرداخت",
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
};

export default _layout;
