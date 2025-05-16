import Logo from "@/components/ui/logo";
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
          headerTitle: () => <Logo className="h-10 w-16" />,
          headerShadowVisible: false,

          headerRight() {
            return <EvilIcons size={32} name="bell" color={"gray"} />;
          },
        }}
      />
    </Stack>
  );
};

export default _layout;
