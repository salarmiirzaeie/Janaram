// app/psychologist/[id].tsx
import { colors } from "@/app/(tabs)/psychologist";
import HorizonListHeader from "@/components/explore/horizon-list-header";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { useCustomToast } from "@/hooks/useToast";
import { useZarinpalPayment } from "@/hooks/useZarinpalPayment";
import { BASE_URL_IMAGES } from "@/redux/api-slice";
import { useProfileQuery } from "@/services/auth/auth-adapter";
import {
  useCreateAppointmentMutation,
  useGetAvailableSlotsQuery,
  useGetPsychologistByIdQuery,
} from "@/services/psychologist/psychologist-adapter";
import { getNextBookingDays } from "@/utils/booking-dates";
import { toPersianDigits } from "@/utils/persian";
import { AntDesign, FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StatusBar, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

const SPECIALTY_CHIP_STYLES = [
  { bg: colors.primary[50], border: colors.primary[200], text: colors.primary[700], icon: colors.primary[500] },
  { bg: colors.secondary[50], border: colors.secondary[200], text: colors.secondary[700], icon: colors.secondary[500] },
  { bg: colors.accent[50], border: colors.accent[200], text: colors.accent[700], icon: colors.accent[500] },
] as const;

export default function PsychologistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const toast = useCustomToast();
  const nextDays = useMemo(() => getNextBookingDays(14), []);
  const daysScrollRef = useRef<ScrollView>(null);
  const scrollDaysToToday = useCallback(() => {
    requestAnimationFrame(() => {
      daysScrollRef.current?.scrollToEnd({ animated: false });
    });
  }, []);

  useEffect(() => {
    scrollDaysToToday();
  }, [scrollDaysToToday]);

  const [selectedDate, setSelectedDate] = useState(nextDays[0]?.date ?? "");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: doctor, isLoading: isLoadingDoctor } = useGetPsychologistByIdQuery(id);
  const { data: slotsData, isLoading: isLoadingSlots } = useGetAvailableSlotsQuery(
    { id, date: selectedDate },
    { skip: !id || !selectedDate },
  );
  const { data: profile, isLoading: isLoadingProfile } = useProfileQuery(null);
  const [createAppointment, { isLoading: isBooking }] = useCreateAppointmentMutation();
  const { startAppointmentPayment, isLoading: isPaymentLoading } = useZarinpalPayment();

  const availableSlots = slotsData?.slots ?? [];
  const isOffDay = slotsData?.reason === "off_day";
  const canBook = !!selectedTime && availableSlots.includes(selectedTime) && !isOffDay && availableSlots.length > 0;

  const handleBooking = async () => {
    if (!selectedTime || !canBook) return;
    setIsProcessing(true);

    try {
      const result = await createAppointment({
        doctorId: id,
        date: selectedDate,
        time: selectedTime,
        initiatePayment: true,
        mobile: profile?.data?.phoneNumber,
      }).unwrap();

      if (result.paymentUrl) {
        const payResult = await startAppointmentPayment({
          appointmentId: result.appointmentId,
          paymentUrl: result.paymentUrl,
          description: `پرداخت هزینه جلسه مشاوره با دکتر ${result.doctorName}`,
        });

        if (payResult.paid) {
          router.push("/(tabs)/appointments");
          return;
        }
      }

      if (result.paymentError) {
        toast.show({
          msg: `نوبت ثبت شد. ${result.paymentError} — از «نوبت‌های من» دوباره پرداخت کنید.`,
          type: "success",
        });
        router.push("/(tabs)/appointments");
        return;
      }

      if (!result.paymentUrl) {
        const payResult = await startAppointmentPayment({
          appointmentId: result.appointmentId,
          description: `پرداخت هزینه جلسه مشاوره با دکتر ${result.doctorName}`,
        });

        if (!payResult.success) {
          toast.show({
            msg: "نوبت ثبت شد. می‌توانید از «نوبت‌های من» پرداخت را انجام دهید.",
            type: "success",
          });
          router.push("/(tabs)/appointments");
        }
      }
    } catch (err: any) {
      const msg = err?.data?.message || "خطا در رزرو نوبت";
      toast.show({ msg, type: "error" });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoadingDoctor || isLoadingProfile) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  if (!doctor) return null;

  const specialtyList =
    doctor.specialties?.length > 0 ? doctor.specialties : doctor.specialty ? [doctor.specialty] : ["روانشناس"];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* بخش پروفایل */}
        <LinearGradient
          colors={[colors.primary[50], "#fff", colors.secondary[50]]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <View style={{ flexDirection: "row-reverse", alignItems: "center", padding: 16 }}>
            <View
              style={{
                width: 88,
                height: 88,
                borderRadius: 44,
                backgroundColor: "#fff",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
                marginLeft: 14,
                borderWidth: 3,
                borderColor: colors.primary[100],
              }}
            >
              {doctor.avatar ? (
                <Image
                  source={{ uri: BASE_URL_IMAGES + doctor.avatar }}
                  style={{ width: 88, height: 88 }}
                  resizeMode="cover"
                />
              ) : (
                <Ionicons name="person" size={44} color={colors.secondary[500]} />
              )}
            </View>

            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "vazirBold",
                  color: colors.gray[800],
                  textAlign: "right",
                }}
                numberOfLines={2}
              >
                {doctor.name}
              </Text>
              <View
                style={{
                  flexDirection: "row-reverse",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 8,
                  backgroundColor: "rgba(255,255,255,0.85)",
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 20,
                }}
              >
                <Ionicons name="star" size={14} color="#FBBF24" />
                <Text style={{ fontSize: 13, fontFamily: "vazirBold", color: colors.gray[700] }}>
                  {toPersianDigits(String(doctor.rating ?? "—"))}
                </Text>
                <Text style={{ fontSize: 11, fontFamily: "vazir", color: colors.gray[500] }}>امتیاز</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: colors.gray[100],
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="chevron-back" size={22} color={colors.gray[700]} />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              flexDirection: "row-reverse",
              gap: 8,
              paddingVertical: 2,
              paddingHorizontal: 16,
            }}
          >
            {specialtyList.map((spec: string, idx: number) => {
              const chip = SPECIALTY_CHIP_STYLES[idx % SPECIALTY_CHIP_STYLES.length];
              return (
                <View
                  key={`${spec}-${idx}`}
                  style={{
                    flexDirection: "row-reverse",
                    alignItems: "center",
                    gap: 6,
                    backgroundColor: chip.bg,
                    paddingHorizontal: 14,
                    paddingVertical: 9,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: chip.border,
                  }}
                >
                  <Ionicons name="leaf-outline" size={14} color={chip.icon} />
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "vazirBold",
                      color: chip.text,
                    }}
                  >
                    {spec}
                  </Text>
                </View>
              );
            })}
          </ScrollView>

          <View
            style={{
              flexDirection: "row-reverse",
              gap: 8,
              marginTop: 16,
              paddingHorizontal: 16,
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "#fff",
                borderRadius: 16,
                paddingVertical: 12,
                paddingHorizontal: 8,
                alignItems: "center",
                borderWidth: 1,
                borderColor: colors.gray[100],
              }}
            >
              <MaterialIcons name="work-outline" size={20} color={colors.primary[500]} />
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: "vazirBold",
                  color: colors.gray[800],
                  marginTop: 4,
                }}
              >
                {toPersianDigits(String(doctor.experience))}
              </Text>
              <Text style={{ fontSize: 10, fontFamily: "vazir", color: colors.gray[500], marginTop: 2 }}>
                سال تجربه
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: "#fff",
                borderRadius: 16,
                paddingVertical: 12,
                paddingHorizontal: 8,
                alignItems: "center",
                borderWidth: 1,
                borderColor: colors.gray[100],
              }}
            >
              <FontAwesome5 name="users" size={18} color={colors.secondary[500]} />
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: "vazirBold",
                  color: colors.gray[800],
                  marginTop: 4,
                }}
              >
                {toPersianDigits(String(doctor.successfulConsultations || 0))}
              </Text>
              <Text style={{ fontSize: 10, fontFamily: "vazir", color: colors.gray[500], marginTop: 2 }}>
                جلسه موفق
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: "#fff",
                borderRadius: 16,
                paddingVertical: 12,
                paddingHorizontal: 8,
                alignItems: "center",
                borderWidth: 1,
                borderColor: colors.gray[100],
              }}
            >
              <Ionicons name="wallet-outline" size={20} color={colors.accent[500]} />
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "vazirBold",
                  color: colors.gray[800],
                  marginTop: 4,
                  textAlign: "center",
                }}
                numberOfLines={1}
              >
                {toPersianDigits((doctor.sessionPrice ?? 0).toLocaleString("fa-IR"))}
              </Text>
              <Text style={{ fontSize: 10, fontFamily: "vazir", color: colors.gray[500], marginTop: 2 }}>
                تومان / جلسه
              </Text>
            </View>
          </View>

          {doctor.medicalLicenseNumber ? (
            <View
              style={{
                flexDirection: "row-reverse",
                alignItems: "center",
                gap: 6,
                paddingTop: 12,
                // borderTopWidth: 1,
                // borderTopColor: colors.gray[100],
                paddingHorizontal: 16,
              }}
            >
              <Ionicons name="shield-checkmark-outline" size={14} color={colors.gray[400]} />
              <Text
                style={{
                  fontSize: 11,
                  color: colors.gray[500],
                  fontFamily: "vazir",
                  textAlign: "right",
                  flex: 1,
                }}
              >
                کد نظام پزشکی: {toPersianDigits(doctor.medicalLicenseNumber)}
              </Text>
            </View>
          ) : null}
        </LinearGradient>

        {/* درباره پزشک */}
        <View style={{ marginTop: 20, borderBottomWidth: 1, paddingBottom: 10, borderBottomColor: colors.gray[100] }}>
          <HStack className="justify-between items-center pl-5">
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: `/reviews`,
                  params: { id: doctor.id },
                })
              }
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <AntDesign name="comment" size={14} color={colors.primary[500]} />

              <Text className="text-sm font-vazir text-primary-500">نظرات</Text>
            </TouchableOpacity>

            <HorizonListHeader
              hideAll
              title={`درباره دکتر ${doctor.name.split(" ")[1] || doctor.name}`}
              icon={<Ionicons name="information-circle-sharp" size={24} color={colors.accent[500]} />}
              id={"1"}
            />
          </HStack>

          <TouchableOpacity onPress={() => setDescriptionExpanded(!descriptionExpanded)}>
            <Text
              style={{
                fontSize: 12,
                color: colors.gray[500],
                lineHeight: 22,
                textAlign: "right",
                fontFamily: "vazir",
                paddingHorizontal: 20,
              }}
            >
              {descriptionExpanded ? doctor.bio : doctor.bio?.slice(0, 100) + "..." || "بدون توضیحات"}
            </Text>
            {doctor.bio && doctor.bio?.length > 80 && (
              <Text
                style={{
                  color: "#79AED6",
                  fontSize: 12,
                  textAlign: "right",
                  fontFamily: "vazir",
                  marginTop: 4,
                  marginRight: 16,
                }}
              >
                {descriptionExpanded ? "بستن" : "بیشتر"}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* انتخاب تاریخ */}
        <View style={{ marginTop: 24 }}>
          {/* <Text
            style={{
              fontSize: 15,
              fontFamily: "vazirBold",
              color: colors.gray[800],
              marginBottom: 12,
              paddingHorizontal: 20,
              textAlign: "right",
            }}
          >
             انتخاب تاریخ نوبت
          </Text> */}
          <HorizonListHeader
            hideAll
            title={"انتخاب تاریخ نوبت"}
            icon={<Ionicons name="calendar" size={24} color="#79AED6" />}
            id={"1"}
          />

          <ScrollView
            ref={daysScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            onContentSizeChange={scrollDaysToToday}
            contentContainerStyle={{
              flexDirection: "row-reverse",
              paddingHorizontal: 16,
              gap: 12,
              paddingVertical: 10,
            }}
          >
            {nextDays.map((item, idx) => {
              const isSelected = selectedDate === item.date;
              return (
                <TouchableOpacity
                  key={idx}
                  onPress={() => {
                    setSelectedDate(item.date);
                    setSelectedTime(null);
                  }}
                  style={{
                    width: 70,
                    alignItems: "center",
                    paddingVertical: 12,
                    borderRadius: 24,
                    backgroundColor: isSelected ? colors.primary[500] : "#fff",
                    borderWidth: isSelected ? 0 : 1,
                    borderColor: isSelected ? colors.primary[500] : colors.gray[200],
                    shadowColor: "#000",
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: "vazirBold",
                      color: isSelected ? "#fff" : colors.gray[700],
                    }}
                  >
                    {item.dayOfWeek}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "vazir",

                      fontSize: 12,
                      color: isSelected ? colors.primary[100] : colors.gray[500],
                      marginTop: 4,
                    }}
                  >
                    {toPersianDigits(item.dayNumber)}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "vazir",

                      fontSize: 10,
                      color: isSelected ? colors.primary[100] : colors.gray[400],
                    }}
                  >
                    {item.monthName}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* انتخاب ساعت */}
        <View style={{ marginTop: 10 }}>
          {/* <Text
            style={{
              fontSize: 15,
              fontFamily: "vazirBold",
              color: colors.gray[800],
              marginBottom: 12,
              textAlign: "right",
            }}
          >
            ⏱ انتخاب ساعت
          </Text> */}
          <HorizonListHeader
            hideAll
            title={"انتخاب ساعت"}
            icon={<Ionicons name="time" size={24} color="#9966CC" />}
            id={"1"}
          />

          {isLoadingSlots ? (
            <ActivityIndicator size="small" color={colors.primary[500]} />
          ) : isOffDay ? (
            <View
              style={{
                backgroundColor: colors.gray[50],
                padding: 20,
                borderRadius: 20,
                alignItems: "center",
                paddingHorizontal: 20,
                marginHorizontal: 20,
              }}
            >
              <MaterialIcons name="event-busy" size={32} color={colors.gray[400]} />
              <Text
                style={{
                  color: colors.gray[500],
                  marginTop: 8,
                  fontFamily: "vazir",
                  textAlign: "center",
                }}
              >
                این روز تعطیل است
              </Text>
            </View>
          ) : availableSlots.length === 0 ? (
            <View
              style={{
                backgroundColor: colors.gray[50],
                padding: 20,
                borderRadius: 20,
                alignItems: "center",
                paddingHorizontal: 20,
                marginHorizontal: 20,
              }}
            >
              <MaterialIcons name="event-busy" size={32} color={colors.gray[400]} />
              <Text
                style={{
                  color: colors.gray[500],
                  marginTop: 8,
                  fontFamily: "vazir",
                  textAlign: "center",
                }}
              >
                هیچ زمانی موجود نیست
              </Text>
            </View>
          ) : (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, paddingHorizontal: 20 }}>
              {availableSlots.map((time) => (
                <TouchableOpacity
                  key={time}
                  onPress={() => setSelectedTime(time)}
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 8,
                    borderRadius: 30,
                    backgroundColor: selectedTime === time ? colors.accent[500] : "#fff",
                    borderWidth: 1,
                    borderColor: selectedTime === time ? colors.accent[500] : colors.gray[200],
                  }}
                >
                  <Text
                    style={{
                      color: selectedTime === time ? "#fff" : colors.gray[700],
                      fontFamily: "vazirBold",
                    }}
                  >
                    {toPersianDigits(time)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* دکمه ثابت پایین */}
      <View
        style={{
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: colors.gray[100],
          paddingHorizontal: 20,
          paddingVertical: 16,
        }}
      >
        {/* <Text
          style={{
            fontSize: 11,
            color: colors.gray[500],
            fontFamily: "vazir",
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          پرداخت اکنون — مبلغ تا پایان جلسه نزد پلتفرم می‌ماند. لغو بیش از ۱ ساعت قبل: بازپرداخت؛ کمتر از ۱ ساعت: مبلغ
          به روانشناس. روانشناس نمی‌تواند نوبت را لغو کند.
        </Text> */}
        <Button
          isDisabled={!canBook || isLoadingSlots || isProcessing || isBooking || isPaymentLoading}
          onPress={handleBooking}
          style={{
            borderRadius: 40,
            height: 52,
            backgroundColor: colors.primary[500],
          }}
        >
          {isProcessing || isBooking || isPaymentLoading ? (
            <ButtonSpinner color="#fff" />
          ) : (
            <ButtonText className="text-white text-base font-vazirBold">
              ادامه و پرداخت {toPersianDigits((doctor.sessionPrice ?? 0).toLocaleString("fa-IR"))} تومان
            </ButtonText>
          )}
        </Button>
      </View>
    </SafeAreaView>
  );
}
