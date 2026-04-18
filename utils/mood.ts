import { IMood } from "@/redux/mood/mood-slice";
import { format as formatJalali } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale";
import { ImageSourcePropType } from "react-native";

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

export const moods: {
  emoji: ImageSourcePropType;
  label: string;
  value: number;
  color: string;
}[] = [
  {
    emoji: require(`@/assets/emojis/e-9.png`),
    label: "ذوق زده",
    value: 9,
    color: "#F48FB1",
  }, // صورتی ملایم، انرژی عاشقانه و مثبت, label: "ذوق زده", value: 10, color: "#FFD54F" }, // زرد گرم، انرژی مثبت, label: "ذوق زده", value: 9, color: "#F48FB1" }, // صورتی ملایم، انرژی عاشقانه و مثبت
  {
    emoji: require(`@/assets/emojis/e-8.png`),
    label: "خوشحال",
    value: 8,
    color: "#FFD54F",
  },
  {
    emoji: require(`@/assets/emojis/e-7.png`),
    label: "معمولی",
    value: 7,
    color: "#90A4AE",
  },
  {
    emoji: require(`@/assets/emojis/e-6.png`),
    label: "ریلکس",
    value: 6,
    color: "#80CBC4",
  },
  {
    emoji: require(`@/assets/emojis/e-5.png`),
    label: "بی خواب",
    value: 5,
    color: "#B39DDB",
  },
  {
    emoji: require(`@/assets/emojis/e-4.png`),
    label: "ناراحت",
    value: 4,
    color: "#7986CB",
  },
  {
    emoji: require(`@/assets/emojis/e-3.png`),
    label: "عصبانی",
    value: 3,
    color: "#E57373",
  },
  {
    emoji: require(`@/assets/emojis/e-2.png`),
    label: "گریه",
    value: 2,
    color: "#64B5F6",
  },
  {
    emoji: require(`@/assets/emojis/e-1.png`),
    label: "مضطرب",
    value: 1,
    color: "#BA68C8",
  },
];
export const formatValue = (value: number) => {
  return moods.find((mood) => mood.value === value)?.emoji || "";
};
export const getEmojiFromMood = (mood: number) => {
  return moods[9 - mood].emoji;
};
export const getLabelFromMood = (mood: number) => {
  return moods[9 - mood].label;
};
export function preparePieData(moodEntries: IMood[]) {
  const recentEntries = [...moodEntries]
    .filter((entry) => entry.mood !== null)
    .sort((a, b) => a.date.localeCompare(b.date));

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

export const prepareLineDataForLastMonth = (moodEntries: IMood[]) => {
  if (moodEntries.length === 0) {
    return { labels: [], datasets: [] };
  }
  const labels = moodEntries.map((entry) =>
    formatJalali(entry.date, "iiii", { locale: faIR })
  );
  const data = moodEntries.map((entry) => entry.mood!);
  const datasets = [
    {
      data,
    },
  ];

  return { labels, datasets };
};
export const prepareBarData = (moodEntries: IMood[]) => {
  if (moodEntries.length === 0) {
    return { labels: [], datasets: [] };
  }

  // Count occurrences of each mood value
  const counts: Record<number, number> = {};
  moodEntries.forEach((entry) => {
    if (entry.mood !== null) {
      counts[entry.mood] = (counts[entry.mood] || 0) + 1;
    }
  });

  const labels = moods.map((mood) => "");
  const data = moods.map((mood) => counts[mood.value] || 0);
  return {
    labels,
    datasets: [
      {
        data,
      },
    ],
  };
};
