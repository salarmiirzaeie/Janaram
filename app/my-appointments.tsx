// app/(tabs)/appointments.tsx
import { colors } from "@/app/(tabs)/psychologist";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useZarinpalPayment } from "@/hooks/useZarinpalPayment";
import {
  useCancelAppointmentMutation,
  useGetUserAppointmentsQuery,
} from "@/services/psychologist/psychologist-adapter";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import moment from "moment-jalaali";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

type TabType = "upcoming" | "past";

moment.loadPersian({ dialect: "persian-modern", usePersianDigits: false });

const formatDatePersian = (gregorianDateStr: string) => {
  const m = moment(gregorianDateStr);
  return m.format("jD jMMMM jYYYY");
};

const toJalaaliDateStr = (gregorianDateStr: string) => {
  const m = moment(gregorianDateStr);
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

const getStatusBadge = (status: string) => {
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
        color: colors.accent[600],
        bg: colors.accent[50],
      };
    case "pending_payment":
      return {
        text: "در انتظار پرداخت",
        color: "#F59E0B",
        bg: "#FEF3C7",
      };
    default:
      return { text: "در انتظار", color: "#F59E0B", bg: "#FEF3C7" };
  }
};

export default function AppointmentsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");
  const [loadingAppointmentId, setLoadingAppointmentId] = useState<
    string | null
  >(null);

  const {
    data: response,
    isLoading,
    refetch,
    isFetching,
  } = useGetUserAppointmentsQuery();

  const appointments = response?.data || [];
  const [cancelAppointment, { isLoading: isCancelling }] =
    useCancelAppointmentMutation();
  const { startPayment, isLoading: isPaymentLoading } = useZarinpalPayment();

  const todayJalaali = getTodayJalaali();
  const currentTimeNumber = getCurrentTimeNumber();

  const upcoming = useMemo(() => {
    return appointments
      .filter((app) => {
        if (app.status === "cancelled") return false;
        if (app.status === "pending_payment") return false;
        const appJalaaliDate = toJalaaliDateStr(app.date);
        const appTimeNumber = timeToNumber(app.time);
        if (appJalaaliDate > todayJalaali) return true;
        if (
          appJalaaliDate === todayJalaali &&
          appTimeNumber >= currentTimeNumber
        )
          return true;
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
        if (app.status === "cancelled") return true;
        if (app.status === "pending_payment") return true;
        const appJalaaliDate = toJalaaliDateStr(app.date);
        const appTimeNumber = timeToNumber(app.time);
        if (appJalaaliDate < todayJalaali) return true;
        if (
          appJalaaliDate === todayJalaali &&
          appTimeNumber < currentTimeNumber
        )
          return true;
        return false;
      })
      .sort((a, b) => {
        const dateCompare = b.date.localeCompare(a.date);
        if (dateCompare !== 0) return dateCompare;
        return b.time.localeCompare(a.time);
      });
  }, [appointments, todayJalaali, currentTimeNumber]);

  const handleCancel = async (appointmentId: string) => {
    try {
      await cancelAppointment(appointmentId).unwrap();
      refetch();
    } catch (error) {
      console.error("Cancel failed", error);
    }
  };

  const handlePayment = async (appointment: any) => {
    setLoadingAppointmentId(appointment.id);
    try {
      await startPayment(
        appointment.id,
        appointment.sessionPrice,
        `پرداخت هزینه جلسه مشاوره با دکتر ${appointment.doctorName}`
      );
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setLoadingAppointmentId(null);
    }
  };

  const renderAppointmentCard = (app: any) => {
    const statusInfo = getStatusBadge(app.status);
    const isThisPaymentLoading = loadingAppointmentId === app.id;

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
          <VStack className="flex-1">
            <Text className="text-base font-vazirBold text-gray-800">
              {app.doctorName}
            </Text>
            <Text className="text-xs text-gray-500 mt-1">
              {app.specialty || "روانشناس"}
            </Text>
            <HStack space="sm" className="mt-2 items-center">
              <Ionicons
                name="calendar-outline"
                size={14}
                color={colors.gray[500]}
              />
              <Text className="text-xs text-gray-600">
                {formatDatePersian(app.date)}
              </Text>
              <Ionicons
                name="time-outline"
                size={14}
                color={colors.gray[500]}
              />
              <Text className="text-xs text-gray-600">{app.time}</Text>
            </HStack>
            {app.status === "pending_payment" && (
              <View className="mt-2">
                <Text className="text-orange-500 text-xs">
                  ⚠️ این نوبت در انتظار پرداخت است. برای تکمیل رزرو، پرداخت را
                  انجام دهید.
                </Text>
              </View>
            )}
          </VStack>
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
        </HStack>

        {app.status === "confirmed" && activeTab === "upcoming" && (
          <Button
            onPress={() => handleCancel(app.id)}
            disabled={isCancelling}
            variant="outline"
            className="mt-3 rounded-full h-9 border-red-300"
          >
            <ButtonText className="text-red-500 text-xs">لغو نوبت</ButtonText>
          </Button>
        )}

        {app.status === "pending_payment" && (
          <Button
            onPress={() => handlePayment(app)}
            disabled={isThisPaymentLoading}
            className="mt-3 rounded-full h-9"
            style={{ backgroundColor: colors.primary[500] }}
          >
            <ButtonText className="text-xs text-white">
              {isThisPaymentLoading
                ? "در حال اتصال به درگاه..."
                : `پرداخت ${app.sessionPrice?.toLocaleString()} تومان و تکمیل رزرو`}
            </ButtonText>
          </Button>
        )}
      </View>
    );
  };

  const renderEmptyState = () => (
    <View className="py-20 items-center">
      <Ionicons name="calendar-outline" size={64} color={colors.gray[300]} />
      <Text className="text-gray-500 mt-3 text-center">هیچ نوبتی یافت نشد</Text>
      <Text className="text-gray-400 text-xs mt-1 text-center">
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <LinearGradient
        colors={[colors.primary[50], colors.secondary[50]]}
        style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 }}
      >
        <HStack className="items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "white",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="chevron-back" size={24} color={colors.gray[600]} />
          </TouchableOpacity>
          <View className="flex-1 mr-4">
            <Text className="text-2xl font-vazirBold text-gray-800 text-right">
              نوبت‌های من
            </Text>
            <Text className="text-gray-600 text-right text-sm mt-1">
              لیست نوبت‌های رزرو شده و گذشته
            </Text>
          </View>
        </HStack>
      </LinearGradient>

      {/* Tab Switcher */}
      <HStack className="px-5 mt-4 border-b border-gray-200">
        <TouchableOpacity
          onPress={() => setActiveTab("upcoming")}
          style={{
            flex: 1,
            alignItems: "center",
            paddingVertical: 12,
            borderBottomWidth: 2,
            borderBottomColor:
              activeTab === "upcoming" ? colors.primary[500] : "transparent",
          }}
        >
          <Text
            style={{
              color:
                activeTab === "upcoming"
                  ? colors.primary[500]
                  : colors.gray[500],
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
            borderBottomColor:
              activeTab === "past" ? colors.primary[500] : "transparent",
          }}
        >
          <Text
            style={{
              color:
                activeTab === "past" ? colors.primary[500] : colors.gray[500],
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
          paddingBottom: 40,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor={colors.primary[500]}
          />
        }
      >
        {activeTab === "upcoming" &&
          (upcoming.length === 0
            ? renderEmptyState()
            : upcoming.map(renderAppointmentCard))}
        {activeTab === "past" &&
          (past.length === 0
            ? renderEmptyState()
            : past.map(renderAppointmentCard))}
      </ScrollView>
    </SafeAreaView>
  );
}
