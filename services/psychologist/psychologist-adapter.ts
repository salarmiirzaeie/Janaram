// services/psychologist/psychologist-adapter.ts
import { apiSlice } from "@/redux/api-slice";

export interface Psychologist {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  sessionPrice: number;
  avatar: string | null;
  categoryId: string;
  bio?: string;
  availableToday: boolean;
  education?: string[];
  successfulConsultations: number;
  specialties: any[];
  medicalLicenseNumber: string;
}

export interface AvailableSlotsResponse {
  date: string;
  slots: string[];
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: "confirmed" | "cancelled" | "completed";
  createdAt?: string;
}

export interface SessionInfo {
  plan: string;
  limit: number;
  used: number;
  remaining: number;
  remainingSessions: number;
  hasProAccess: boolean;
}

export interface CreateAppointmentRequest {
  doctorId: string;
  date: string;
  time: string;
}

export interface AppointmentsResponse {
  data: Appointment[];
  sessionInfo?: SessionInfo;
}

const psychologistAdapter = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/psychologists?category=&search=
    getPsychologists: builder.query<
      Psychologist[],
      { category?: string; search?: string }
    >({
      query: (params) => ({
        url: "v2/psychologists",
        method: "GET",
        params,
      }),
      transformResponse: (response: {
        success: boolean;
        data: Psychologist[];
      }) => response.data,
    }),

    // GET /api/psychologists/:id
    getPsychologistById: builder.query<Psychologist, string>({
      query: (id) => `v2/psychologists/${id}`,
      transformResponse: (response: { success: boolean; data: Psychologist }) =>
        response.data,
    }),

    // GET /api/psychologists/:id/available-slots?date=YYYY-MM-DD
    getAvailableSlots: builder.query<
      AvailableSlotsResponse,
      { id: string; date: string }
    >({
      query: ({ id, date }) =>
        `v2/psychologists/${id}/available-slots?date=${date}`,
      transformResponse: (response: {
        success: boolean;
        data: AvailableSlotsResponse;
      }) => response.data,
    }),

    // POST /api/appointments (create booking)
    createAppointment: builder.mutation<
      {
        appointmentId: string;
        doctorName: string;
        date: string;
        time: string;
        status: string;
      },
      CreateAppointmentRequest
    >({
      query: (body) => ({
        url: "v2/appointments",
        method: "POST",
        body,
      }),
      transformResponse: (response: { success: boolean; data: any }) =>
        response.data,
      invalidatesTags: ["UserAppointments"],
    }),

    // GET /api/appointments/my (user's appointments with session info)
    getUserAppointments: builder.query<AppointmentsResponse, void>({
      query: () => "v2/appointments/my",
      transformResponse: (response: {
        success: boolean;
        data: Appointment[];
        sessionInfo?: SessionInfo;
      }) => ({
        data: response.data,
        sessionInfo: response.sessionInfo,
      }),
      providesTags: ["UserAppointments"],
    }),

    // Optional: Cancel appointment
    cancelAppointment: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (appointmentId) => ({
        url: `v2/appointments/${appointmentId}`,
        method: "DELETE",
      }),
      transformResponse: (response: { success: boolean; message: string }) =>
        response,
      invalidatesTags: ["UserAppointments"],
    }),
  }),
});

// Export hooks
export const {
  useGetPsychologistsQuery,
  useLazyGetPsychologistsQuery,
  useGetPsychologistByIdQuery,
  useGetAvailableSlotsQuery,
  useLazyGetAvailableSlotsQuery,
  useCreateAppointmentMutation,
  useGetUserAppointmentsQuery,
  useCancelAppointmentMutation,
} = psychologistAdapter;
