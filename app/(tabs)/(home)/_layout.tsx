import Logo from "@/components/ui/logo";
import { Pressable } from "@/components/ui/pressable";
import { EvilIcons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
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
            return (
              <Pressable onPress={() => router.navigate("/notifications")}>
                <EvilIcons size={32} name="bell" color={"#A5C9F5"} />
              </Pressable>
            );
          },
          statusBarStyle: "dark",
        }}
      />
    </Stack>
  );
};

export default _layout;
