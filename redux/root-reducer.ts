import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "./auth/auth-slice";
import initializeSlice from "./intialize/initialize-slice";
import moodSlice from "./mood/mood-slice";
import settingsSlice from "./settings/settings-slice";
import sleepSlice from "./sleep-mode/sleep-slice";

export const rootReducer = combineReducers({
  sleepMode: sleepSlice,
  initialize: initializeSlice,
  mood: moodSlice,
  settings: settingsSlice,
  auth: authSlice,
});
