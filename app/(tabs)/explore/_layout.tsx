import { Stack } from "expo-router";
import React from "react";

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false, statusBarStyle: "dark" }} />
      <Stack.Screen
        name="all-files"
        options={{
          headerShown: true,
          title: "",
          headerTitleAlign: "center",
          headerTitleStyle: { fontFamily: "vazirBold", color: "#0000" },
          headerShadowVisible: false,
          statusBarStyle: "dark",
          headerTintColor: "#000",
        }}
      />
    </Stack>
  );
};

export default _layout;
