export const normalizePhoneNumber = (phoneNumber: string): string => {
  // Removes +98, 98, or 0, keeps last 10 digits
  return phoneNumber.replace(/^(\+98|98|0)/, "").slice(-10);
};

export const unNormalizePhoneNumber = (phoneNumber: string): string => {
  // Assumes input is a normalized 10-digit number and adds "0" at the start
  const clean = phoneNumber.replace(/\D/g, "").slice(-10); // just to be safe
  return `0${clean}`;
};
