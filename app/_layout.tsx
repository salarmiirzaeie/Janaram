import NetworkAct from "@/components/home/network-act";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { AudioPlayerProvider } from "@/context/AudioPlayerContext";
import "@/global.css";
import { persistor, store } from "@/redux/store";
import { useNetInfo } from "@react-native-community/netinfo";
import { Adivery } from "adivery";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { I18nManager, StatusBar } from "react-native";
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
  useEffect(() => {
    I18nManager.allowRTL(false);
    I18nManager.forceRTL(false);
    Adivery.configure("596f04bd-f6b5-4d70-9df6-f700e0ac1ab6");
  }, []);

  const netInfo = useNetInfo();
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
                backgroundColor: "white",
              }}
            >
              <GestureHandlerRootView>
                <Stack
                  screenOptions={{
                    headerBackTitle: "بازگشت",
                    headerBackTitleStyle: { fontFamily: "vazirBold" },
                    headerTitleStyle: { fontFamily: "vazirBold" },
                  }}
                >
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="player"
                    options={{
                      headerShown: false,
                      headerTitleAlign: "center",
                      headerTitleStyle: { fontFamily: "vazirBold" },
                      headerTitle: "",
                      headerShadowVisible: false,
                    }}
                  />
                  <Stack.Screen
                    name="breathings"
                    options={{
                      headerShown: true,
                      headerTitleAlign: "center",
                      headerTitle: "تنفس",
                      headerShadowVisible: false,
                    }}
                  />
                  <Stack.Screen
                    name="breathingPlayer"
                    options={{
                      headerShown: false,
                      headerTitleAlign: "center",
                      headerTitleStyle: { fontFamily: "vazirBold" },
                      headerTitle: "",
                      headerShadowVisible: false,
                    }}
                  />
                  <Stack.Screen
                    name="text-activity"
                    options={({ route }: any) => ({
                      headerShown: true,
                      headerTitleAlign: "center",
                      headerTitleStyle: { fontFamily: "vazirBold" },
                      headerTitle: route.params?.title ?? "", // 👈 read title from params
                      headerShadowVisible: false,
                    })}
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
                    name="tests"
                    options={{
                      headerShown: true,
                      headerTitleAlign: "center",
                      headerTitleStyle: { fontFamily: "vazirBold" },
                      headerTitle: " تست های روانشناسی",
                    }}
                  />
                  <Stack.Screen
                    name="result"
                    options={{
                      headerShown: true,
                      headerTitleAlign: "center",
                      headerTitleStyle: { fontFamily: "vazirBold" },
                      headerTitle: "نتیجه",
                    }}
                  />
                  <Stack.Screen
                    name="single-test"
                    options={{
                      headerShown: true,
                      headerTitleAlign: "center",
                      headerTitleStyle: { fontFamily: "vazirBold" },
                      headerTitle: " تست های روانشناسی",
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
                  <Stack.Screen
                    name="search-page"
                    options={({ route }: any) => {
                      return {
                        headerShown: false,
                      };
                    }}
                  />
                  <Stack.Screen
                    name="all-files"
                    options={({ route }: any) => {
                      const titleFromParams = route.params?.title || "";
                      return {
                        headerShown: true,
                        title: titleFromParams,
                        headerTitleAlign: "center",
                        headerTitleStyle: {
                          fontFamily: "vazirBold",
                          color: "#000",
                        },
                        headerShadowVisible: false,
                        headerTintColor: "#000",
                      };
                    }}
                  />
                </Stack>
                <StatusBar barStyle="dark-content" backgroundColor={"#fff"} />
                {!netInfo.isConnected && <NetworkAct />}
              </GestureHandlerRootView>
            </SafeAreaProvider>
          </AudioPlayerProvider>
        </GluestackUIProvider>
      </PersistGate>
    </Provider>
  );
}
