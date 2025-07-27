import { configureStore } from "@reduxjs/toolkit";

import { PERSIST, REHYDRATE, persistReducer, persistStore } from "redux-persist";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiSlice } from "./api-slice";
import { rootReducer } from "./root-reducer";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["initialize", "mood", "settings", "auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [PERSIST, REHYDRATE],
        serializableCheck: false,
      },
    }).concat([apiSlice.middleware]),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
