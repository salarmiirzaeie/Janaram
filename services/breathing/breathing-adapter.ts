import { apiSlice } from "@/redux/api-slice";
import { Meditation } from "@/types";

const breathingAdapter = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBreathing: builder.query<{ meditation: Meditation }, { id: string }>({
      query: ({ id }) => ({
        url: `breathing/${id}`,
        method: "GET",
      }),
    }),
  }),
});

// Export hooks
export const { useGetBreathingQuery, useLazyGetBreathingQuery } = breathingAdapter;
