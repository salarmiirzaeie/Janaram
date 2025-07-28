import { apiSlice } from "@/redux/api-slice";
import { IPlansResponse } from "@/types";

const upgradeAdapter = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    upgradePlan: builder.mutation<any, void>({
      query: (data) => ({
        url: "upgrade-plan/unlimit",
        method: "POST",
      }),
      invalidatesTags: ["Plans"],
    }),
    plans: builder.query<IPlansResponse, any>({
      query: (data) => ({
        url: "upgrade-plan/plans",
        method: "GET",
      }),
      providesTags: ["Plans"],
    }),
  }),
});

// Export hooks
export const { useUpgradePlanMutation, usePlansQuery } = upgradeAdapter;
