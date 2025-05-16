import { Stack } from "expo-router";
import React from "react";

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false, statusBarStyle: "dark" }}
      />
    </Stack>
  );
};

export default _layout;
