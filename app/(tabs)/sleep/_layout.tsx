import { Stack } from "expo-router";
import React from "react";
import { StatusBar } from "react-native";

const _layout = () => {
  return (
    <>
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      <Stack>
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
