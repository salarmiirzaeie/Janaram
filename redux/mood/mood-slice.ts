import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { eachDayOfInterval, format, subDays } from "date-fns";

export interface IMood {
  date: string; // YYYY-MM-DD
  mood: number | null;
  note?: string;
}

const getLast7Days = (): IMood[] => {
  const today = new Date();
  const last7Days = eachDayOfInterval({
    start: subDays(today, 6),
    end: today,
  });

  return last7Days.map((day) => ({
    date: format(day, "yyyy-MM-dd"),
    mood: null,
  }));
};

const initialState: IMood[] = getLast7Days();

const moodSlice = createSlice({
  name: "mood",
  initialState,
  reducers: {
    setMood: (
      state,
      action: PayloadAction<{ date: string; mood: number; note?: string }>
    ) => {
      const { date, mood, note } = action.payload;

      // اگر تاریخ موردنظر وجود داشت، آن را آپدیت کن
      const index = state.findIndex((entry) => entry.date === date);
      if (index !== -1) {
        state[index] = { date, mood, note };
      } else {
        // اگر وجود نداشت، آن را اضافه کن و مطمئن شو فقط ۷ روز هست
        state.push({ date, mood, note });
        // مرتب‌سازی براساس تاریخ
        state.sort((a, b) => a.date.localeCompare(b.date));
        // حذف روزهای اضافه
        while (state.length > 7) {
          state.shift();
        }
      }
    },
    syncLast7Days: (state) => {
      const today = new Date();
      const last7Dates = eachDayOfInterval({
        start: subDays(today, 6),
        end: today,
      }).map((d) => format(d, "yyyy-MM-dd"));

      const newState: IMood[] = last7Dates.map((date) => {
        const found = state.find((entry) => entry.date === date);
        return found ?? { date, mood: null };
      });

      return newState;
    },
  },
});

export const { setMood, syncLast7Days } = moodSlice.actions;
export default moodSlice.reducer;
