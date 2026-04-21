export const toPersianDigits = (num: number | string): string => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num
    .toString()
    .replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
};
export const typeTopPersian = (type: string) => {
  switch (type) {
    case "instrumental":
      return "بی کلام";

    case "self":
      return "خودسازی";

    case "calm":
      return "آرامش";

    case "sleep":
      return "خواب";

    case "love":
      return "عشق";

    case "nature":
      return "طبیعت";

    default:
      break;
  }
};
