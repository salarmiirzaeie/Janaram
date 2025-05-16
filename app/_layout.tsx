import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { AudioPlayerProvider } from "@/context/AudioPlayerContext";
import "@/global.css";
import { persistor, store } from "@/redux/store";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { LogBox } from "react-native";
import "react-native-reanimated";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

// Trigger a layout animation
LogBox.ignoreLogs([
  "setLayoutAnimationEnabledExperimental is currently a no-op in the New Architecture",
]);

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
                  headerTitle: "نوتیفیکیشن",
                }}
              />
            </Stack>
            {/* <StatusBar style="auto" /> */}
          </AudioPlayerProvider>
        </GluestackUIProvider>
      </PersistGate>
    </Provider>
  );
}
