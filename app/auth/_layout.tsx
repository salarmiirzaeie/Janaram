import { Stack } from "expo-router";
import React from "react";

const _layout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="verifyOTP"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="start"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="enter-name"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
};

export default _layout;
