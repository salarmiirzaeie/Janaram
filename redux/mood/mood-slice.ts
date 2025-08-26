import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IMood {
  date: string; // YYYY-MM-DD
  mood: number | null;
  note?: string;
}

const initialState: IMood[] = [];

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
    clearMoods: () => {
      return [];
    },
  },
});

export const { setMood, clearMoods } = moodSlice.actions;
export default moodSlice.reducer;
