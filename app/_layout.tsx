import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Pressable } from "@/components/ui/pressable";
import { AudioPlayerProvider } from "@/context/AudioPlayerContext";
import "@/global.css";
import { persistor, store } from "@/redux/store";
import { FontAwesome5 } from "@expo/vector-icons";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { router, Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
GoogleSignin.configure({
  // webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  webClientId: "866288850799-hl9scv2mt9r0g006et5nfpggtf03qi7m.apps.googleusercontent.com",
});
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
                    name="login"
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="verifyOTP"
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="chat-bot"
                    options={{
                      headerShown: true,
                      headerTitleAlign: "center",
                      headerTitleStyle: { fontFamily: "vazirBold" },
                      headerTitle: "روانشناس من",
                      headerRight(props) {
                        return (
                          <Pressable className="items-center w-10" onPress={() => router.navigate("/chat-history")}>
                            <FontAwesome5 size={24} name="history" color={"#000"} />
                          </Pressable>
                        );
                      },
                    }}
                  />
                  <Stack.Screen
                    name="subscription"
                    options={{
                      headerShown: true,
                      title: "اشتراک روانشناس من",
                      headerTitleAlign: "center",
                      headerTitleStyle: { fontFamily: "vazirBold" },
                    }}
                  />
                  <Stack.Screen
                    name="chat-history"
                    options={{
                      headerShown: true,
                      headerTitleAlign: "center",
                      headerTitleStyle: { fontFamily: "vazirBold" },
                      headerTitle: "تاریخچه چت ها",
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
