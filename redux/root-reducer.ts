import { combineReducers } from "@reduxjs/toolkit";
import initializeSlice from "./intialize/initialize-slice";
import sleepSlice from "./sleep-mode/sleep-slice";

export const rootReducer = combineReducers({
  sleepMode: sleepSlice,
  initialize: initializeSlice,
});
