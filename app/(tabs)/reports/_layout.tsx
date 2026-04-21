import DefHeader from "@/components/header/def-header";
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
            headerShown: true,
            title: "حال من",
            headerTitleAlign: "center",
            headerTitleStyle: { fontFamily: "vazirBold" },
            header(props) {
              return <DefHeader title="حال من" />;
            },
          }}
        />
      </Stack>
    </>
  );
};

export default _layout;
