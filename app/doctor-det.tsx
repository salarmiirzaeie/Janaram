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
import React, { useMemo, useState } from "react";
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

export default function PsychologistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const toast = useCustomToast();
  const nextDays = useMemo(() => getNextBookingDays(14), []);
  const [selectedDate, setSelectedDate] = useState(nextDays[0]?.date ?? "");
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
  const { startAppointmentPayment, isLoading: isPaymentLoading } =
    useZarinpalPayment();

  const availableSlots = slotsData?.slots ?? [];
  const isOffDay = slotsData?.reason === "off_day";
  const canBook =
    !!selectedTime &&
    availableSlots.includes(selectedTime) &&
    !isOffDay &&
    availableSlots.length > 0;

  const handleBooking = async () => {
    if (!selectedTime || !canBook) return;
    setIsProcessing(true);

    try {
      const result = await createAppointment({
        doctorId: id,
        date: selectedDate,
        time: selectedTime,
      }).unwrap();

      const payResult = await startAppointmentPayment({
        appointmentId: result.appointmentId,
        description: `پرداخت هزینه جلسه مشاوره با دکتر ${result.doctorName} در تاریخ ${result.date} ساعت ${result.time}`,
      });

      if (!payResult.success) {
        toast.show({
          msg: "نوبت ثبت شد. می‌توانید از «نوبت‌های من» پرداخت را انجام دهید.",
          type: "success",
        });
        router.push("/my-appointments");
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
          <HStack className="justify-between items-center pl-5"> 
            
            <TouchableOpacity
  onPress={() => router.push({
    pathname:`/reviews`,
    params:{id:doctor.id}
  })}
  style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
>
<AntDesign name="comment" size={14} color={colors.primary[500]} />

  <Text className="text-sm font-vazir text-primary-500">نظرات</Text>
</TouchableOpacity>       


 <HorizonListHeader hideAll title={`درباره دکتر ${doctor.name.split(" ")[1] || doctor.name}`} icon={<Ionicons name="information-circle-sharp" size={24} color={colors.accent[500]}/>} id={"1"} />
          </HStack>

       
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
              <MaterialIcons
                name="event-busy"
                size={32}
                color={colors.gray[400]}
              />
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
              <MaterialIcons
                name="event-busy"
                size={32}
                color={colors.gray[400]}
              />
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
        <Text
          style={{
            fontSize: 11,
            color: colors.gray[500],
            fontFamily: "vazir",
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          پرداخت اکنون — مبلغ تا پایان جلسه نزد پلتفرم می‌ماند. لغو بیش از ۱
          ساعت قبل: بازپرداخت؛ کمتر از ۱ ساعت: مبلغ به روانشناس. روانشناس نمی‌تواند
          نوبت را لغو کند.
        </Text>
        <Button
          isDisabled={
            !canBook ||
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
              ادامه و پرداخت{" "}
              {toPersianDigits(
                (doctor.sessionPrice ?? 0).toLocaleString("fa-IR")
              )}{" "}
              تومان
            </ButtonText>
          )}
        </Button>
      </View>
    </SafeAreaView>
  );
}
