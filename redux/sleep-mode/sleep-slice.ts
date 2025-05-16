import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface sleepState {
  isSleepMode: boolean;
}

const initialState: sleepState = {
  isSleepMode: false,
};

const sleepSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSleepMode: (state, action: PayloadAction<boolean>) => {
      state.isSleepMode = action.payload;
    },
  },
});

export const { setSleepMode } = sleepSlice.actions;
export default sleepSlice.reducer;
