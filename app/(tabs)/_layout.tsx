import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/HapticTab";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AntDesign, Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarButton: HapticTab,
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
        name="tryouts"
        options={{
          title: "تست",
          tabBarIcon: ({ color }) => (
            <AntDesign size={24} name="appstore-o" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: "گزارش",
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
