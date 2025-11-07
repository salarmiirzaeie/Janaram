import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface proState {
  showNotProModal: boolean;
  message: string;
}

const initialState: proState = {
  showNotProModal: false,
  message: "",
};

const proSlice = createSlice({
  name: "pro",
  initialState,
  reducers: {
    setShowNotProModal: (
      state,
      action: PayloadAction<{ message: string; showNotProModal: boolean }>
    ) => {
      state.showNotProModal = action.payload.showNotProModal;
      state.message = action.payload.message;
    },
  },
});

export const { setShowNotProModal } = proSlice.actions;
export default proSlice.reducer;
