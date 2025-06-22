import Logo from "@/components/ui/logo";
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
            headerShown: true,
            headerTitleAlign: "center",
            headerTitle: () => <Logo className="h-10 w-16" />,
            headerShadowVisible: false,

            // headerRight() {
            //   return (
            //     <Pressable onPress={() => router.navigate("/notifications")}>
            //       <FontAwesome5 size={24} name="bell" color={"#A5C9F5"} />
            //     </Pressable>
            //   );
            // },
          }}
        />
      </Stack>
    </>
  );
};

export default _layout;
