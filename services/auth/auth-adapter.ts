import { apiSlice } from "@/redux/api-slice";
import { IGLoginResponse, IVerifyOtpRes } from "@/types";

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
        url: "auth/otp/request2",
        method: "POST",
        body: data,
      }),
    }),
    verifyOTP: builder.mutation<IVerifyOtpRes, { phoneNumber: string }>({
      query: (data) => ({
        url: "auth/otp/verify2",
        method: "POST",
        body: data,
      }),
    }),
    personalize: builder.mutation<
      IVerifyOtpRes,
      { goals: string[]; meditationTime: number }
    >({
      query: (data) => ({
        url: "auth/personalize",
        method: "PUT",
        body: data,
      }),
    }),
    editProfile: builder.mutation<any, { name: string; phoneNumber: string }>({
      query: (data) => ({
        url: "auth/edit-profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),
    profile: builder.query<
      { data: { name: string; phoneNumber: string; profilePhoto?: string } },
      any
    >({
      query: () => ({
        url: "auth/profile",
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),
  }),
});

// Export hooks
export const {
  useGoogleLoginMutation,
  useSendOTPMutation,
  useVerifyOTPMutation,
  useEditProfileMutation,
  useProfileQuery,
  usePersonalizeMutation,
} = authAdapter;
