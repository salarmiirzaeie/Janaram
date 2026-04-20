import { apiSlice } from "@/redux/api-slice";

// Define the response type for the GET endpoint
interface CompleteExerciseResponse {
  success: boolean;
  message: string;
  data?: {
    exerciseId: string;
    done: boolean;
  };
}
export interface UserExercise {
  _id: string;
  type:
    | "meditation"
    | "text-activity"
    | "breathing"
    | "chatbot"
    | "step-activity";
  exerciseId: string; // اگر meditation، ObjectId رشته‌ای مدیتیشن
  title: string;
  description?: string;
  duration?: number;
  done: boolean;
  url?: string; // برای مدیتیشن
  imageUrl?: string; // برای مدیتیشن
  isPro?: boolean;
}
const exerciseAdapter = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getExercise: builder.query<{ success: boolean; data: UserExercise[] }, any>(
      {
        query: () => ({
          url: `exercise`,
          method: "GET",
        }),
        providesTags: ["Exercises"],
      }
    ),
    completeExercise: builder.mutation<
      CompleteExerciseResponse,
      { exerciseId: string }
    >({
      query: ({ exerciseId }) => ({
        url: `exercise/complete`,
        method: "POST",
        body: { exerciseId },
      }),
      invalidatesTags: ["Exercises", "Mood"],
    }),
  }),
});

// Export hooks
export const { useGetExerciseQuery, useCompleteExerciseMutation } =
  exerciseAdapter;
