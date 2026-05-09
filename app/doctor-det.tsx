// app/psychologist/[id].tsx
import { colors } from "@/app/(tabs)/psychologist";
import HorizonListHeader from "@/components/explore/horizon-list-header";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
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
import { toPersianDigits } from "@/utils/persian";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import moment from "moment-jalaali";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

moment.loadPersian({ dialect: "persian-modern", usePersianDigits: false });

// تابع دریافت نام روز هفته بر اساس تاریخ میلادی
const getPersianDayName = (gregorianDate: Date): string => {
  const formatter = new Intl.DateTimeFormat("fa-IR", {
    timeZone: "Asia/Tehran",
    weekday: "long",
  });
  return formatter.format(gregorianDate);
};

// تابع دریافت عدد روز هفته (0=شنبه تا 6=جمعه)
const getPersianWeekdayNumber = (gregorianDate: Date): number => {
  const dayName = getPersianDayName(gregorianDate);
  const weekdayMap: Record<string, number> = {
    شنبه: 0,
    یکشنبه: 1,
    دوشنبه: 2,
    سه‌شنبه: 3,
    چهارشنبه: 4,
    پنجشنبه: 5,
    جمعه: 6,
  };
  return weekdayMap[dayName] ?? 0;
};

const getDayName = (dayIndex: number) => {
  const days = [
    "شنبه",
    "یکشنبه",
    "دوشنبه",
    "سه‌شنبه",
    "چهارشنبه",
    "پنجشنبه",
    "جمعه",
  ];
  return days[dayIndex];
};

const getMonthName = (month: number) => {
  const months = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];
  return months[month - 1];
};

// دریافت تاریخ‌های بعدی بدون استفاده از day() moment
const getNextDays = (count: number) => {
  const days = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    // تبدیل تاریخ به شمسی با moment-jalaali فقط برای روز و ماه
    const jalaaliDate = moment(date);
    const jYear = jalaaliDate.format("jYYYY");
    const jMonth = parseInt(jalaaliDate.format("jM"));
    const jDay = jalaaliDate.format("jD");

    // محاسبه روز هفته با Intl
    const weekdayNumber = getPersianWeekdayNumber(date);
    const weekdayName = getDayName(weekdayNumber);

    days.push({
      date: date.toISOString().split("T")[0],
      dayOfWeek: weekdayName,
      dayNumber: jDay,
      monthName: getMonthName(jMonth),
    });
  }
  return days;
};

