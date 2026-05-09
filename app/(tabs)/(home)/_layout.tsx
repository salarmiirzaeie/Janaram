import CustomHeader from "@/components/home/header";
import Logo from "@/components/ui/logo";
import { useAppSelector } from "@/hooks/useAppSelector";
import { apiSlice } from "@/redux/api-slice";
import { Redirect, router, Stack } from "expo-router";
import React, { useEffect } from "react";
import { Linking } from "react-native";
import { useDispatch } from "react-redux";

const _layout = () => {
  const { authorized } = useAppSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const url = event.url;
      const params = new URL(url).searchParams;
      const status = params.get("status");
      const refId = params.get("ref_id");
      if (status === "success") {
        // پرداخت موفق - رفتن به صفحه موفقیت
        dispatch(apiSlice.util.invalidateTags(["UserAppointments"]));

        router.push(`/success?refId=${refId}`);
      } else if (status === "failed") {
        // پرداخت ناموفق

        router.push("/failed");
      }
    };

    // ثبت event listener
    const subscription = Linking.addEventListener("url", handleDeepLink);

    // بررسی اگر اپ از قبل بسته بود و با لینک باز شد
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => subscription.remove();
  }, []);
  if (!authorized) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Stack screenOptions={{ headerBackTitle: "بازگشت" }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          headerTitle: () => <Logo className="h-10 w-16" />,
          headerShadowVisible: false,
          header(props) {
            return <CustomHeader />;
          },
        }}
      />

      <Stack.Screen
        name="success"
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          headerTitle: "پرداخت",
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="failed"
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          headerTitle: "پرداخت",
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
};

export default _layout;
