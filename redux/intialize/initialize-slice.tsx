import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface initialState {
  isInitialized: boolean;
  meditationTimer: number;
  goal: string[];
}

const initialState: initialState = {
  isInitialized: false,
  meditationTimer: 0,
  goal: [],
};

const initializeSlice = createSlice({
  name: "initialize",
  initialState,
  reducers: {
    setIsInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
    setMeditationTimer: (state, action: PayloadAction<number>) => {
      state.meditationTimer = action.payload;
    },
    setGoal: (state, action: PayloadAction<string[]>) => {
      state.goal = action.payload;
    },
  },
});

export const { setIsInitialized, setMeditationTimer, setGoal } = initializeSlice.actions;
export default initializeSlice.reducer;
