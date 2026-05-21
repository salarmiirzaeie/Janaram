import { apiSlice } from "@/redux/api-slice";
import {
  AppointmentPaymentRequest,
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
};

/** Opens Zarinpal for an appointment (amount is resolved on the server). */
export const useZarinpalPayment = () => {
  const toast = useCustomToast();
  const [loading, setLoading] = useState(false);
  const [requestPayment, { isLoading: isRequesting }] =
    useRequestAppointmentPaymentMutation();
  const [requestLegacyPayment] = useRequestLegacyPlanPaymentMutation();

  const invalidateAppointments = () => {
    store.dispatch(apiSlice.util.invalidateTags(["UserAppointments"]));
  };

  const startAppointmentPayment = async (
    params: AppointmentPaymentParams
  ): Promise<{ success: boolean; error?: string }> => {
    const { appointmentId, description, mobile, email } = params;

    try {
      setLoading(true);
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

      const redirectUrl = Linking.createURL("janaram://");
      const result = await WebBrowser.openAuthSessionAsync(
        data.paymentUrl,
        redirectUrl
      );
      if (result.type === "success" || result.type === "dismiss") {
        invalidateAppointments();
      }
      return { success: true };
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
  /** Pro subscription via Zarinpal (legacy API shape) */
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

      const redirectUrl = Linking.createURL("janaram://");
      await WebBrowser.openAuthSessionAsync(data.paymentUrl, redirectUrl);
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
