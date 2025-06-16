import { Stack } from "expo-router";
import React from "react";
import { StatusBar } from "react-native";

const _layout = () => {
  return (
    <>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: true,
            title: "مود من",
            headerTitleAlign: "center",
            headerTitleStyle: { fontFamily: "vazirBold" },
          }}
        />
      </Stack>
    </>
  );
};

export default _layout;
