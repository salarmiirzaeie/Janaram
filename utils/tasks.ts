import { IMood } from "@/redux/mood/mood-slice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";
import * as BackgroundFetch from "expo-background-fetch";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";

const TASK_NAME = "mood-reminder-task";

TaskManager.defineTask(TASK_NAME, async () => {
  const now = new Date();
  const currentHour = now.getHours();

  // فقط بین ساعت 21 تا 22 اجرا کن
  if (currentHour === 21) {
    const today = format(now, "yyyy-MM-dd");
    const entries = await getPersistedMoodEntries();
    const hasTodayMood = entries.some((entry) => entry.date === today && entry.mood !== null);

    if (!hasTodayMood) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "یادت نره مودتو ثبت کنی 😶",
          body: "همین الان حس‌تو ثبت کن. فقط یه دقیقه وقت می‌گیره.",
        },
        trigger: null,
      });
    }
  }

  return BackgroundFetch.BackgroundFetchResult.NewData;
});

export default TASK_NAME;

export const getPersistedMoodEntries = async (): Promise<IMood[]> => {
  try {
    const rootStateJson = await AsyncStorage.getItem("persist:root");
    if (!rootStateJson) return [];

    const rootState = JSON.parse(rootStateJson);
    const moodJson = rootState.mood;
    if (!moodJson) return [];

    const moodEntries = JSON.parse(moodJson) as IMood[];
    return moodEntries;
  } catch (error) {
    console.error("خطا در گرفتن مودهای ذخیره‌شده:", error);
    return [];
  }
};

export const registerMoodReminderTask = async () => {
  const isRegistered = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
  if (!isRegistered) {
    await BackgroundFetch.registerTaskAsync(TASK_NAME, {
      minimumInterval: 60 * 60, // هر 1 ساعت یک بار
      stopOnTerminate: false,
      startOnBoot: true,
    });
  }
};

export async function requestPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    alert("امکان ارسال نوتیفیکیشن فعال نیست");
  }
}
