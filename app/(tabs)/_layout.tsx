import * as Notifications from "expo-notifications";
import { Redirect, router, Tabs } from "expo-router";
import React, { useCallback, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

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

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Hook to set up notification listeners once
const useNotificationListeners = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        dispatch(addNotificationCount(1));
      }
    );
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const { action } = response.notification.request.content.data;
        if (action === "mood") {
          router.push("/chat-bot");
        }
        if (action === "pro") {
          dispatch({ type: "initialize/setIsFirstModalShow", payload: true });
        }
      });
    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, [dispatch]);
};

export default function TabLayout() {
  const dispatch = useDispatch();

  // Individual selectors to minimise re-renders
  const isFirstModalShow = useAppSelector(
    (state) => state.initialize.isFirstModalShow
  );
  const showNotProModal = useAppSelector((state) => state.pro.showNotProModal);
  const isSleepMode = useAppSelector((state) => state.sleepMode.isSleepMode);
  const isInitialized = useAppSelector(
    (state) => state.initialize.isInitialized
  );
  const meditationTimer = useAppSelector(
    (state) => state.initialize.meditationTimer
  );
  const moods = useAppSelector((state) => state.mood);
  const isNotificationEnabled = useAppSelector(
    (state) => state.settings.moodNotification
  );
  const { authorized } = useAuth();

  const [sendOldMoods] = useSendPrevMoodsMutation();
  const [initialNotification] = useInitializeNotificationsMutation();
  const { data } = useCheckVersionQuery({ version: "1.1.0" });

  const [showUpdateModal, setShowUpdateModal] = React.useState(false);
  const hasSentOldMoods = useRef(false);
  const isSetupDone = useRef(false);

  // Show update modal when a new version is available
  useEffect(() => {
    if (data?.isNewVersionAvailable) {
      setShowUpdateModal(true);
    }
  }, [data]);

  // One‑time setup: permissions, push token, old moods, initial notification scheduling
  useEffect(() => {
    if (!authorized || isSetupDone.current) return;

    const setup = async () => {
      // 🔧 FIX: getNotificationsPermissions() returns void – just call it, don't test truthiness
      await getNotificationsPermissions();

      const pushToken = await registerForPushNotificationsAsync();
      if (pushToken) {
        await initialNotification({ pushToken });
      }

      // Send old moods only once
      if (moods.length > 0 && !hasSentOldMoods.current) {
        await sendOldMoods(moods);
        hasSentOldMoods.current = true;
      }

      // Schedule daily notification if enabled
      if (isNotificationEnabled) {
        await scheduleDailyNotification(meditationTimer);
      }
    };

    setup().finally(() => {
      isSetupDone.current = true;
    });
  }, [authorized]); // Only depends on authorized

  // Re‑schedule daily notification when the setting or timer changes (after initial setup)
  useEffect(() => {
    if (isSetupDone.current && authorized) {
      scheduleDailyNotification(meditationTimer);
    }
  }, [isNotificationEnabled, meditationTimer, authorized]);

  // Attach notification listeners exactly once
  useNotificationListeners();

  const sleepModeHandler = useCallback(
    (val: boolean) => {
      dispatch(setSleepMode(val));
    },
    [dispatch]
  );

  const handleDismissNotProModal = useCallback(() => {
    dispatch({
      type: "pro/setShowNotProModal",
      payload: { message: "", showNotProModal: false },
    });
  }, [dispatch]);

  const handleDismissProModal = useCallback(() => {
    dispatch({ type: "initialize/setIsFirstModalShow", payload: false });
  }, [dispatch]);

  // Early redirects
  if (!isInitialized) return <Redirect href="/auth/start" />;
  if (!authorized) return <Redirect href="/auth/login" />;

  return (
    <>
      <Tabs
        tabBar={(props) => (
          <AnimatedTabBar {...props} isSleepMode={isSleepMode} />
        )}
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: "none" },
          lazy: true,
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
            focus: () => sleepModeHandler(true),
            blur: () => sleepModeHandler(false),
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

      {isFirstModalShow && (
        <ProPlanFullScreenModal
          visible={isFirstModalShow}
          onClose={handleDismissProModal}
        />
      )}
      {showUpdateModal && (
        <UpdateModal
          showActionsheet={showUpdateModal}
          handleClose={() => setShowUpdateModal(false)}
        />
      )}
      {showNotProModal && (
        <NotProModal
          showStreakModal={showNotProModal}
          onClose={handleDismissNotProModal}
        />
      )}
    </>
  );
}
