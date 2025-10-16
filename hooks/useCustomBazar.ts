import { Platform } from "react-native";

let useCustomBazar: any = () => {
  // fallback for non-Android platforms
  console.warn("useBazaar is only available on Android.");
  return null;
};

if (Platform.OS === "android") {
  useCustomBazar = require("@cafebazaar/react-native-poolakey").useBazaar;
}

export default useCustomBazar;
