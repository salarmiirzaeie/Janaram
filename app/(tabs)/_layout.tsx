import { Tabs } from "expo-router";
import React, { useEffect } from "react";

import { useAppSelector } from "@/hooks/useAppSelector";
import { setSleepMode } from "@/redux/sleep-mode/sleep-slice";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { useDispatch } from "react-redux";
import Start from "../start";
const DAILY_NOTIFICATION_ID = "daily-9am-notification";

export default function TabLayout() {
  const { isSleepMode } = useAppSelector((state) => state.sleepMode);
  const { isInitialized } = useAppSelector((state) => state.initialize);
  const isNotificationEnabled = useAppSelector((state) => state.settings.moodNotification);

  const dispatch = useDispatch();
  const sleepModeHandler = (val: boolean) => {
    dispatch(setSleepMode(val));
  };
  const scheduleDailyNotification = async () => {
    // 1. Request Permissions
    // Permissions are crucial. The user must grant permission for notifications.
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.warn(
        "Permission Denied: User needs to enable notification permissions in device settings to receive daily reminders."
      );
      // No Alert.alert here as there's no UI for user interaction
      return;
    }

    // 2. Cancel any existing daily notifications to prevent duplicates.
    // This is important to ensure only one daily notification is active.
    try {
      await Notifications.cancelScheduledNotificationAsync(DAILY_NOTIFICATION_ID);
    } catch (error) {
      console.error("Error cancelling existing notification:", error);
    }

    // 3. Define the trigger for the daily notification.
    // We want it to repeat daily at 9:00 AM.
    const trigger: Notifications.DailyTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 11,
      minute: 0,
    };
    // 4. Schedule the notification.
    try {
      if (isNotificationEnabled) {
        await Notifications.scheduleNotificationAsync({
          identifier: DAILY_NOTIFICATION_ID, // Assign our unique ID
          content: {
            title: "یادت نره حالتو ثبت کنی 😶",
            body: "همین الان حس‌تو ثبت کن. فقط یه دقیقه وقت می‌گیره.",
            data: { type: "daily_check_in" }, // Optional data payload
            sound: true, // Use default notification sound
          },
          trigger,
        }).then(() => {
          console.log("scheduled");
        });
      }
    } catch (error) {
      console.error("Error scheduling notification:", error);
    }
  };

  useEffect(() => {
    async function setup() {
      await scheduleDailyNotification();
    }
    setup();
  }, []);
  if (!isInitialized) {
    return <Start />;
  }

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
        lazy: true, // Keeps screens mounted after initial load
        freezeOnBlur: true, // Prevents re-rendering of inactive screens
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "خانه",
          tabBarIcon: ({ color }) => <AntDesign size={24} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "مدیتیشن",
          tabBarIcon: ({ color }) => <Ionicons size={24} name="leaf-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="sleep"
        options={{
          title: "خواب خوب",
          tabBarIcon: ({ color }) => <Feather size={24} name="moon" color={color} />,
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
          title: "حال من",
          tabBarIcon: ({ color }) => <AntDesign size={24} name="linechart" color={color} />,
        }}
      />

      <Tabs.Screen
        name="setting"
        options={{
          title: "تنظیمات",
          tabBarIcon: ({ color }) => <AntDesign size={24} name="setting" color={color} />,
        }}
      />
    </Tabs>
  );
}
