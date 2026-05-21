import { formatCountdownMs, isPaymentExpired } from "@/utils/booking-dates";
import { useEffect, useState } from "react";

export function usePaymentCountdown(paymentExpiresAt?: string) {
  const [remainingMs, setRemainingMs] = useState<number | null>(null);

  useEffect(() => {
    if (!paymentExpiresAt) {
      setRemainingMs(null);
      return;
    }

    const tick = () => {
      const ms = new Date(paymentExpiresAt).getTime() - Date.now();
      setRemainingMs(Math.max(0, ms));
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [paymentExpiresAt]);

  const expired =
    !paymentExpiresAt ||
    isPaymentExpired(paymentExpiresAt) ||
    (remainingMs !== null && remainingMs <= 0);

  return {
    expired,
    remainingMs,
    formatted:
      remainingMs !== null ? formatCountdownMs(remainingMs) : null,
  };
}
