import { Stack } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const _layout = () => {
  return (
    <SafeAreaView className="flex-1">
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
          name="goal-select"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="select-time"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="mood-tracking"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="personalizing"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="robot-introduce"
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
    </SafeAreaView>
  );
};

export default _layout;
