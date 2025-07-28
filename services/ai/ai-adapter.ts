import { apiSlice } from "@/redux/api-slice";
import { ChatHistoryResponse } from "@/types";

const aiAdapter = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    startConversation: builder.mutation<any, { message: string; conversationId?: string }>({
      query: (data) => ({
        url: "conversation/start",
        method: "POST",
        body: data,
      }),
    }),
    getChatHistory: builder.query<ChatHistoryResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/conversation/history?page=${page}&limit=${limit}`,
        method: "GET",
      }),
    }),
  }),
});

// Export hooks
export const { useStartConversationMutation, useGetChatHistoryQuery } = aiAdapter;
