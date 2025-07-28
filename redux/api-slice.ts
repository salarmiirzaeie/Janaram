import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { Alert } from "react-native";
import { logout } from "./auth/auth-slice";
import { RootState } from "./store";
// const BASE_URL = process.env.EXPO_PUBLIC_JANARAM_API_URL;
const BASE_URL = "http://192.168.5.77:3000/api/";
// const BASE_URL = "http://localhost:3000/api/";
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (Headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.accessToken;

    if (token) {
      Headers.set("Authorization", `Bearer ${token}`);
    }
  },
});
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && !result.error.data) {
    if ("error" in result.error) {
      Alert.alert(
        result?.error?.status.toString(),

        result?.error?.error.split(":")[1]
      );
    }
  }

  if (result.error && result.error.status === 401) {
    api.dispatch(logout());
    api.dispatch(apiSlice.util.resetApiState());
  }

  return result;
};

export default baseQueryWithReauth;

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
  tagTypes: ["Plans"],
});
