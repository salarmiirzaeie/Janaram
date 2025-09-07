import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface initialState {
  isInitialized: boolean;
  meditationTimer: number;
  goal: string[];
  isFirstModalShow: boolean;
  isCommented: boolean;
}

const initialState: initialState = {
  isInitialized: false,
  meditationTimer: 11,
  goal: [],
  isFirstModalShow: true,
  isCommented: false,
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
    setIsFirstModalShow: (state, action: PayloadAction<boolean>) => {
      state.isFirstModalShow = action.payload;
    },
    setIsCommented: (state, action: PayloadAction<boolean>) => {
      state.isCommented = action.payload;
    },
  },
});

export const { setIsInitialized, setMeditationTimer, setGoal, setIsFirstModalShow, setIsCommented } =
  initializeSlice.actions;
export default initializeSlice.reducer;
