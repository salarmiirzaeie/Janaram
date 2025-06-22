import { IMood } from "@/redux/mood/mood-slice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";
import * as BackgroundFetch from "expo-background-fetch";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";

export const TASK_NAME = "mood-reminder-task";

// ✅ تعریف گلوبال
TaskManager.defineTask(TASK_NAME, async () => {
  const now = new Date();
  const currentHour = now.getHours();

  if (currentHour === 21) {
    const today = format(now, "yyyy-MM-dd");
    const entries = await getPersistedMoodEntries();
    const hasTodayMood = entries.some((entry) => entry.date === today && entry.mood !== null);

    if (!hasTodayMood) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "یادت نره حالتو ثبت کنی 😶",
          body: "همین الان حس‌تو ثبت کن. فقط یه دقیقه وقت می‌گیره.",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.LOCAL_TIME,
          seconds: 1,
        },
      });
      console.log("📦 Task Running...");
    }
  }

  return BackgroundFetch.BackgroundFetchResult.NewData;
});

// ✅ ثبت background task
export async function registerMoodReminderTask() {
  const isTaskDefined = TaskManager.isTaskDefined(TASK_NAME);
  const status = await BackgroundFetch.getStatusAsync();
  if (status !== BackgroundFetch.BackgroundFetchStatus.Available) {
    console.warn("⛔ Background fetch not available");
    return;
  }

  const tasks = await TaskManager.getRegisteredTasksAsync();
  const alreadyRegistered = tasks.some((task) => task.taskName === TASK_NAME);
  if (!alreadyRegistered && isTaskDefined) {
    await BackgroundFetch.registerTaskAsync(TASK_NAME, {
      minimumInterval: 60 * 60, // هر یک ساعت یک‌بار چک کنه
      stopOnTerminate: false,
      startOnBoot: true,
    });
    console.log("✅ Background task registered");
  }
}
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
