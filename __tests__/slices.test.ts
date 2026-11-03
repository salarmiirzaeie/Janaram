import authReducer, { setTokens, logout } from "@/redux/auth/auth-slice";
import moodReducer, { setMood, IMood } from "@/redux/mood/mood-slice";
import settingsReducer, { setMoodNotification, setNewMeditationsNotification } from "@/redux/settings/settings-slice";
import sleepReducer, { setSleepMode } from "@/redux/sleep-mode/sleep-slice";
import initializeReducer, { setIsInitialized } from "@/redux/intialize/initialize-slice";

describe("auth slice", () => {
  it("starts logged out", () => {
    expect(authReducer(undefined, { type: "@@init" })).toEqual({ accessToken: null, authorized: false });
  });

  it("stores the token and marks the user authorized", () => {
    const state = authReducer(undefined, setTokens({ accessToken: "abc" }));
    expect(state).toEqual({ accessToken: "abc", authorized: true });
  });

  it("clears everything on logout", () => {
    const loggedIn = authReducer(undefined, setTokens({ accessToken: "abc" }));
    expect(authReducer(loggedIn, logout())).toEqual({ accessToken: null, authorized: false });
  });
});

describe("mood slice", () => {
  const day = (n: number) => `2025-01-${String(n).padStart(2, "0")}`;

  it("adds an entry", () => {
    const state = moodReducer([], setMood({ date: day(1), mood: 8, note: "good" }));
    expect(state).toEqual([{ date: day(1), mood: 8, note: "good" }]);
  });

  it("replaces the entry for the same date instead of duplicating it", () => {
    let state: IMood[] = moodReducer([], setMood({ date: day(1), mood: 8 }));
    state = moodReducer(state, setMood({ date: day(1), mood: 3, note: "changed" }));
    expect(state).toHaveLength(1);
    expect(state[0]).toMatchObject({ date: day(1), mood: 3, note: "changed" });
  });

  it("keeps entries sorted by date even when added out of order", () => {
    let state: IMood[] = [];
    [day(5), day(2), day(9)].forEach((d) => {
      state = moodReducer(state, setMood({ date: d, mood: 5 }));
    });
    expect(state.map((e) => e.date)).toEqual([day(2), day(5), day(9)]);
  });

  it("keeps only the most recent 30 entries", () => {
    let state: IMood[] = [];
    for (let i = 1; i <= 31; i++) {
      state = moodReducer(state, setMood({ date: day(i), mood: 5 }));
    }
    expect(state).toHaveLength(30);
    expect(state[0].date).toBe(day(2));
    expect(state[29].date).toBe(day(31));
  });
});

describe("settings, sleep-mode and initialize slices", () => {
  it("toggles notification settings independently", () => {
    let state = settingsReducer(undefined, { type: "@@init" });
    expect(state).toEqual({ moodNotification: true, newMeditationsNotification: true });
    state = settingsReducer(state, setMoodNotification(false));
    expect(state).toEqual({ moodNotification: false, newMeditationsNotification: true });
    state = settingsReducer(state, setNewMeditationsNotification(false));
    expect(state).toEqual({ moodNotification: false, newMeditationsNotification: false });
  });

  it("toggles sleep mode", () => {
    expect(sleepReducer(undefined, setSleepMode(true))).toEqual({ isSleepMode: true });
    expect(sleepReducer({ isSleepMode: true }, setSleepMode(false))).toEqual({ isSleepMode: false });
  });

  it("marks the app as initialized", () => {
    expect(initializeReducer(undefined, { type: "@@init" })).toEqual({ isInitialized: false });
    expect(initializeReducer(undefined, setIsInitialized(true))).toEqual({ isInitialized: true });
  });
});
