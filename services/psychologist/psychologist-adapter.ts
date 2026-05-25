// services/psychologist/psychologist-adapter.ts
import { apiSlice } from "@/redux/api-slice";
import { unwrapApiData, unwrapApiSuccess } from "@/utils/api-response";

export type AppointmentStatus =
  | "pending_payment"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no-show";

export type CancelReason =
  | "payment_timeout"
  | "patient_cancelled"
  | "patient_cancelled_refund"
  | "patient_cancelled_late"
  | "patient_cancelled_unpaid"
  | "doctor_cancelled"
  | "patient_no_show";

export type RefundStatus = "none" | "pending" | "processed" | "rejected";
export type PayoutStatus = "none" | "held" | "released" | "forfeited";

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
  specialties: string[];
  medicalLicenseNumber: string;
  schedule?: Record<string, string[]>;
  offDays?: string[];
}

export interface AvailableSlotsResponse {
  date: string;
  slots: string[];
  reason?: "off_day";
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  sessionPrice: number;
  date: string;
  time: string;
  status: AppointmentStatus;
  createdAt?: string;
  paymentExpiresAt?: string;
  paidAt?: string;
  cancelReason?: CancelReason;
  refundStatus?: RefundStatus;
  /** When admin marked refund processed/rejected */
  refundResolvedAt?: string;
  payoutStatus?: PayoutStatus;
  completedAt?: string;
  reviewEligibleUntil?: string;
  hasReview?: boolean;
  canReview?: boolean;
  /** true if cancel ≥1h before session → full refund queue */
  canCancelWithRefund?: boolean;
  patientRefundMinHours?: number;
}

export interface CreateAppointmentRequest {
  doctorId: string;
  date: string;
  time: string;
}

export interface CreateAppointmentResponse {
  appointmentId: string;
  doctorName: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  sessionPrice: number;
  paymentExpiresAt: string;
  paymentExpiresInMinutes: number;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string;
    picture: string | null;
  };
}

export interface ReviewsResponse {
  reviews: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateReviewRequest {
  appointmentId: string;
  doctorId: string;
  rating: number;
  comment?: string;
}

const psychologistAdapter = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
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

    getPsychologistById: builder.query<Psychologist, string>({
      query: (id) => `v2/psychologists/${id}`,
      transformResponse: (response: { success: boolean; data: Psychologist }) =>
        response.data,
    }),

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

    createAppointment: builder.mutation<
      CreateAppointmentResponse,
      CreateAppointmentRequest
    >({
      query: (body) => ({
        url: "v2/appointments",
        method: "POST",
        body,
      }),
      transformResponse: (response: {
        success: boolean;
        message?: string;
        data: CreateAppointmentResponse;
      }) => unwrapApiData(response, "خطا در رزرو نوبت"),
      invalidatesTags: ["UserAppointments"],
    }),

    getUserAppointments: builder.query<Appointment[], void>({
      query: () => "v2/appointments/my",
      transformResponse: (response: {
        success: boolean;
        data: Appointment[];
      }) => response.data,
      providesTags: ["UserAppointments"],
    }),

    cancelAppointment: builder.mutation<
      { success: boolean; message: string; refundPending?: boolean },
      string
    >({
      query: (appointmentId) => ({
        url: `v2/appointments/${appointmentId}`,
        method: "DELETE",
      }),
      transformResponse: (response: {
        success: boolean;
        message?: string;
        refundPending?: boolean;
      }) => ({
        ...unwrapApiSuccess(response, "خطا در لغو نوبت"),
        refundPending: response.refundPending,
      }),
      invalidatesTags: ["UserAppointments"],
    }),

    createReview: builder.mutation<
      { success: boolean; message: string },
      CreateReviewRequest
    >({
      query: (body) => ({
        url: "v2/reviews",
        method: "POST",
        body,
      }),
      transformResponse: (response: { success: boolean; message?: string }) =>
        unwrapApiSuccess(response, "خطا در ثبت نظر"),
      invalidatesTags: ["Reviews", "UserAppointments"],
    }),

    getReviewsByDoctorId: builder.query<
      ReviewsResponse,
      { id: string; page?: number; limit?: number }
    >({
      query: ({ id, page = 1, limit = 10 }) => ({
        url: `v2/psychologists/${id}/reviews?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      transformResponse: (response: {
        success: boolean;
        data: ReviewsResponse;
      }) => response.data,
      providesTags: ["Reviews"],
    }),
  }),
});

export const {
  useGetPsychologistsQuery,
  useLazyGetPsychologistsQuery,
  useGetPsychologistByIdQuery,
  useGetAvailableSlotsQuery,
  useLazyGetAvailableSlotsQuery,
  useCreateAppointmentMutation,
  useGetUserAppointmentsQuery,
  useCancelAppointmentMutation,
  useCreateReviewMutation,
  useGetReviewsByDoctorIdQuery,
} = psychologistAdapter;
