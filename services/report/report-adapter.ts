import { apiSlice } from "@/redux/api-slice";
interface MoodHistoryItem {
  _id: string;
  date: string;
  mood: number | null;
  note?: string;
}

interface MoodHistoryResponse {
  success: boolean;
  data: MoodHistoryItem[];
  pagination: {
    totalRecords: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}
const reportAdapter = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMoodReport: builder.query<
      MoodHistoryResponse,
      {
        page: number;
        limit: number;
      }
    >({
      query: (data) => ({
        url: "report",
        method: "GET",
        params: data,
      }),
    }),
  }),
});

// Export hooks
export const { useGetMoodReportQuery } = reportAdapter;
