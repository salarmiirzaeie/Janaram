import { Ionicons } from "@expo/vector-icons";
import React, { FC } from "react";
import { Text, View } from "react-native";
interface props {
  duration: string;
}
const DurationBadge: FC<props> = ({ duration }) => {
  return (
    <View
      style={{
        backgroundColor: "rgba(255,255,255,0.2)",
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
      }}
    >
      <Ionicons name="time-outline" size={12} color="white" />
      <Text
        style={{
          color: "white",
          fontSize: 11,
          fontWeight: "500",
          fontFamily: "vazir",
        }}
      >
        {duration} دقیقه
      </Text>
    </View>
  );
};

export default DurationBadge;
