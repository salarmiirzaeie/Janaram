import { apiSlice } from "@/redux/api-slice";

const versionAdapter = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    checkVersion: builder.query<
      { success: boolean; message: string; isNewVersionAvailable: boolean; currentVersion: string },
      { version: string }
    >({
      query: ({ version }) => `version/check/${version}`, // Dynamic version in the URL
    }),
  }),
});

// Export hooks
export const { useCheckVersionQuery } = versionAdapter;
