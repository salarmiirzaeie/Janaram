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
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
};

export default _layout;
