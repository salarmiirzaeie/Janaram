import { Stack } from "expo-router";
import React from "react";

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: "مود من",
          headerTitleAlign: "center",
          headerTitleStyle: { fontFamily: "vazirBold" },
          statusBarStyle: "dark",
        }}
      />
    </Stack>
  );
};

export default _layout;
