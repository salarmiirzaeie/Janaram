import { Stack } from "expo-router";
import React from "react";

const _layout = () => {
  return (
    <>
      <Stack screenOptions={{ statusBarStyle: "light" }}>
        <Stack.Screen
          name="index"
          options={{
            headerShown: true,
            title: " 🌙 خواب خوب",
            headerTitleAlign: "center",
            headerTitleStyle: { fontFamily: "vazirBold", color: "#fff" },
            headerStyle: { backgroundColor: "rgba(29, 28, 28, 0.95)" },
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="all-musics"
          options={{
            headerShown: true,
            title: " 🌙 خواب خوب",
            headerTitleAlign: "center",
            headerTitleStyle: { fontFamily: "vazirBold", color: "#fff" },
            headerStyle: { backgroundColor: "rgba(29, 28, 28, 0.95)" },
            headerShadowVisible: false,
            headerTintColor: "#fff",
          }}
        />
      </Stack>
    </>
  );
};

export default _layout;
