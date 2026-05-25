import FloatingSupportButton from "@/components/psychologist/floating-support-button";
import { Stack } from "expo-router";
import React from "react";

const _layout = () => {
  return (
    <>
      <Stack screenOptions={{ headerBackTitle: "بازگشت" }}>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <FloatingSupportButton />
    </>
  );
};

export default _layout;
