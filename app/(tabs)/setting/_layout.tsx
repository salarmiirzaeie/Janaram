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
            title: "تنظیمات",
            headerTitleAlign: "center",
            headerTitleStyle: { fontFamily: "vazirBold" },
          }}
        />
        {/* <Stack.Screen
          name="edit-profile"
          options={{
            headerShown: true,
            title: "پروفایل",
            headerTitleAlign: "center",
            headerTitleStyle: { fontFamily: "vazirBold" },
          }}
        /> */}
      </Stack>
    </>
  );
};

export default _layout;
