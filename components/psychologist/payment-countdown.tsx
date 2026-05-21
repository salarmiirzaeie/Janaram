import { colors } from "@/app/(tabs)/psychologist";
import { usePaymentCountdown } from "@/hooks/usePaymentCountdown";
import React from "react";
import { Text, View } from "react-native";

type Props = {
  paymentExpiresAt?: string;
  compact?: boolean;
};

export default function PaymentCountdown({
  paymentExpiresAt,
  compact,
}: Props) {
  const { expired, formatted } = usePaymentCountdown(paymentExpiresAt);

  if (!paymentExpiresAt) return null;

  if (expired) {
    return (
      <Text
        style={{
          fontSize: compact ? 11 : 12,
          color: colors.accent[600],
          fontFamily: "vazir",
          textAlign: "right",
        }}
      >
        مهلت پرداخت به پایان رسیده است. لطفاً نوبت جدید بگیرید.
      </Text>
    );
  }

  return (
    <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 6 }}>
      <Text
        style={{
          fontSize: compact ? 11 : 12,
          color: "#F59E0B",
          fontFamily: "vazir",
        }}
      >
        مهلت پرداخت:
      </Text>
      <Text
        style={{
          fontSize: compact ? 13 : 14,
          color: "#D97706",
          fontFamily: "vazirBold",
        }}
      >
        {formatted}
      </Text>
    </View>
  );
}
