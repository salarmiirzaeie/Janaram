import { toPersianDigits } from "@/utils/persian";
import {
  moods,
  formatValue,
  getEmojiFromMood,
  getLabelFromMood,
  preparePieData,
  prepareBarData,
  prepareLineDataForLastMonth,
} from "@/utils/mood";
import type { IMood } from "@/redux/mood/mood-slice";

describe("toPersianDigits", () => {
  it("converts western digits and keeps other characters", () => {
    expect(toPersianDigits(1404)).toBe("۱۴۰۴");
    expect(toPersianDigits("09:30 - 120")).toBe("۰۹:۳۰ - ۱۲۰");
    expect(toPersianDigits("abc")).toBe("abc");
  });
});

describe("mood helpers", () => {
  it("has nine moods whose values run from 9 down to 1", () => {
    expect(moods.map((m) => m.value)).toEqual([9, 8, 7, 6, 5, 4, 3, 2, 1]);
  });

  it("maps a mood value to its emoji and label", () => {
    expect(getEmojiFromMood(9)).toBe(moods[0].emoji);
    expect(getEmojiFromMood(1)).toBe(moods[8].emoji);
    expect(getLabelFromMood(8)).toBe("خوشحال");
    expect(formatValue(7)).toBe("🙂");
    expect(formatValue(99)).toBe("");
  });
});

describe("chart data builders", () => {
  const entries: IMood[] = [
    { date: "2025-08-04", mood: 8 },
    { date: "2025-08-05", mood: 8 },
    { date: "2025-08-06", mood: 3 },
    { date: "2025-08-07", mood: null },
  ];

  it("preparePieData counts moods, skips empty days and keeps mood order", () => {
    expect(preparePieData(entries)).toEqual([
      { value: 2, color: "#FFD54F", text: "خوشحال" },
      { value: 1, color: "#E57373", text: "عصبانی" },
    ]);
  });

  it("prepareBarData returns one count per mood in mood order", () => {
    const result = prepareBarData(entries);
    expect(result.labels).toHaveLength(9);
    expect(result.datasets[0].data).toEqual([0, 2, 0, 0, 0, 0, 1, 0, 0]);
  });

  it("returns empty datasets when there are no entries", () => {
    expect(prepareBarData([])).toEqual({ labels: [], datasets: [] });
    expect(prepareLineDataForLastMonth([])).toEqual({ labels: [], datasets: [] });
  });

  it("prepareLineDataForLastMonth labels days with Persian weekday names", () => {
    const result = prepareLineDataForLastMonth([
      { date: "2025-08-09T12:00:00", mood: 6 }, // Saturday
      { date: "2025-08-11T12:00:00", mood: 4 }, // Monday
    ]);
    expect(result.labels).toEqual(["شنبه", "دوشنبه"]);
    expect(result.datasets[0].data).toEqual([6, 4]);
  });
});
