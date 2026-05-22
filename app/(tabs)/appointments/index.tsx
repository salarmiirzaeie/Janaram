import { colors } from "@/app/(tabs)/psychologist";
import MoodProgressCard from "@/components/appointments/mood-progress-card";
import PaymentCountdown from "@/components/psychologist/payment-countdown";
import RatingModal from "@/components/reports/rating-modal";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { usePaymentCountdown } from "@/hooks/usePaymentCountdown";
import { useCustomToast } from "@/hooks/useToast";
import { useZarinpalPayment } from "@/hooks/useZarinpalPayment";
import {
  Appointment,
  AppointmentStatus,
  useCancelAppointmentMutation,
  useGetUserAppointmentsQuery,
} from "@/services/psychologist/psychologist-adapter";
import { isPaymentExpired } from "@/utils/booking-dates";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import moment from "moment-jalaali";
import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Modal, RefreshControl, ScrollView, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";

type TabType = "upcoming" | "past";

moment.loadPersian({ dialect: "persian-modern", usePersianDigits: false });

const formatDatePersian = (gregorianDateStr: string) => {
  const m = moment(gregorianDateStr, "YYYY-MM-DD");
  return m.format("jD jMMMM jYYYY");
};

const toJalaaliDateStr = (gregorianDateStr: string) => {
  const m = moment(gregorianDateStr, "YYYY-MM-DD");
  return m.format("jYYYY-jMM-jDD");
};

const getTodayJalaali = () => moment().format("jYYYY-jMM-jDD");

const getCurrentTimeNumber = () => {
  const now = new Date();
  return now.getHours() * 100 + now.getMinutes();
};

const timeToNumber = (timeStr: string) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 100 + minutes;
};

const getStatusBadge = (status: AppointmentStatus) => {
  switch (status) {
    case "confirmed":
      return {
        text: "تأیید شده",
        color: colors.primary[500],
        bg: colors.primary[50],
      };
    case "cancelled":
      return {
        text: "لغو شده",
        color: colors.gray[500],
        bg: colors.gray[100],
      };
    case "completed":
      return {
        text: "انجام شده",
        color: "#10B981",
        bg: "#D1FAE5",
      };
    case "pending_payment":
      return {
        text: "در انتظار پرداخت",
        color: "#F59E0B",
        bg: "#FEF3C7",
      };
    case "no-show":
      return {
        text: "حضور نیافته",
        color: "#92400E",
        bg: "#FEF3C7",
      };
    default:
      return {
        text: "در انتظار",
        color: colors.gray[500],
        bg: colors.gray[100],
      };
  }
};

function PendingPaymentActions({
  app,
  onPay,
  isPayLoading,
}: {
  app: Appointment;
  onPay: () => void;
  isPayLoading: boolean;
}) {
  const { expired } = usePaymentCountdown(app.paymentExpiresAt);
  const isTimeout = app.cancelReason === "payment_timeout";

  if (isTimeout || (app.status === "cancelled" && isTimeout)) {
    return (
      <View className="mt-3">
        <Text className="text-gray-500 text-xs text-right font-vazir leading-5">
          مهلت پرداخت این نوبت به پایان رسید. می‌توانید نوبت جدید بگیرید.
        </Text>
        <Button
          onPress={() => router.push({ pathname: "/doctor-det", params: { id: app.doctorId } })}
          className="mt-2 rounded-full h-9"
          style={{ backgroundColor: colors.primary[500] }}
        >
          <ButtonText className="text-xs text-white">رزرو مجدد</ButtonText>
        </Button>
      </View>
    );
  }

  return (
    <View className="mt-3">
      <PaymentCountdown paymentExpiresAt={app.paymentExpiresAt} compact />
      <Button
        onPress={onPay}
        disabled={isPayLoading || expired}
        className="mt-2 rounded-full h-9"
        style={{
          backgroundColor: expired ? colors.gray[300] : colors.primary[500],
        }}
      >
        <ButtonText className="text-xs text-white">
          {isPayLoading ? "در حال اتصال به درگاه..." : `پرداخت ${app.sessionPrice?.toLocaleString("fa-IR")} تومان`}
        </ButtonText>
      </Button>
      {expired && (
        <Button
          onPress={() => router.push({ pathname: "/doctor-det", params: { id: app.doctorId } })}
          variant="outline"
          className="mt-2 rounded-full h-9 border-primary-300"
        >
          <ButtonText className="text-xs text-primary-500">رزرو مجدد</ButtonText>
        </Button>
      )}
    </View>
  );
}

