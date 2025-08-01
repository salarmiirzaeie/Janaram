import { apiSlice } from "@/redux/api-slice";
import { IGLoginResponse } from "@/types";

const authAdapter = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    googleLogin: builder.mutation<IGLoginResponse, IGLoginResponse>({
      query: (data) => ({
        url: "auth/google",
        method: "POST",
        body: data,
      }),
    }),
    sendOTP: builder.mutation<any, { phoneNumber: string }>({
      query: (data) => ({
        url: "auth/otp/request",
        method: "POST",
        body: data,
      }),
    }),
    verifyOTP: builder.mutation<any, { code: string; phoneNumber: string }>({
      query: (data) => ({
        url: "auth/otp/verify",
        method: "POST",
        body: data,
      }),
    }),
    editProfile: builder.mutation<any, { name: string; phoneNumber: string; email: string }>({
      query: (data) => ({
        url: "auth/otp/verify",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

// Export hooks
export const { useGoogleLoginMutation, useSendOTPMutation, useVerifyOTPMutation } = authAdapter;
