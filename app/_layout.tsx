import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { AudioPlayerProvider } from "@/context/AudioPlayerContext";
import "@/global.css";
import { persistor, store } from "@/redux/store";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

// Trigger a layout animation
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});
const DAILY_NOTIFICATION_ID = "daily-9am-notification";

export default function RootLayout() {
  const [loaded] = useFonts({
    vazir: require("@/assets/fonts/vazir-medium.ttf"),
    vazirBold: require("@/assets/fonts/vazir-bold.ttf"),
    iranSans: require("@/assets/fonts/Iranian-sans.ttf"),
  });
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
      console.log("Cancelled existing daily notification (if any).");
    } catch (error) {
      console.error("Error cancelling existing notification:", error);
    }

    // 3. Define the trigger for the daily notification.
    // We want it to repeat daily at 9:00 AM.
    const trigger: Notifications.DailyTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 21,
      minute: 0,
    };

    // 4. Schedule the notification.
    try {
      const scheduledId = await Notifications.scheduleNotificationAsync({
        identifier: DAILY_NOTIFICATION_ID, // Assign our unique ID
        content: {
          title: "یادت نره حالتو ثبت کنی 😶",
          body: "همین الان حس‌تو ثبت کن. فقط یه دقیقه وقت می‌گیره.",
          data: { type: "daily_check_in" }, // Optional data payload
          sound: true, // Use default notification sound
        },
        trigger,
      });
    } catch (error) {
      console.error("Error scheduling notification:", error);
    }
  };

  useEffect(() => {
    async function setup() {
      const { status } = await Notifications.requestPermissionsAsync();

      if (status === "granted") {
        await scheduleDailyNotification();
      }
    }
    setup();
  }, []);
  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <GluestackUIProvider mode="light">
          <AudioPlayerProvider>
            <SafeAreaProvider
              style={{
                flex: 1,
              }}
            >
              <GestureHandlerRootView>
                <Stack>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="player"
                    options={{
                      headerShown: true,
                      headerTitleAlign: "center",
                      headerTitleStyle: { fontFamily: "vazirBold" },
                      headerTitle: "",
                      headerShadowVisible: false,
                    }}
                  />
                  <Stack.Screen
                    name="notifications"
                    options={{
                      headerShown: true,
                      headerTitleAlign: "center",
                      headerTitleStyle: { fontFamily: "vazirBold" },
                      headerTitle: "پیام ها",
                    }}
                  />
                  <Stack.Screen
                    name="chat-bot"
                    options={{
                      headerShown: true,
                      headerTitleAlign: "center",
                      headerTitleStyle: { fontFamily: "vazirBold" },
                      headerTitle: "چت بات جان آرام",
                    }}
                  />
                </Stack>
              </GestureHandlerRootView>
            </SafeAreaProvider>
          </AudioPlayerProvider>
        </GluestackUIProvider>
      </PersistGate>
    </Provider>
  );
}
