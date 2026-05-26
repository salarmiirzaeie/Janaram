import { apiSlice } from "@/redux/api-slice";
import {
  AppointmentPaymentRequest,
  useLazyGetPaymentStatusQuery,
  useRequestAppointmentPaymentMutation,
  useRequestLegacyPlanPaymentMutation,
} from "@/services/payment/payment-adapter";
import { store } from "@/redux/store";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { useCustomToast } from "./useToast";

WebBrowser.maybeCompleteAuthSession();

export type AppointmentPaymentParams = Omit<
  AppointmentPaymentRequest,
  "appointmentId"
> & {
  appointmentId: string;
  /** Skip API if URL already returned from booking */
  paymentUrl?: string;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Opens Zarinpal for an appointment (amount is resolved on the server). */
export const useZarinpalPayment = () => {
  const toast = useCustomToast();
  const [loading, setLoading] = useState(false);
  const [requestPayment, { isLoading: isRequesting }] =
    useRequestAppointmentPaymentMutation();
  const [fetchPaymentStatus] = useLazyGetPaymentStatusQuery();
  const [requestLegacyPayment] = useRequestLegacyPlanPaymentMutation();

  const invalidateAppointments = () => {
    store.dispatch(apiSlice.util.invalidateTags(["UserAppointments"]));
  };

  const pollPaymentConfirmed = async (appointmentId: string) => {
    for (let i = 0; i < 5; i++) {
      try {
        const res = await fetchPaymentStatus({ appointmentId }).unwrap();
        if (res.data?.paid) return true;
      } catch {
        /* retry */
      }
      await sleep(800);
    }
    return false;
  };

  const openGateway = async (paymentUrl: string) => {
    const redirectUrl = Linking.createURL("janaram://");
    return WebBrowser.openAuthSessionAsync(paymentUrl, redirectUrl);
  };

  const startAppointmentPayment = async (
    params: AppointmentPaymentParams
  ): Promise<{ success: boolean; paid?: boolean; error?: string }> => {
    const { appointmentId, description, mobile, email, paymentUrl } = params;

    try {
      setLoading(true);

      let url = paymentUrl;

      if (!url) {
        const data = await requestPayment({
          appointmentId,
          description,
          mobile,
          email,
        }).unwrap();

        if (!data.success || !data.paymentUrl) {
          const msg = data.message || "خطا در ایجاد درخواست پرداخت";
          toast.show({ msg, type: "error" });
          return { success: false, error: msg };
        }
        url = data.paymentUrl;
      }

      const result = await openGateway(url);

      if (result.type === "success" || result.type === "dismiss") {
        const paid = await pollPaymentConfirmed(appointmentId);
        invalidateAppointments();
        if (paid) {
          toast.show({ msg: "پرداخت با موفقیت انجام شد", type: "success" });
          return { success: true, paid: true };
        }
        if (result.type === "dismiss") {
          toast.show({
            msg: "اگر پرداخت کردید، چند لحظه بعد وضعیت نوبت به‌روز می‌شود",
            type: "success",
          });
        }
        return { success: true, paid: false };
      }

      return { success: false, error: "پرداخت لغو شد" };
    } catch (error: any) {
      const msg =
        error?.data?.message || "خطا در اتصال به درگاه پرداخت";
      toast.show({ msg, type: "error" });
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  /**
   * @deprecated Pro-plan flow; appointment bookings should use `startAppointmentPayment`.
   */
  const startPayment = async (
    planId: string,
    amount: number,
    description: string
  ) => {
    try {
      setLoading(true);
      const data = await requestLegacyPayment({
        planId,
        amount,
        description,
        appointmentId: planId,
      }).unwrap();

      if (!data.success || !data.paymentUrl) {
        const msg = data.message || "خطا در ایجاد درخواست پرداخت";
        toast.show({ msg, type: "error" });
        return { success: false, error: msg };
      }

      await openGateway(data.paymentUrl);
      return { success: true };
    } catch (error: any) {
      const msg =
        error?.data?.message || error?.message || "خطا در اتصال به درگاه پرداخت";
      toast.show({ msg, type: "error" });
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  return {
    startAppointmentPayment,
    startPayment,
    isLoading: loading || isRequesting,
  };
};
