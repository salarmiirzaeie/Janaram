import { EvilIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React from "react";

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          headerTitle: "جان آرام",

          headerLeft(props) {
            return <EvilIcons size={32} name="bell" color={"#000"} />;
          },
          headerTitleStyle: {
            fontFamily: "vazirBold",
          },
          // headerShadowVisible: false,
        }}
      />
    </Stack>
  );
};

export default _layout;
