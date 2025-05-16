import { Tabs } from "expo-router";
import React from "react";

import { useAppSelector } from "@/hooks/useAppSelector";
import { setSleepMode } from "@/redux/sleep-mode/sleep-slice";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";

export default function TabLayout() {
  const { isSleepMode } = useAppSelector((state) => state.sleepMode);
  const dispatch = useDispatch();
  const sleepModeHandler = (val: boolean) => {
    dispatch(setSleepMode(val));
  };
  return (
    <Tabs
      screenOptions={{
        tabBarLabelStyle: {
          fontFamily: "vazirBold",
        },
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isSleepMode ? "#1D1C1C" : "#ffff",
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "خانه",
          tabBarIcon: ({ color }) => (
            <AntDesign size={24} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "مدیتیشن",
          tabBarIcon: ({ color }) => (
            <Ionicons size={24} name="leaf-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sleep"
        options={{
          title: "خواب خوب",
          tabBarIcon: ({ color }) => (
            <Feather size={24} name="moon" color={color} />
          ),
        }}
        listeners={{
          focus: () => {
            sleepModeHandler(true);
          },
          blur: () => {
            sleepModeHandler(false);
          },
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: "مود من",
          tabBarIcon: ({ color }) => (
            <AntDesign size={24} name="linechart" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="setting"
        options={{
          title: "تنظیمات",
          tabBarIcon: ({ color }) => (
            <AntDesign size={24} name="setting" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
