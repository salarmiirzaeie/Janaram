import { IMood } from "@/redux/mood/mood-slice";
import { format as formatJalali } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale";

const dayLabels = ["شنبه", "یک‌شنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"];

const getDayIndex = (date: Date): number => {
  const dayName = formatJalali(date, "iiii", { locale: faIR }); // مثلا "شنبه"
  return dayLabels.indexOf(dayName);
};

export const prepareBarData = (moodEntries: IMood[]) => {
  const recentEntries = [...moodEntries]
    .filter((entry) => entry.mood !== null)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-7);

  const moodMap: Record<number, number[]> = {};

  recentEntries.forEach((entry) => {
    const fixedDate = new Date(entry.date + "T12:00:00+03:30");
    const dayIndex = getDayIndex(fixedDate); // مثلاً شنبه = 0
    if (!moodMap[dayIndex]) moodMap[dayIndex] = [];
    moodMap[dayIndex].push(entry.mood!);
  });

  const barData = dayLabels.map((label, index) => {
    const dailyMoods = moodMap[index];
    if (!dailyMoods || dailyMoods.length === 0) return null;

    const avgMood = dailyMoods.reduce((a, b) => a + b, 0) / dailyMoods.length;

    const closestMood = moods.reduce((prev, curr) =>
      Math.abs(curr.value - avgMood) < Math.abs(prev.value - avgMood) ? curr : prev
    );

    return {
      label,
      value: avgMood,
      frontColor: closestMood.color,
      emoji: closestMood.emoji,
    };
  });

  return barData.filter(Boolean);
};

export const moods = [
  { emoji: "🥰", label: "ذوق زده", value: 9, color: "#F48FB1" }, // صورتی ملایم، انرژی عاشقانه و مثبت
  { emoji: "😊", label: "خوشحال", value: 8, color: "#FFD54F" }, // زرد گرم، انرژی مثبت
  { emoji: "🙂", label: "معمولی", value: 7, color: "#90A4AE" }, // خاکستری آبی، حالت خنثی
  { emoji: "😌", label: "ریلکس", value: 6, color: "#80CBC4" }, // فیروزه‌ای ملایم، حس آرامش
  { emoji: "😴", label: "خسته", value: 5, color: "#B39DDB" }, // یاسی، مرتبط با خستگی و سکون
  { emoji: "😞", label: "ناراحت", value: 4, color: "#7986CB" }, // آبی ملایم مایل به بنفش، غمگین اما نه شدید
  { emoji: "😡", label: "عصبانی", value: 3, color: "#E57373" }, // قرمز روشن، حس خشم بدون خشونت شدید
  { emoji: "😭", label: "گریه", value: 2, color: "#64B5F6" }, // آبی روشن، حالت گریه و غم
  { emoji: "😰", label: "مضطرب", value: 1, color: "#BA68C8" }, // بنفش روشن، استرس و فشار روحی
];

export const getEmojiFromMood = (mood: number) => {
  return moods[9 - mood].emoji;
};
export const getLabelFromMood = (mood: number) => {
  return moods[9 - mood].label;
};
export function preparePieData(moodEntries: IMood[]) {
  const recentEntries = [...moodEntries]
    .filter((entry) => entry.mood !== null)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-7);

  const counts: Record<number, number> = {};

  recentEntries.forEach((entry) => {
    counts[entry.mood!] = (counts[entry.mood!] || 0) + 1;
  });

  const pieData = moods
    .map((mood) => {
      const count = counts[mood.value] || 0;
      return {
        value: count,
        color: mood.color,
        text: mood.label,
      };
    })
    .filter((item) => item.value > 0);

  return pieData;
}
