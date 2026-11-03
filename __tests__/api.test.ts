import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "@/redux/api-slice";
import { rootReducer } from "@/redux/root-reducer";
import { setTokens } from "@/redux/auth/auth-slice";

const pingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    ping: builder.query<any, void>({ query: () => "ping" }),
  }),
});

function makeStore() {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefault) => getDefault().concat(apiSlice.middleware),
  });
}

const jsonResponse = (status: number, body: object) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

describe("API client", () => {
  afterEach(() => jest.restoreAllMocks());

  it("sends the access token as a Bearer header", async () => {
    const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue(jsonResponse(200, { ok: true }));
    const store = makeStore();
    store.dispatch(setTokens({ accessToken: "tok-123" }));

    await store.dispatch(pingApi.endpoints.ping.initiate());

    const request = fetchMock.mock.calls[0][0] as Request;
    expect(request.headers.get("authorization")).toBe("Bearer tok-123");
  });

  it("logs the user out when the server answers 401", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue(jsonResponse(401, { message: "expired" }));
    const store = makeStore();
    store.dispatch(setTokens({ accessToken: "tok-123" }));
    expect(store.getState().auth.authorized).toBe(true);

    await store.dispatch(pingApi.endpoints.ping.initiate());

    expect(store.getState().auth).toEqual({ accessToken: null, authorized: false });
  });

  it("keeps the session on other errors such as 500", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue(jsonResponse(500, { message: "boom" }));
    const store = makeStore();
    store.dispatch(setTokens({ accessToken: "tok-123" }));

    await store.dispatch(pingApi.endpoints.ping.initiate());

    expect(store.getState().auth.authorized).toBe(true);
  });
});
