import { apiSlice } from "@/redux/api-slice";

const aiAdapter = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    startConversation: builder.mutation<any, { message: string }>({
      query: (data) => ({
        url: "conversation/start",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

// Export hooks
export const { useStartConversationMutation } = aiAdapter;
