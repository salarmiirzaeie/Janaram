import { apiSlice } from "@/redux/api-slice";
import { IMood } from "@/redux/mood/mood-slice";

const moodAdapter = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    setMood: builder.mutation<any, IMood>({
      query: (data) => ({
        url: "mood/set",
        method: "POST",
        body: data,
      }),
    }),
    updateMood: builder.mutation<any, IMood>({
      query: (data) => ({
        url: "mood/set",
        method: "PUT",
      }),
    }),
  }),
});

// Export hooks
export const { useSetMoodMutation, useUpdateMoodMutation } = moodAdapter;
