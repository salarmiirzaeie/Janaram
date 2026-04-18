import { apiSlice } from "@/redux/api-slice";
import { Meditation } from "@/types";

const meditationAdapter = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    meditationsWithCategory: builder.query<any, { category: string }>({
      query: ({ category }) => ({
        url: `meditation`,
        method: "GET",
        params: { category },
      }),
    }),
    suggestedMeditations: builder.query<{ meditations: Meditation[] }, null>({
      query: () => ({
        url: `meditation/suggested`,
        method: "GET",
      }),
    }),
    getMeditation: builder.query<{ meditation: Meditation }, { id: string }>({
      query: ({ id }) => ({
        url: `meditation/${id}`,
        method: "GET",
      }),
    }),
    getMeditations: builder.query<{ meditations: Meditation[] }, null>({
      query: () => ({
        url: `meditations`,
        method: "GET",
      }),
    }),
    getExplore: builder.query<
      {
        meditations: {
          calm: Meditation[];
          love: Meditation[];
          instrumental: Meditation[];
          sleep: Meditation[];
          sleepMusic: Meditation[];
          nature: Meditation[];
          story: Meditation[];
          self: Meditation[];
        };
      },
      null
    >({
      query: () => ({
        url: `meditation/explore`,
        method: "GET",
      }),
    }),
  }),
});

// Export hooks
export const {
  useMeditationsWithCategoryQuery,
  useSuggestedMeditationsQuery,
  useGetMeditationQuery,
  useGetExploreQuery,
  useGetMeditationsQuery,
  useLazyGetMeditationQuery,
} = meditationAdapter;
