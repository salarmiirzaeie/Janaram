import { Tabs } from "expo-router";
import React from "react";

import { AntDesign, Ionicons, SimpleLineIcons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarLabelStyle: {
          fontFamily: "vazirBold",
        },
        headerShown: false,
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
        name="tests"
        options={{
          title: "تست",
          tabBarIcon: ({ color }) => (
            <SimpleLineIcons size={24} name="trophy" color={color} />
          ),
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
