import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string | null;
  // refreshToken: string | null;
  authorized: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  // refreshToken: null,
  authorized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<{ accessToken: string }>) => {
      state.accessToken = action.payload.accessToken;
      // state.refreshToken = action.payload.refreshToken;
      // state.authorized = true;
    },
    logout: (state) => {
      state.accessToken = null;
      // state.refreshToken = null;
      state.authorized = false;
    },
    setAuthorized: (state, action: PayloadAction<boolean>) => {
      state.authorized = action.payload;
    },
  },
});

export const { setTokens, logout, setAuthorized } = authSlice.actions;
export default authSlice.reducer;
