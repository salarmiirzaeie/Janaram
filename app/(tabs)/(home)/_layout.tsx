import Logo from "@/components/ui/logo";
import { useAppSelector } from "@/hooks/useAppSelector";
import { EvilIcons } from "@expo/vector-icons";
import { Redirect, router, Stack } from "expo-router";
import React from "react";
import { Pressable, StatusBar } from "react-native";

const _layout = () => {
  const { authorized } = useAppSelector((state) => state.auth);
  if (!authorized) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/login" />;
  }

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
                <Pressable className="items-center w-10" onPress={() => router.navigate("/notifications")}>
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
