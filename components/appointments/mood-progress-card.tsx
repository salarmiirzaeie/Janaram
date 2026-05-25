import { Text } from "@/components/ui/text";
import { useGetMoodReportQuery } from "@/services/report/report-adapter";
import { toPersianDigits } from "@/utils/persian";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { TouchableOpacity, View } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";

type MoodProgressCardProps = {
  completedSessions: number;
  upcomingSessions: number;
};

export default function MoodProgressCard({ completedSessions, upcomingSessions }: MoodProgressCardProps) {
  const { data: moodData } = useGetMoodReportQuery({ page: 1, limit: 30 });
  const moodLogCount = moodData?.data?.length ?? 0;

  const totalJourney = completedSessions + upcomingSessions;
  const progressPercent = useMemo(() => {
    if (totalJourney === 0) return 0;
    return Math.min(100, Math.round((completedSessions / totalJourney) * 100));
  }, [completedSessions, totalJourney]);

  const handleOpenMood = () => {
    router.push("/reports");
  };

  return (
    <LinearGradient
      colors={["#5B9BD5", "#7B68C4", "#9966CC"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        borderRadius: 24,
        padding: 18,
        marginBottom: 16,
        shadowColor: "#9966CC",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 6,
      }}
    >
      <View
        style={{
          flexDirection: "row-reverse",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <Text
            style={{
              color: "rgba(255,255,255,0.85)",
              fontFamily: "vazir",
              fontSize: 12,
              textAlign: "right",
            }}
          >
            مسیر درمانی و احساسی شما
          </Text>
          <Text
            style={{
              color: "#fff",
              fontFamily: "vazirBold",
              fontSize: 18,
              textAlign: "right",
              marginTop: 4,
            }}
          >
            پیشرفت جلسات
          </Text>
        </View>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: "rgba(255,255,255,0.2)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="trending-up" size={22} color="#fff" />
        </View>
      </View>

      <View
        style={{
          flexDirection: "row-reverse",
          gap: 10,
          marginBottom: 14,
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(255,255,255,0.15)",
            borderRadius: 16,
            padding: 12,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontFamily: "vazirBold", fontSize: 22 }}>
            {toPersianDigits(String(completedSessions))}
          </Text>
          <Text
            style={{
              color: "rgba(255,255,255,0.9)",
              fontFamily: "vazir",
              fontSize: 11,
              marginTop: 4,
            }}
          >
            جلسه انجام‌شده
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(255,255,255,0.15)",
            borderRadius: 16,
            padding: 12,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontFamily: "vazirBold", fontSize: 22 }}>
            {toPersianDigits(String(upcomingSessions))}
          </Text>
          <Text
            style={{
              color: "rgba(255,255,255,0.9)",
              fontFamily: "vazir",
              fontSize: 11,
              marginTop: 4,
            }}
          >
            جلسه پیش‌رو
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(255,255,255,0.15)",
            borderRadius: 16,
            padding: 12,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontFamily: "vazirBold", fontSize: 22 }}>
            {toPersianDigits(String(moodLogCount))}
          </Text>
          <Text
            style={{
              color: "rgba(255,255,255,0.9)",
              fontFamily: "vazir",
              fontSize: 11,
              marginTop: 4,
            }}
          >
            ثبت حال
          </Text>
        </View>
      </View>

      {/* {totalJourney > 0 && (
        <View style={{ marginBottom: 14 }}>
          <View
            style={{
              flexDirection: "row-reverse",
              justifyContent: "space-between",
              marginBottom: 6,
            }}
          >
            <Text
              style={{
                color: "rgba(255,255,255,0.9)",
                fontFamily: "vazir",
                fontSize: 11,
              }}
            >
              {toPersianDigits(String(progressPercent))}٪ مسیر طی‌شده
            </Text>
          </View>
          <View
            style={{
              height: 8,
              borderRadius: 4,
              backgroundColor: "rgba(255,255,255,0.25)",
              overflow: "hidden",
            }}
          >
            <View
              style={{
                height: "100%",
                width: `${progressPercent}%`,
                backgroundColor: "#fff",
                borderRadius: 4,
                alignSelf: "flex-end",
              }}
            />
          </View>
        </View>
      )} */}

      <TouchableOpacity onPress={handleOpenMood} activeOpacity={0.85}>
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            paddingVertical: 14,
            paddingHorizontal: 16,
            flexDirection: "row-reverse",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <AntDesign name="bar-chart" size={20} color="#9966CC" />
          <Text
            style={{
              color: "#9966CC",
              fontFamily: "vazirBold",
              fontSize: 15,
            }}
          >
            حال من — نمودار احساسات و روند
          </Text>
          <Ionicons name="chevron-back" size={18} color="#9966CC" />
        </View>
      </TouchableOpacity>
    </LinearGradient>
  );
}
