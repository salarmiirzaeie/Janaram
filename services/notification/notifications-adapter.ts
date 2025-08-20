import { apiSlice } from "@/redux/api-slice";

const notificationsAdapter = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    initializeNotifications: builder.mutation<any, { pushToken: string }>({
      query: (data) => ({
        url: "notifications/initialize",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

// Export hooks
export const { useInitializeNotificationsMutation } = notificationsAdapter;
