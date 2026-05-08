// components/psychologist/psycho-card.tsx
import { colors } from "@/app/(tabs)/psychologist";
import { BASE_URL_IMAGES } from "@/redux/api-slice";
import { Psychologist } from "@/services/psychologist/psychologist-adapter";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { FC } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import RatingStars from "./rating-start";

const PsychoCard: FC<{ doc: Psychologist }> = ({ doc }) => {
  const handlePress = () => {
    router.push({
      pathname: "/doctor-det",
      params: { id: doc.id },
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handlePress}
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#f0f0f0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
      }}
    >
      <View style={{ flexDirection: "row", padding: 12 }}>
        {/* ====== سمت راست: اطلاعات ====== */}
        <View style={{ flex: 1, marginLeft: 12 }}>
          {/* نام + امتیاز */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <RatingStars rating={doc.rating} />
            <Text
              style={{
                fontSize: 15,
                fontFamily: "vazirBold",
                color: "#1f2937",
                flex: 1,
                textAlign: "right",
                marginRight: 4,
              }}
              numberOfLines={1}
            >
              {doc.name}
            </Text>
          </View>

          {/* تخصص */}
          <Text
            style={{
              fontSize: 12,
              color: "#6b7280",
              marginBottom: 8,
              lineHeight: 18,
            }}
            numberOfLines={1}
          >
            {doc.specialties?.length > 0
              ? doc.specialties.slice(0, 2).join(" • ")
              : doc.specialty || "روانشناس"}
          </Text>

          {/* اطلاعات پایین: سال تجربه + دکمه */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={handlePress}
              style={{
                backgroundColor: colors.primary[500],
                paddingHorizontal: 14,
                paddingVertical: 6,
                borderRadius: 20,
                width: 120,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  color: "#fff",
                  fontFamily: "vazirBold",
                }}
              >
                دریافت نوبت
              </Text>
            </TouchableOpacity>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <MaterialIcons name="work-outline" size={14} color="#9ca3af" />
              <Text style={{ fontSize: 11, color: "#9ca3af" }}>
                {doc.experience} سال
              </Text>
            </View>
          </View>
        </View>

        {/* ====== سمت چپ: عکس ====== */}
        <View
          style={{
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: colors.primary[50],
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          {doc.avatar ? (
            <Image
              source={{ uri: BASE_URL_IMAGES + doc.avatar }}
              style={{ width: 70, height: 70 }}
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="person" size={32} color={colors.primary[500]} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PsychoCard;
