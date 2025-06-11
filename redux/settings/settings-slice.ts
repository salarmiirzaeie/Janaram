import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface initialState {
  moodNotification: boolean;
  newMeditationsNotification: boolean;
}

const initialState: initialState = {
  moodNotification: true,
  newMeditationsNotification: true,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setMoodNotification: (state, action: PayloadAction<boolean>) => {
      state.moodNotification = action.payload;
    },
    setNewMeditationsNotification: (state, action: PayloadAction<boolean>) => {
      state.newMeditationsNotification = action.payload;
    },
  },
});

export const { setMoodNotification, setNewMeditationsNotification } = settingsSlice.actions;
export default settingsSlice.reducer;
