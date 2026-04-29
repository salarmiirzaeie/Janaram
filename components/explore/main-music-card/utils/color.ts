const BASE_COLORS = [
  {
    gradient: ["#79AED6", "#5E95BD"],
    gradientStart: "#79AED6",
    accent: "#A5C9E1",
  },
  {
    gradient: ["#9966CC", "#804DB3"],
    gradientStart: "#9966CC",
    accent: "#C2A3E1",
  },
  {
    gradient: ["#FF9966", "#E6804D"],
    gradientStart: "#FF9966",
    accent: "#FFC2A3",
  },
  {
    gradient: ["#91A5BE", "#7A8BA8"],
    gradientStart: "#91A5BE",
    accent: "#BDC9D8",
  },
  {
    gradient: ["#79AED6", "#9966CC"],
    gradientStart: "#79AED6",
    accent: "#D6C2EB",
  },
  {
    gradient: ["#FF9966", "#9966CC"],
    gradientStart: "#FF9966",
    accent: "#FFD6C2",
  },
];

const CATEGORY_ORDER: Record<string, readonly number[]> = {
  calm: [0, 1, 2, 3, 4, 5],
  self: [5, 4, 0, 1, 2, 3],
  instrumental: [1, 2, 0, 4, 5, 3],
  sleep: [0, 2, 1, 3, 5, 4],
  love: [3, 1, 0, 5, 4, 2],
  nature: [2, 1, 4, 5, 0, 3],
};

const colorCache = new Map<string, (typeof BASE_COLORS)[0]>();

export const getColorSet = (type: string, index: number) => {
  const key = `${type}:${index % 10}`;
  if (colorCache.has(key)) return colorCache.get(key)!;
  const order = CATEGORY_ORDER[type];
  const colorIndex = order
    ? order[index % order.length]
    : index % BASE_COLORS.length;
  const result = BASE_COLORS[colorIndex];
  if (colorCache.size > 100) colorCache.clear();
  colorCache.set(key, result);
  return result;
};
