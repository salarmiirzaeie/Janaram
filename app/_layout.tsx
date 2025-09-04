import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { AudioPlayerProvider } from "@/context/AudioPlayerContext";
import "@/global.css";
import { persistor, store } from "@/redux/store";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

// Trigger a layout animation

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
                    name="breathingPlayer"
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
                    name="streak"
                    options={{
                      headerShown: true,
                      headerTitleAlign: "center",
                      headerTitleStyle: { fontFamily: "vazirBold" },
                      headerTitle: "جانارام",
                    }}
                  />
                  <Stack.Screen
                    name="train"
                    options={{
                      headerShown: true,
                      headerTitleAlign: "center",
                      headerTitleStyle: { fontFamily: "vazirBold" },
                      headerTitle: "تمرین روز",
                    }}
                  />
                  <Stack.Screen
                    name="auth"
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
                      // headerRight(props) {
                      //   return (
                      //     <Pressable className="items-center w-10" onPress={() => router.navigate("/chat-history")}>
                      //       <FontAwesome5 size={24} name="history" color={"#000"} />
                      //     </Pressable>
                      //   );
                      // },
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
                </Stack>
                <StatusBar barStyle="dark-content" backgroundColor={"#fff"} />
              </GestureHandlerRootView>
            </SafeAreaProvider>
          </AudioPlayerProvider>
        </GluestackUIProvider>
      </PersistGate>
    </Provider>
  );
}
