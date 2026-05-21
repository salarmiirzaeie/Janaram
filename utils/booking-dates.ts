import moment from "moment-jalaali";

moment.loadPersian({ dialect: "persian-modern", usePersianDigits: false });

/** Gregorian YYYY-MM-DD in Asia/Tehran (matches doctor dashboard / API). */
export function formatGregorianDateInTehran(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tehran",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function getTodayGregorianTehran(): string {
  return formatGregorianDateInTehran(new Date());
}

export function addDaysGregorianTehran(baseDateStr: string, days: number): string {
  const [y, m, d] = baseDateStr.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + days, 12, 0, 0));
  return formatGregorianDateInTehran(date);
}

const PERSIAN_WEEKDAY_NAMES = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
];

const PERSIAN_MONTH_NAMES = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

/** Persian weekday label for a Gregorian API date string. */
export function getPersianWeekdayNameForGregorianDate(
  gregorianDateStr: string
): string {
  const [y, m, d] = gregorianDateStr.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const formatter = new Intl.DateTimeFormat("fa-IR", {
    timeZone: "Asia/Tehran",
    weekday: "long",
  });
  const dayName = formatter.format(date);
  const weekdayMap: Record<string, number> = {
    شنبه: 0,
    یکشنبه: 1,
    دوشنبه: 2,
    "سه‌شنبه": 3,
    چهارشنبه: 4,
    پنجشنبه: 5,
    جمعه: 6,
  };
  const idx = weekdayMap[dayName] ?? 0;
  return PERSIAN_WEEKDAY_NAMES[idx];
}

export interface BookingCalendarDay {
  date: string;
  dayOfWeek: string;
  dayNumber: string;
  monthName: string;
}

/** Next N calendar days as API-ready Gregorian strings with Persian labels. */
export function getNextBookingDays(count: number): BookingCalendarDay[] {
  const today = getTodayGregorianTehran();
  const days: BookingCalendarDay[] = [];

  for (let i = 0; i < count; i++) {
    const date = i === 0 ? today : addDaysGregorianTehran(today, i);
    const j = moment(date, "YYYY-MM-DD");
    const jMonth = parseInt(j.format("jM"), 10);

    days.push({
      date,
      dayOfWeek: getPersianWeekdayNameForGregorianDate(date),
      dayNumber: j.format("jD"),
      monthName: PERSIAN_MONTH_NAMES[jMonth - 1] ?? "",
    });
  }

  return days;
}

export function isPaymentExpired(paymentExpiresAt?: string): boolean {
  if (!paymentExpiresAt) return false;
  return new Date(paymentExpiresAt).getTime() <= Date.now();
}

export function formatCountdownMs(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
