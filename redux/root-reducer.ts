import { combineReducers } from "@reduxjs/toolkit";
import { apiSlice } from "./api-slice";
import authSlice from "./auth/auth-slice";
import initializeSlice from "./intialize/initialize-slice";
import moodSlice from "./mood/mood-slice";
import notificationSlice from "./notifications/notifications-slice";
import proSlice from "./pro/pro-slice";
import settingsSlice from "./settings/settings-slice";
import sleepSlice from "./sleep-mode/sleep-slice";
export const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,

  sleepMode: sleepSlice,
  initialize: initializeSlice,
  mood: moodSlice,
  settings: settingsSlice,
  auth: authSlice,
  notification: notificationSlice,
  pro: proSlice,
});
