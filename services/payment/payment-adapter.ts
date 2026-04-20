import { apiSlice } from "@/redux/api-slice";

const paymentAdapter = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    requestPayment: builder.mutation({
      query: (data) => ({
        url: "payment/request",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

// Export hooks
export const { useRequestPaymentMutation } = paymentAdapter;
