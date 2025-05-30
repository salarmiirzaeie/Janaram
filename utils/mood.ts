import { IMood } from "@/redux/mood/mood-slice";
import { format as formatJalali } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale";

const dayLabels = [
  "شنبه",
  "یک‌شنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنج‌شنبه",
  "جمعه",
];

const getDayIndex = (date: Date): number => {
  const dayName = formatJalali(date, "iiii", { locale: faIR }); // مثلا "شنبه"
  return dayLabels.indexOf(dayName);
};

export const prepareLineData = (moods: IMood[]) => {
  const moodMap: Record<number, number[]> = {};

  moods.forEach((m) => {
    if (m.mood !== null) {
      const fixedDate = new Date(m.date + "T12:00:00+03:30");
      const dayIndex = getDayIndex(fixedDate);
      if (!moodMap[dayIndex]) moodMap[dayIndex] = [];
      moodMap[dayIndex].push(m.mood);
    }
  });

  const lineData = dayLabels.map((label, index) => {
    const moods = moodMap[index];
    const avgMood = moods
      ? moods.reduce((a, b) => a + b, 0) / moods.length
      : null;
    return {
      label,
      value: avgMood ?? null,
    };
  });

  return lineData.filter((d) => d.value !== null);
};

export const moods = [
  { emoji: "😄", label: "خوشحال", value: 1, color: "#A5D6A7" },
  { emoji: "😐", label: "معمولی", value: 2, color: "#FFCC80" },
  { emoji: "😞", label: "ناراحت", value: 3, color: "#14104a" },
  { emoji: "😡", label: "عصبانی", value: 4, color: "#EF9A9A" },
  { emoji: "😴", label: "خسته", value: 5, color: "#90CAF9" },
  { emoji: "😟", label: "مظطرب", value: 6, color: "#b17fc7" },
];
export const getEmojiFromMood = (mood: number) => {
  return moods[mood - 1].emoji;
};
export const getLabelFromMood = (mood: number) => {
  return moods[mood - 1].label;
};
export function preparePieData(moodEntries: IMood[]) {
  // شمارش تعداد هر مود
  const counts: Record<number, number> = {};

  moodEntries.forEach((entry) => {
    if (entry.mood !== null) {
      counts[entry.mood] = (counts[entry.mood] || 0) + 1;
    }
  });

  // ترکیب با اطلاعات لیبل و رنگ
  const pieData = moods
    .map((mood) => {
      const count = counts[mood.value] || 0;
      return {
        value: count,
        color: mood.color,
        text: mood.label,
      };
    })
    .filter((item) => item.value > 0); // فقط مودهایی که استفاده شدن

  return pieData;
}