export default function AppointmentsScreen() {
  const toast = useCustomToast();
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");
  const [loadingAppointmentId, setLoadingAppointmentId] = useState<string | null>(null);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const { data: appointments = [], isLoading, refetch, isFetching } = useGetUserAppointmentsQuery();

  const [cancelAppointment, { isLoading: isCancelling }] = useCancelAppointmentMutation();
  const { startAppointmentPayment } = useZarinpalPayment();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const todayJalaali = getTodayJalaali();
  const currentTimeNumber = getCurrentTimeNumber();

  const isFutureSlot = (app: Appointment) => {
    const appJalaaliDate = toJalaaliDateStr(app.date);
    const appTimeNumber = timeToNumber(app.time);
    if (appJalaaliDate > todayJalaali) return true;
    if (appJalaaliDate === todayJalaali && appTimeNumber >= currentTimeNumber) {
      return true;
    }
    return false;
  };

  const upcoming = useMemo(() => {
    return appointments
      .filter((app) => {
        if (app.status === "cancelled") return false;
        if (app.cancelReason === "payment_timeout") return false;

        if (app.status === "pending_payment") {
          return !isPaymentExpired(app.paymentExpiresAt) && isFutureSlot(app);
        }

        if (app.status === "confirmed") {
          return isFutureSlot(app);
        }

        return false;
      })
      .sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.time.localeCompare(b.time);
      });
  }, [appointments, todayJalaali, currentTimeNumber]);

  const past = useMemo(() => {
    return appointments
      .filter((app) => {
        if (app.cancelReason === "payment_timeout") return true;
        if (app.status === "cancelled") return true;
        if (app.status === "completed" || app.status === "no-show") return true;

        if (app.status === "pending_payment") {
          return isPaymentExpired(app.paymentExpiresAt) || !isFutureSlot(app);
        }

        if (app.status === "confirmed" && !isFutureSlot(app)) return true;

        return false;
      })
      .sort((a, b) => {
        const dateCompare = b.date.localeCompare(a.date);
        if (dateCompare !== 0) return dateCompare;
        return b.time.localeCompare(a.time);
      });
  }, [appointments, todayJalaali, currentTimeNumber]);

  const completedCount = useMemo(() => appointments.filter((app) => app.status === "completed").length, [appointments]);

  const openCancelModal = (app: Appointment) => {
    setCancelTarget(app);
    setCancelModalVisible(true);
  };

  const handleConfirmCancel = async () => {
    if (!cancelTarget) return;
    try {
      const res = await cancelAppointment(cancelTarget.id).unwrap();
      toast.show({
        msg: (res as { message?: string; refundPending?: boolean }).message || "نوبت لغو شد",
        type: "success",
      });
      refetch();
      setCancelModalVisible(false);
      setCancelTarget(null);
    } catch (error: any) {
      toast.show({
        msg: error?.data?.message || "خطا در لغو نوبت",
        type: "error",
      });
    }
  };

  const handlePayment = async (appointment: Appointment) => {
    if (isPaymentExpired(appointment.paymentExpiresAt)) {
      toast.show({
        msg: "مهلت پرداخت به پایان رسیده است. لطفاً نوبت جدید بگیرید.",
        type: "error",
      });
      return;
    }

    setLoadingAppointmentId(appointment.id);
    try {
      await startAppointmentPayment({
        appointmentId: appointment.id,
        description: `پرداخت هزینه جلسه مشاوره با دکتر ${appointment.doctorName}`,
      });
    } finally {
      setLoadingAppointmentId(null);
    }
  };

  const handleComment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setRatingModalVisible(true);
  };

  const renderAppointmentCard = (app: Appointment) => {
    const statusInfo = getStatusBadge(app.status);
    const isThisPaymentLoading = loadingAppointmentId === app.id;
    const showPaymentTimeout =
      app.cancelReason === "payment_timeout" ||
      (app.status === "pending_payment" && activeTab === "past" && isPaymentExpired(app.paymentExpiresAt));

    return (
      <View
        key={app.id}
        style={{
          backgroundColor: "white",
          borderRadius: 20,
          borderWidth: 1,
          borderColor: colors.gray[200],
          padding: 16,
          marginBottom: 12,
        }}
      >
        <HStack className="justify-between items-start">
          <View
            style={{
              backgroundColor: statusInfo.bg,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                color: statusInfo.color,
                fontSize: 11,
                fontFamily: "vazirBold",
              }}
            >
              {statusInfo.text}
            </Text>
          </View>
          <VStack className="flex-1 mr-3">
            <Text className="font-vazirBold text-right text-gray-800">{app.doctorName}</Text>
            <HStack space="sm" className="mt-2 justify-end items-center">
              <Ionicons name="calendar-outline" size={14} color={colors.gray[500]} />
              <Text className="text-xs text-gray-600 font-vazir">{formatDatePersian(app.date)}</Text>
              <Ionicons name="time-outline" size={14} color={colors.gray[500]} />
              <Text className="text-xs text-gray-600 font-vazir">{app.time}</Text>
            </HStack>

            {showPaymentTimeout && (
              <Text className="text-gray-500 text-xs text-right font-vazir mt-2 leading-5">
                مهلت پرداخت این نوبت به پایان رسید. می‌توانید نوبت جدید بگیرید.
              </Text>
            )}
          </VStack>
        </HStack>

        {(app.status === "confirmed" || app.status === "pending_payment") && activeTab === "upcoming" && (
          <Button
            onPress={() => openCancelModal(app)}
            disabled={isCancelling}
            variant="outline"
            className="mt-3 rounded-full h-9 border-red-300"
          >
            <ButtonText className="text-red-500 text-xs">لغو نوبت</ButtonText>
          </Button>
        )}

        {app.status === "pending_payment" && activeTab === "upcoming" && (
          <PendingPaymentActions app={app} onPay={() => handlePayment(app)} isPayLoading={isThisPaymentLoading} />
        )}

        {showPaymentTimeout && activeTab === "past" && (
          <Button
            onPress={() =>
              router.push({
                pathname: "/doctor-det",
                params: { id: app.doctorId },
              })
            }
            className="mt-3 rounded-full h-9"
            style={{ backgroundColor: colors.primary[500] }}
          >
            <ButtonText className="text-xs text-white">رزرو مجدد</ButtonText>
          </Button>
        )}

        {app.status === "confirmed" && activeTab === "upcoming" && (
          <Text className="text-gray-500 text-xs text-right font-vazir mt-2 leading-5">
            پرداخت ثبت شد. روانشناس در زمان نوبت تماس می‌گیرد. لغو تا ۱ ساعت قبل از جلسه: بازپرداخت کامل؛ بعد از آن مبلغ
            به روانشناس می‌رود.
          </Text>
        )}

        {app.status === "no-show" && (
          <View
            className="mt-3 rounded-xl px-3 py-2.5"
            style={{ backgroundColor: "#FEF3C7", borderWidth: 1, borderColor: "#FDE68A" }}
          >
            <Text className="text-amber-900 text-xs text-right font-vazirBold leading-5">حضور نیافته</Text>
            <Text className="text-amber-800 text-xs text-right font-vazir mt-1 leading-5">
              در زمان جلسه پاسخ داده نشد. مبلغ جلسه قابل بازگشت نیست و به روانشناس تعلق گرفته است.
            </Text>
          </View>
        )}

        {app.refundStatus === "pending" && app.status === "cancelled" && (
          <Text className="text-amber-700 text-xs text-right font-vazir mt-2 leading-5">
            بازپرداخت شما در حال بررسی است.
          </Text>
        )}

        {app.refundStatus === "processed" && app.status === "cancelled" && (
          <Text className="text-green-700 text-xs text-right font-vazir mt-2 leading-5">
            بازپرداخت شما ثبت شد. در صورت تأخیر در واریز با پشتیبانی تماس بگیرید.
          </Text>
        )}

        {app.refundStatus === "rejected" && app.status === "cancelled" && (
          <Text className="text-gray-600 text-xs text-right font-vazir mt-2 leading-5">
            درخواست بازپرداخت برای این نوبت تأیید نشد. در صورت نیاز با پشتیبانی تماس بگیرید.
          </Text>
        )}

        {app.canReview && (
          <Button
            onPress={() => handleComment(app)}
            className="mt-3 rounded-full h-9"
            style={{ backgroundColor: colors.secondary[500] }}
          >
            <ButtonText className="text-xs text-white">ثبت نظر و امتیاز</ButtonText>
          </Button>
        )}

        {app.status === "completed" && app.hasReview && (
          <Text className="text-green-700 text-xs text-right font-vazir mt-2">نظر شما ثبت شده است</Text>
        )}
      </View>
    );
  };

  const renderEmptyState = () => (
    <View className="py-20 items-center">
      <Ionicons name="calendar-outline" size={64} color={colors.gray[300]} />
      <Text className="text-gray-500 mt-3 text-center font-vazir">هیچ نوبتی یافت نشد</Text>
      <Text className="text-gray-400 text-xs mt-1 text-center font-vazir">
        نوبت‌های خود را از صفحه روانشناسان رزرو کنید
      </Text>
    </View>
  );

  if (isLoading && !isFetching) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {/* <StatusBar barStyle="dark-content" backgroundColor="white" /> */}
      <LinearGradient
        colors={[colors.primary[50], colors.secondary[50]]}
        style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 }}
      >
        <HStack className="items-center justify-between">
          <View className="flex-1 mr-4">
            <Text className="text-2xl font-vazirBold text-gray-800 text-right">نوبت‌های من</Text>
            <Text className="text-gray-600 text-right text-sm mt-1 font-vazir">لیست نوبت‌های رزرو شده و گذشته</Text>
          </View>
        </HStack>
      </LinearGradient>

      <HStack className="px-5 mt-4 border-b border-gray-200">
        <TouchableOpacity
          onPress={() => setActiveTab("upcoming")}
          style={{
            flex: 1,
            alignItems: "center",
            paddingVertical: 12,
            borderBottomWidth: 2,
            borderBottomColor: activeTab === "upcoming" ? colors.primary[500] : "transparent",
          }}
        >
          <Text
            style={{
              color: activeTab === "upcoming" ? colors.primary[500] : colors.gray[500],
              fontFamily: "vazirBold",
            }}
          >
            نوبت‌های آینده
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("past")}
          style={{
            flex: 1,
            alignItems: "center",
            paddingVertical: 12,
            borderBottomWidth: 2,
            borderBottomColor: activeTab === "past" ? colors.primary[500] : "transparent",
          }}
        >
          <Text
            style={{
              color: activeTab === "past" ? colors.primary[500] : colors.gray[500],
              fontFamily: "vazirBold",
            }}
          >
            تاریخچه نوبت‌ها
          </Text>
        </TouchableOpacity>
      </HStack>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 100,
        }}
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor={colors.primary[500]} />}
      >
        <MoodProgressCard completedSessions={completedCount} upcomingSessions={upcoming.length} />

        {activeTab === "upcoming" && (upcoming.length === 0 ? renderEmptyState() : upcoming.map(renderAppointmentCard))}
        {activeTab === "past" && (past.length === 0 ? renderEmptyState() : past.map(renderAppointmentCard))}
      </ScrollView>

      <Modal
        transparent
        visible={cancelModalVisible}
        animationType="fade"
        onRequestClose={() => setCancelModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 24,
              padding: 24,
              width: "80%",
              maxWidth: 320,
            }}
          >
            <View style={{ alignItems: "center", marginBottom: 16 }}>
              <Ionicons name="alert-circle-outline" size={32} color={colors.accent[500]} />
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "vazirBold",
                  color: colors.gray[800],
                  textAlign: "center",
                  marginTop: 12,
                  marginBottom: 8,
                }}
              >
                لغو نوبت
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.gray[500],
                  textAlign: "center",
                  fontFamily: "vazir",
                  lineHeight: 22,
                }}
              >
                {cancelTarget?.canCancelWithRefund
                  ? `بیش از ${cancelTarget.patientRefundMinHours ?? 1} ساعت تا جلسه مانده: پس از لغو، مبلغ در صف بازپرداخت قرار می‌گیرد.`
                  : `کمتر از ${cancelTarget?.patientRefundMinHours ?? 1} ساعت تا جلسه مانده: مبلغ به روانشناس تعلق می‌گیرد و بازپرداختی انجام نمی‌شود.`}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: colors.gray[600],
                  textAlign: "center",
                  fontFamily: "vazir",
                  marginTop: 10,
                }}
              >
                آیا از لغو این نوبت اطمینان دارید؟
              </Text>
            </View>

            <View style={{ flexDirection: "row", gap: 12 }}>
              <Button
                onPress={() => setCancelModalVisible(false)}
                className="flex-1 rounded-full h-10"
                style={{ backgroundColor: colors.gray[100] }}
              >
                <ButtonText className="text-gray-600 text-sm">انصراف</ButtonText>
              </Button>
              <Button
                onPress={handleConfirmCancel}
                disabled={isCancelling}
                className="flex-1 rounded-full h-10"
                style={{ backgroundColor: colors.accent[500] }}
              >
                <ButtonText className="text-white text-sm">لغو نوبت</ButtonText>
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      <RatingModal
        visible={ratingModalVisible}
        onClose={() => {
          setRatingModalVisible(false);
          setSelectedAppointment(null);
        }}
        onSuccess={() => refetch()}
        appointmentId={selectedAppointment?.id || ""}
        doctorId={selectedAppointment?.doctorId || ""}
        doctorName={selectedAppointment?.doctorName || ""}
      />
    </View>
  );
}
