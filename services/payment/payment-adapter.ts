import { apiSlice } from "@/redux/api-slice";

/** @deprecated Pro-plan Zarinpal — backend uses appointment-only payment/request */
export interface LegacyPlanPaymentRequest {
  planId: string;
  amount: number;
  description?: string;
  appointmentId?: string;
  mobile?: string;
  email?: string;
}

export interface AppointmentPaymentRequest {
  appointmentId: string;
  description?: string;
  mobile?: string;
  email?: string;
}

export interface AppointmentPaymentResponse {
  success: boolean;
  authority: string;
  paymentUrl: string;
  paymentId: string;
  amountToman: number;
  amountInRial: number;
  message?: string;
}

const paymentAdapter = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    requestAppointmentPayment: builder.mutation<
      AppointmentPaymentResponse,
      AppointmentPaymentRequest
    >({
      query: (body) => ({
        url: "payment/request",
        method: "POST",
        body,
      }),
    }),

    /** Legacy pro-plan body — only if backend restores plan payments */
    requestLegacyPlanPayment: builder.mutation<
      AppointmentPaymentResponse,
      LegacyPlanPaymentRequest
    >({
      query: (body) => ({
        url: "payment/request",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useRequestAppointmentPaymentMutation,
  useRequestLegacyPlanPaymentMutation,
} = paymentAdapter;
