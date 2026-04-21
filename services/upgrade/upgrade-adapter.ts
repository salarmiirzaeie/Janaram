import { apiSlice } from "@/redux/api-slice";
import { IPlansResponse } from "@/types";

const upgradeAdapter = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    upgradePlan: builder.mutation<any, { id: string; platform?: string }>({
      query: (data) => ({
        url: "upgrade-plan/unlimit",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Plans"],
    }),
    plans: builder.query<IPlansResponse, any>({
      query: (data) => {
        return {
          url: "upgrade-plan/plans",
          method: "GET",
        };
      },
      providesTags: ["Plans"],
    }),
  }),
});

// Export hooks
export const { useUpgradePlanMutation, usePlansQuery } = upgradeAdapter;
