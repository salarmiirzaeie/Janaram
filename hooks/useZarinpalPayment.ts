// hooks/useZarinpalPayment.ts
import { apiSlice } from "@/redux/api-slice";
import { useRequestPaymentMutation } from "@/services/payment/payment-adapter";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { useDispatch } from "react-redux";
import { useCustomToast } from "./useToast";

WebBrowser.maybeCompleteAuthSession();

export const useZarinpalPayment = () => {
  const toast = useCustomToast();
  const dispatch = useDispatch();
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
      })
        .unwrap()
        .then(async (data) => {
          console.log(data, "ssa");
          if (data.success) {
            // 2. باز کردن درگاه پرداخت زرین‌پال
            const result = await WebBrowser.openAuthSessionAsync(
              data.paymentUrl,
              Linking.createURL("payment-result")
            );
            console.log(result, "res");
            // 3. بررسی نتیجه پرداخت
            if (result.type === "success" && result.url) {
              const urlParams = new URL(result.url);
              const status = urlParams.searchParams.get("status");
              const refId = urlParams.searchParams.get("ref_id");

              if (status === "success") {
                toast.show({
                  msg: `پرداخت با موفقیت انجام شد!\nشماره پیگیری: ${refId}`,
                  type: "success",
                });

                // اینولید کردن کش پلن‌ها برای آپدیت وضعیت کاربر
                dispatch(apiSlice.util.invalidateTags(["Plans"]));

                return { success: true, refId };
              } else {
                const errorMsg =
                  urlParams.searchParams.get("message") || "پرداخت ناموفق بود";
                toast.show({ msg: errorMsg, type: "error" });
                return { success: false, error: errorMsg };
              }
            } else if ((result.type as any) === "canceled") {
              toast.show({ msg: "پرداخت توسط کاربر لغو شد", type: "error" });
              return { success: false, error: "cancelled" };
            }
          } else {
            toast.show({
              msg: data.message || "خطا در ایجاد درخواست پرداخت",
              type: "error",
            });
            return { success: false, error: data.message };
          }
        });
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.show({ msg: "خطا در اتصال به درگاه پرداخت", type: "error" });
      return { success: false, error: error.message };
    }
  };

  return { startPayment, isLoading };
};
