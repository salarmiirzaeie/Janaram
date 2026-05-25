import { apiSlice } from "@/redux/api-slice";
import * as ExpoLinking from "expo-linking";
import { router } from "expo-router";
import { useEffect } from "react";
import { Linking } from "react-native";
import { useDispatch } from "react-redux";

function parseQueryParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default function DeepLinkHandler() {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const parsed = ExpoLinking.parse(event.url);
      const status = parseQueryParam(parsed.queryParams?.status);
      const type = parseQueryParam(parsed.queryParams?.type);
      const refId = parseQueryParam(parsed.queryParams?.ref_id);

      if (type && type !== "appointment") {
        return;
      }

      dispatch(apiSlice.util.invalidateTags(["UserAppointments"]));

      if (status === "success") {
        router.dismissTo({
          pathname: "/(tabs)/(home)/success",
          params: { refId: refId ?? "", type: "appointment" },
        });
      } else if (status === "failed" || status === "error") {
        router.dismissTo({
          pathname: "/(tabs)/(home)/failed",
          params: { type: "appointment" },
        });
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => subscription.remove();
  }, [dispatch]);

  return null;
}
