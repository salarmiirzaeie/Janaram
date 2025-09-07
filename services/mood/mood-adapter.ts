import { apiSlice } from "@/redux/api-slice";
import { IMood } from "@/redux/mood/mood-slice";

// Define the response type for the GET endpoint
interface DailyStatusResponse {
  success: boolean;
  data: {
    date: string;
    moodRegistered: boolean;
    exercisesRegistered: boolean;
    totalExercises?: number;
    completedExercises?: number;
    progressPercent?: number; // 0-100
    status: "no-mood" | "not-started" | "in-progress" | "completed";
    totalMoodDays?: number;
  };
}
// types/mood.ts

export interface ExerciseBase {
  type: "task" | "meditation";
  id: string;
  title: string;
  duration: number; // دقیقه
  description: string;
}

export interface ExerciseMeditation extends ExerciseBase {
  type: "meditation";
  typeMeditation: string; // مثل "calm", "love", "sleep" و ...
}

export interface ExerciseTask extends ExerciseBase {
  type: "task";
}

export type Exercise = ExerciseTask | ExerciseMeditation;

export interface MoodTrainsResponse {
  success: boolean;
  message: string;
  data: {
    mood: string;
    exercises: Exercise[];
  };
}

const moodAdapter = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    setMood: builder.mutation<
      { success: boolean; message: string; data: IMood & { isTodayFirstMood: boolean } },
      { mood: number | null; note?: string }
    >({
      query: (data) => ({
        url: "mood/set",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Mood"],
    }),
    getMood: builder.query<DailyStatusResponse, any>({
      query: () => ({
        url: `mood/set`,
        method: "GET",
      }),
      providesTags: ["Mood"],
    }),
    getActivity: builder.query<any, any>({
      query: () => ({
        url: `mood/activity`,
        method: "GET",
      }),
    }),
    getMoodTrains: builder.query<MoodTrainsResponse, number>({
      query: (moodValue) => `/mood/trains?mood=${moodValue}`,
    }),
    sendPrevMoods: builder.mutation<any, IMood[]>({
      query: (data) => ({
        url: "mood/prev-moods",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

// Export hooks
export const {
  useSetMoodMutation,
  useGetMoodQuery,
  useGetActivityQuery,
  useGetMoodTrainsQuery,
  useSendPrevMoodsMutation,
} = moodAdapter;
