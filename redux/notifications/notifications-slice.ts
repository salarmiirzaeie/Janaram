import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface INotification {
  unReadNotifications: number;
}

const initialState: INotification = {
  unReadNotifications: 0,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotificationCount(state, action: PayloadAction<number>) {
      state.unReadNotifications += action.payload;
    },
    resetNotificationCount(state) {
      state.unReadNotifications = 0;
    },
  },
});

export const { addNotificationCount, resetNotificationCount } = notificationsSlice.actions;
export default notificationsSlice.reducer;
