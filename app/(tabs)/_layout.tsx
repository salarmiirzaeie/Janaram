import { Redirect, Tabs } from "expo-router";
import React, { useEffect } from "react";

import UpdateModal from "@/components/settings/update-modal";
import { useAppSelector } from "@/hooks/useAppSelector";
import useAuth from "@/hooks/useAuth";
import { setSleepMode } from "@/redux/sleep-mode/sleep-slice";
import { useInitializeNotificationsMutation } from "@/services/notification/notifications-adapter";
import { useCheckVersionQuery } from "@/services/version/version-adapter";
import {
  getNotificationsPermissions,
  registerForPushNotificationsAsync,
  scheduleDailyNotification,
} from "@/utils/notifications";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { useDispatch } from "react-redux";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});
export default function TabLayout() {
  const { isSleepMode } = useAppSelector((state) => state.sleepMode);
  const { isInitialized } = useAppSelector((state) => state.initialize);
  const isNotificationEnabled = useAppSelector((state) => state.settings.moodNotification);
  const [showUpdateModal, setShowUpdateModal] = React.useState(false);
  const { data } = useCheckVersionQuery({ version: "1.0.8" });
  const [initialNotification] = useInitializeNotificationsMutation();
  const { authorized } = useAuth();
  const dispatch = useDispatch();
  const sleepModeHandler = (val: boolean) => {
    dispatch(setSleepMode(val));
  };
  useEffect(() => {
    if (data?.isNewVersionAvailable) {
      setShowUpdateModal(true);
    }
  }, [data]);
  useEffect(() => {
    async function setup() {
      if (authorized) {
        getNotificationsPermissions().then(async () => {
          const pusToken = await registerForPushNotificationsAsync();
          initialNotification({ pushToken: pusToken });

          if (isNotificationEnabled) {
            await scheduleDailyNotification();
          }
        });
      }
    }
    setup();
    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      console.log(notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, [isNotificationEnabled, authorized]);
  if (!isInitialized) {
    return <Redirect href="/auth/start" />;
  }
  if (!authorized) {
    return <Redirect href="/auth/login" />;
  }
  return (
    <>
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
            title: "پروفایل",
            tabBarIcon: ({ color }) => <AntDesign size={24} name="user" color={color} />,
          }}
        />
      </Tabs>
      <UpdateModal showActionsheet={showUpdateModal} handleClose={() => setShowUpdateModal(false)} />
    </>
  );
}
