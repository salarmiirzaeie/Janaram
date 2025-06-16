import Logo from "@/components/ui/logo";
import { Pressable } from "@/components/ui/pressable";
import { EvilIcons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
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
          }}
        />
      </Stack>
    </>
  );
};

export default _layout;
