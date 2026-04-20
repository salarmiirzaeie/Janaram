import { apiSlice } from "@/redux/api-slice";
import { Meditation } from "@/types";

// Define response types
interface GetBreathingResponse {
  success: boolean;
  meditation: Meditation;
}

interface GetBreathingsResponse {
  success: boolean;
  data: Meditation[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

const breathingAdapter = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get single breathing/meditation
    getBreathing: builder.query<GetBreathingResponse, { id: string }>({
      query: ({ id }) => ({
        url: `breathing/${id}`,
        method: "GET",
      }),
    }),
    getBreathings: builder.query<GetBreathingsResponse, null>({
      query: () => ({
        url: `breathing`,
        method: "GET",
      }),
    }),
  }),
});

// Export hooks
export const {
  useGetBreathingQuery,
  useLazyGetBreathingQuery,
  useGetBreathingsQuery,
} = breathingAdapter;
