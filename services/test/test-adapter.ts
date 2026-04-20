import { apiSlice } from "@/redux/api-slice";

const testAdapter = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTests: builder.query<any, any>({
      query: () => ({
        url: `tests`,
        method: "GET",
      }),
    }),
    getSingleTest: builder.query<any, { id: string }>({
      query: ({ id }) => ({
        url: `tests/${id}`,
        method: "GET",
      }),
    }),
    submitTest: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `tests/${id}/submit`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

// Export hooks
export const {
  useGetTestsQuery,
  useGetSingleTestQuery,
  useSubmitTestMutation,
} = testAdapter;
