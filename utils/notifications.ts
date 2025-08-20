import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
const DAILY_NOTIFICATION_ID = "daily-9am-notification";
export const getNotificationsPermissions = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    console.warn("Permission Denied: User needs to enable notification permissions.");
    return;
  }
};
function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}
export async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      handleRegistrationError("Permission not granted to get push token for push notification!");
      return;
    }
    const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError("Project ID not found");
    }
    try {
      const pushTokenString = (await Notifications.getDevicePushTokenAsync()).data;
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError("Must use physical device for push notifications");
  }
}

export const scheduleDailyNotification = async () => {
  try {
    await Notifications.cancelScheduledNotificationAsync(DAILY_NOTIFICATION_ID);
  } catch (error) {
    console.error("Error cancelling existing notification:", error);
  }

  // 3. Define the trigger for the daily notification.
  // We want it to repeat daily at 9:00 AM.
  const trigger: Notifications.DailyTriggerInput = {
    type: Notifications.SchedulableTriggerInputTypes.DAILY,
    hour: 11,
    minute: 0,
  };
  // 4. Schedule the notification.
  try {
    await Notifications.scheduleNotificationAsync({
      identifier: DAILY_NOTIFICATION_ID, // Assign our unique ID
      content: {
        title: "یادت نره حالتو ثبت کنی 😶",
        body: "همین الان حس‌تو ثبت کن. فقط یه دقیقه وقت می‌گیره.",
        data: { type: "daily_check_in" }, // Optional data payload
        sound: true, // Use default notification sound
      },
      trigger,
    }).then(() => {
      console.log("Notification scheduled successfully");
    });
  } catch (error) {
    console.error("Error scheduling notification:", error);
  }
};
