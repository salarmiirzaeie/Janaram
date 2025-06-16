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
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="all-files"
          options={({ route }: any) => {
            const titleFromParams = route.params?.title || "";
            return {
              headerShown: true,
              title: titleFromParams,
              headerTitleAlign: "center",
              headerTitleStyle: {
                fontFamily: "vazirBold",
                color: "#000",
              },
              headerShadowVisible: false,
              headerTintColor: "#000",
            };
          }}
        />
        <Stack.Screen
          name="search-page"
          options={({ route }: any) => {
            return {
              headerShown: false,
            };
          }}
        />
      </Stack>
    </>
  );
};

export default _layout;
