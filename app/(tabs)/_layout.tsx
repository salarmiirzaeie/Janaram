import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/HapticTab";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { HStack } from "@/components/ui/hstack";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AntDesign, EvilIcons, Ionicons } from "@expo/vector-icons";

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
        headerShown: true,
      }}
      initialRouteName="index"
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "خانه",
          tabBarIcon: ({ color }) => (
            <AntDesign size={24} name="home" color={color} />
          ),
          headerTitleAlign: "center",
          headerTitle: "جان آرام",
          headerLeft(props) {
            return (
              <HStack space="lg" className="items-center pl-6">
                <Avatar size="sm">
                  <AvatarImage
                    source={{
                      uri: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
                    }}
                  />
                </Avatar>
                <EvilIcons size={32} name="bell" color={Colors.light.tint} />
              </HStack>
            );
          },
          headerTitleStyle: {
            fontFamily: "vazirBold",
          },
          // headerShadowVisible: false,
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
        name="reports"
        options={{
          title: "گزارش",
          tabBarIcon: ({ color }) => (
            <AntDesign size={24} name="linechart" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "پروفایل",
          tabBarIcon: ({ color }) => (
            <AntDesign size={24} name="user" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
