import * as SQLite from "expo-sqlite";
const db = await SQLite.openDatabaseAsync("janaram.db");

export type Mood =
  | "happy"
  | "sad"
  | "angry"
  | "neutral"
  | "excited"
  | "tired"
  | string;

export const initMoodTable = async () => {
  await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS moods (
          id INTEGER PRIMARY KEY NOT NULL,
          date TEXT UNIQUE NOT NULL,
          mood TEXT NOT NULL,
          note TEXT
        );
      `);
};

type MoodInput = {
  date: string; // فرمت: YYYY-MM-DD
  mood: string;
  note?: string;
};

export const upsertMood = async ({ date, mood, note }: MoodInput) => {
  await db.runAsync(
    `
      INSERT INTO moods (date, mood, note)
      VALUES (?, ?, ?)
      ON CONFLICT(date) DO UPDATE SET
        mood = excluded.mood,
        note = excluded.note;
      `,
    [date, mood, note ?? null]
  );
};
