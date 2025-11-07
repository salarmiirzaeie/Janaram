import { apiSlice } from "@/redux/api-slice";
import { ChatHistoryResponse } from "@/types";

const aiAdapter = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    startConversation: builder.mutation<
      any,
      { message: string; conversationId?: string }
    >({
      query: (data) => ({
        url: "conversation/start",
        method: "POST",
        body: data,
      }),
    }),
    analyzePersonality: builder.mutation<any, any>({
      query: () => ({
        url: "conversation/analyze-user",
        method: "POST",
      }),
    }),
    getChatHistory: builder.query<
      ChatHistoryResponse,
      { page: number; limit: number }
    >({
      query: ({ page = 1, limit = 10 }) => ({
        url: `conversation/chat-history`,
        method: "GET",
        params: { page, limit },
      }),
      serializeQueryArgs: ({ endpointName }) => endpointName,
      merge: (currentCache, newItems) => {
        if (newItems.data.pagination.page === 1) {
          return newItems;
        }
        return {
          ...newItems,
          data: {
            ...newItems.data,
            messages: [
              ...newItems.data.messages,
              ...currentCache.data.messages,
            ],
          },
        };
      },
      forceRefetch({ currentArg, previousArg }) {
        return true;
      },
    }),
  }),
});

// Export hooks
export const {
  useStartConversationMutation,
  useGetChatHistoryQuery,
  useAnalyzePersonalityMutation,
} = aiAdapter;
