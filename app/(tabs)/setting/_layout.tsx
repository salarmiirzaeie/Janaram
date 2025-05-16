import { Stack } from "expo-router";
import React from "react";

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: "تنظیمات",
          headerTitleAlign: "center",
          headerTitleStyle: { fontFamily: "vazirBold" },
        }}
      />
    </Stack>
  );
};

export default _layout;
