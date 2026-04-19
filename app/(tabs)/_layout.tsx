import { Redirect, router, Tabs } from "expo-router";
import React, { useEffect } from "react";

import AnimatedTabBar from "@/components/home/custom-tab";
import NotProModal from "@/components/home/not-pro-modal";
import ProPlanFullScreenModal from "@/components/home/pro-modal";
import UpdateModal from "@/components/settings/update-modal";
import { useAppSelector } from "@/hooks/useAppSelector";
import useAuth from "@/hooks/useAuth";
import { addNotificationCount } from "@/redux/notifications/notifications-slice";
import { setSleepMode } from "@/redux/sleep-mode/sleep-slice";
import { useSendPrevMoodsMutation } from "@/services/mood/mood-adapter";
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
  const { isFirstModalShow } = useAppSelector((state) => state.initialize);
  const { showNotProModal } = useAppSelector((state) => state.pro);
  const { isSleepMode } = useAppSelector((state) => state.sleepMode);
  const { isInitialized, meditationTimer } = useAppSelector(
    (state) => state.initialize
  );
  const moods = useAppSelector((state) => state.mood);
  const isNotificationEnabled = useAppSelector(
    (state) => state.settings.moodNotification
  );
  const [showUpdateModal, setShowUpdateModal] = React.useState(false);
  const { data } = useCheckVersionQuery({ version: "1.1.0" });
  const [initialNotification] = useInitializeNotificationsMutation();
  const { authorized } = useAuth();
  const [sendOldMoods] = useSendPrevMoodsMutation();
  const dispatch = useDispatch();
  const handleDismissNotProModal = () => {
    dispatch({
      type: "pro/setShowNotProModal",
      payload: {
        message: "",
        showNotProModal: false,
      },
    });
  };
  const handleDismissProModal = () => {
    dispatch({
      type: "initialize/setIsFirstModalShow",
      payload: false,
    });
  };
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
          console.log(moods, "moods");
          if (moods.length > 0) {
            sendOldMoods(moods);
          }

          if (isNotificationEnabled) {
            await scheduleDailyNotification(meditationTimer);
          }
        });
      }
    }
    setup();
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        dispatch(addNotificationCount(1));
      }
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response:", response);
        const { action } = response.notification.request.content.data;
        if (action === "mood") {
          router.push("/chat-bot"); // هدایت به صفحه چت‌بات
        }
        if (action === "pro") {
          dispatch({
            type: "initialize/setIsFirstModalShow",
            payload: true,
          });
        }
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
        tabBar={(props) => (
          <AnimatedTabBar {...props} isSleepMode={isSleepMode} />
        )}
        // screenOptions={{
        //   tabBarLabelStyle: {
        //     fontFamily: "vazirBold",
        //   },
        //   headerShown: false,
        //   tabBarStyle: {
        //     backgroundColor: isSleepMode ? "#1D1C1C" : "#ffff",
        //   },
        //   lazy: true,
        //   freezeOnBlur: true,
        //   tabBarActiveTintColor: "#47A9DA",
        // }}
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: "none" }, // Hide default tab bar
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
            title: "حال من",
            tabBarIcon: ({ color }) => (
              <AntDesign size={24} name="bar-chart" color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="setting"
          options={{
            title: "پروفایل",
            tabBarIcon: ({ color }) => (
              <Feather size={24} name="user" color={color} />
            ),
          }}
        />
      </Tabs>
      <ProPlanFullScreenModal
        visible={isFirstModalShow}
        onClose={handleDismissProModal}
      />
      <UpdateModal
        showActionsheet={showUpdateModal}
        handleClose={() => setShowUpdateModal(false)}
      />
      <NotProModal
        showStreakModal={showNotProModal}
        onClose={handleDismissNotProModal}
      />
    </>
  );
}
