import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { AudioPlayerProvider } from "@/context/AudioPlayerContext";
import "@/global.css";
import { persistor, store } from "@/redux/store";
import { registerMoodReminderTask } from "@/utils/tasks";
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

export default function RootLayout() {
  const [loaded] = useFonts({
    vazir: require("@/assets/fonts/vazir-medium.ttf"),
    vazirBold: require("@/assets/fonts/vazir-bold.ttf"),
    iranSans: require("@/assets/fonts/Iranian-sans.ttf"),
  });
  useEffect(() => {
    async function setup() {
      const { status } = await Notifications.requestPermissionsAsync();

      if (status === "granted") {
        await registerMoodReminderTask();
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
