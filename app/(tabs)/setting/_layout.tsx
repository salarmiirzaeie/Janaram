import { Stack } from "expo-router";
import React from "react";

const _layout = () => {
  return (
    <>
      {/* <StatusBar backgroundColor="#fff" barStyle="dark-content" /> */}
      <Stack screenOptions={{ headerBackTitle: "بازگشت" }}>
        <Stack.Screen
          name="index"
          options={{
            headerShown: true,
            title: "پروفایل",
            headerTitleAlign: "center",
            headerTitleStyle: { fontFamily: "vazirBold" },
          }}
        />
        <Stack.Screen
          name="edit-profile"
          options={{
            headerShown: true,
            title: "پروفایل",
            headerTitleAlign: "center",
            headerTitleStyle: { fontFamily: "vazirBold" },
          }}
        />
      </Stack>
    </>
  );
};

export default _layout;
