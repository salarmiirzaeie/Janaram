// hooks/useZarinpalPayment.ts
import { useRequestPaymentMutation } from "@/services/payment/payment-adapter";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { useCustomToast } from "./useToast";

WebBrowser.maybeCompleteAuthSession();

export const useZarinpalPayment = () => {
  const toast = useCustomToast();
  const [loading, setLoading] = useState(false);
  const [requestPayment, { isLoading }] = useRequestPaymentMutation();
  const startPayment = async (
    planId: string,
    amount: number,
    description: string
  ) => {
    try {
      requestPayment({
        planId: planId,
        amount: amount,
        description: description,
        appointmentId: planId,
      })
        .unwrap()
        .then(async (data) => {
          if (data.success) {
            setLoading(true);
            // 2. باز کردن درگاه پرداخت زرین‌پال
            const redirectUrl = Linking.createURL("janaram://"); // همان اسمی که قبلاً داشتی

            await WebBrowser.openAuthSessionAsync(
              data.paymentUrl,
              redirectUrl // ⬅️ این را اضافه کن
            );
            setLoading(false);
          } else {
            toast.show({
              msg: data.message || "خطا در ایجاد درخواست پرداخت",
              type: "error",
            });
            setLoading(false);
            return { success: false, error: data.message };
          }
        });
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.show({ msg: "خطا در اتصال به درگاه پرداخت", type: "error" });
      return { success: false, error: error.message };
    }
  };

  return { startPayment, isLoading: loading || isLoading };
};
