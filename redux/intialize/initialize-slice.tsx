import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface initialState {
  isInitialized: boolean;
}

const initialState: initialState = {
  isInitialized: false,
};

const initializeSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
  },
});

export const { setIsInitialized } = initializeSlice.actions;
export default initializeSlice.reducer;
