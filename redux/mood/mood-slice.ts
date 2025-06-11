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
    setMood: (state, action: PayloadAction<{ date: string; mood: number; note?: string }>) => {
      const { date, mood, note } = action.payload;

      const index = state.findIndex((entry) => entry.date === date);
      if (index !== -1) {
        state[index] = { date, mood, note };
      } else {
        state.push({ date, mood, note });

        // مرتب‌سازی براساس تاریخ (صعودی)
        state.sort((a, b) => a.date.localeCompare(b.date));

        // حذف مودهای قدیمی اگر بیشتر از ۳۰ تا شد
        while (state.length > 30) {
          state.shift(); // حذف قدیمی‌ترین
        }
      }
    },
  },
});

export const { setMood } = moodSlice.actions;
export default moodSlice.reducer;