export default function PsychologistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const toast = useCustomToast();
  const [selectedDate, setSelectedDate] = useState(getNextDays(7)[0].date);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: doctor, isLoading: isLoadingDoctor } =
    useGetPsychologistByIdQuery(id);
  const { data: slotsData, isLoading: isLoadingSlots } =
    useGetAvailableSlotsQuery(
      { id, date: selectedDate },
      { skip: !id || !selectedDate }
    );
  const { data: profile, isLoading: isLoadingProfile } = useProfileQuery(null);
  const [createAppointment, { isLoading: isBooking }] =
    useCreateAppointmentMutation();
  const { startPayment, isLoading: isPaymentLoading } = useZarinpalPayment();

  const availableSlots = slotsData?.slots || [];
  const nextDays = getNextDays(14);

  const handleBooking = async () => {
    if (!selectedTime) return;
    setIsProcessing(true);

    try {
      const result = await createAppointment({
        doctorId: id,
        date: selectedDate,
        time: selectedTime,
      }).unwrap();
      if (doctor) {
        await startPayment(
          result.appointmentId,
          doctor.sessionPrice,
          `پرداخت هزینه جلسه مشاوره با دکتر ${doctor.name} در تاریخ ${selectedDate} ساعت ${selectedTime}`
        );
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 12,
          flexDirection: "row",
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: colors.gray[100],
        }}
      >
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
        <Text
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 16,
            fontFamily: "vazirBold",
            color: colors.gray[800],
          }}
        >
        {doctor?.name}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* بخش پروفایل */}
        <View
          style={{
            flexDirection: "row-reverse",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingVertical: 20,
            backgroundColor: "#fff",
            borderBottomWidth: 1,
            borderBottomColor: colors.gray[100],
          }}
        >
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: colors.secondary[100],
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
              marginLeft: 16,
              borderWidth: 2,
              borderColor: "#fff",
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: 3,
            }}
          >
            {doctor.avatar ? (
              <Image
                source={{ uri: BASE_URL_IMAGES + doctor.avatar }}
                style={{ width: 80, height: 80 }}
              />
            ) : (
              <Ionicons name="person" size={40} color={colors.secondary[500]} />
            )}
          </View>

          <View style={{ flex: 1 }}>
          

            <View
              style={{
                flexDirection: "row-reverse",
                flexWrap: "wrap",
                gap: 6,
                marginBottom: 6,
              }}
            >
              {doctor.specialties
                ?.slice(0, 2)
                .map((spec: string, idx: number) => (
                  <View
                    key={idx}
                    style={{
                      backgroundColor: colors.primary[50],
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 12,
                    }}
                  >
                    <Text style={{ fontSize: 10,   fontFamily: "vazir",color: colors.primary[700] }}>
                      {spec}
                    </Text>
                  </View>
                ))}
              {doctor.specialties?.length > 2 && (
                <View
                  style={{
                    backgroundColor: colors.gray[100],
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 12,
                  }}
                >
                  <Text style={{ fontSize: 10, color: colors.gray[600] }}>
                    +{doctor.specialties.length - 2}
                  </Text>
                </View>
              )}
            </View>

            <View
              style={{
                flexDirection: "row",
                gap: 12,
                alignItems: "center",
                flexWrap: "wrap",
                justifyContent: "flex-end",
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <Ionicons name="star" size={12} color="#FBBF24" />
                <Text style={{ fontSize: 12, color: colors.gray[600],fontFamily: "vazir" }}>
                  {doctor.rating}
                </Text>
              </View>
              <View
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: colors.gray[300],
                }}
              />
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <MaterialIcons
                  name="work-outline"
                  size={12}
                  color={colors.gray[500]}
                />
                <Text style={{ fontSize: 12, color: colors.gray[600], fontFamily: "vazir", }}>
                  {doctor.experience} سال
                </Text>
              </View>
              <View
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: colors.gray[300],
                }}
              />
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4, }}
              >
                <FontAwesome5 name="users" size={11} color={colors.gray[500]} />
                <Text style={{ fontSize: 12, color: colors.gray[600],fontFamily: "vazir" }}>
                  {doctor.successfulConsultations || 0}
                </Text>
              </View>
            </View>

            {doctor.medicalLicenseNumber && (
              <Text
                style={{ fontSize: 10, color: colors.gray[400], marginTop: 6,fontFamily: "vazir" }}
              >
               کد نظام پزشکی: {doctor.medicalLicenseNumber}
              </Text>
            )}
          </View>
        </View>

        {/* درباره پزشک */}
        <View style={{ marginTop: 20,borderBottomWidth:1,paddingBottom:10,borderBottomColor:colors.gray[100] }}>
        <HorizonListHeader hideAll title={`درباره دکتر ${doctor.name.split(" ")[1] || doctor.name}`} icon={<Ionicons name="information-circle-sharp" size={24} color={colors.accent[500]}/>} id={"1"} />

        
             <TouchableOpacity
                        onPress={() => setDescriptionExpanded(!descriptionExpanded)}
                      >
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
                          {descriptionExpanded? doctor.bio:doctor.bio?.slice(0,100)+"..." || "بدون توضیحات"}
                        </Text>
                        {doctor.bio && doctor.bio?.length > 80 && (
                          <Text style={{  color: "#79AED6",
                            fontSize: 12,
                            textAlign: "center",
                            fontFamily: "vazir",
                            marginTop: 4,}}>
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
                          <HorizonListHeader hideAll title={"انتخاب تاریخ نوبت"} icon={<Ionicons name="calendar" size={24} color="#79AED6"/>} id={"1"} />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
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
                    borderColor: isSelected
                      ? colors.primary[500]
                      : colors.gray[200],
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
                      color: isSelected
                        ? colors.primary[100]
                        : colors.gray[500],
                      marginTop: 4,
                    }}
                  >
                    {toPersianDigits(item.dayNumber) }
                  </Text>
                  <Text
                    style={{
                      fontFamily: "vazir",

                      fontSize: 10,
                      color: isSelected
                        ? colors.primary[100]
                        : colors.gray[400],
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
        <View style={{ marginTop: 10}}>
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
                <HorizonListHeader hideAll title={"انتخاب ساعت"} icon={<Ionicons name="time" size={24} color="#9966CC"/>} id={"1"} />
          
          {isLoadingSlots ? (
            <ActivityIndicator size="small" color={colors.primary[500]} />
          ) : availableSlots.length === 0 ? (
            <View
              style={{
                backgroundColor: colors.gray[50],
                padding: 20,
                borderRadius: 20,
                alignItems: "center",
                 paddingHorizontal: 20 
              
              }}
            >
              <MaterialIcons
                name="event-busy"
                size={32}
                color={colors.gray[400]}
              />
              <Text style={{ color: colors.gray[500], marginTop: 8,  fontFamily: "vazir" }}>
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
                    backgroundColor:
                      selectedTime === time ? colors.accent[500] : "#fff",
                    borderWidth: 1,
                    borderColor:
                      selectedTime === time
                        ? colors.accent[500]
                        : colors.gray[200],
                       
                  }}
                >
                  <Text
                    style={{
                      color: selectedTime === time ? "#fff" : colors.gray[700],
                      fontFamily:"vazirBold"
                    }}
                  >
                    { toPersianDigits(time)}
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
        <Button
          isDisabled={
            !selectedTime ||
            isLoadingSlots ||
            isProcessing ||
            isBooking ||
            isPaymentLoading
          }
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
              ادامه و پرداخت {doctor.sessionPrice?.toLocaleString()} تومان
            </ButtonText>
          )}
        </Button>
      </View>
    </SafeAreaView>
  );
}
