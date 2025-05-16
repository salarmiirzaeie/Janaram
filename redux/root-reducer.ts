import { combineReducers } from "@reduxjs/toolkit";
import sleepSlice from "./sleep-mode/sleep-slice";

export const rootReducer = combineReducers({
  sleepMode: sleepSlice,
});
