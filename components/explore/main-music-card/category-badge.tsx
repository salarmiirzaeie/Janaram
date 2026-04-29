import { Ionicons } from "@expo/vector-icons";
import React, { FC } from "react";
import { Text, View } from "react-native";
interface props {
  category: string;
}
const CategoryBadge: FC<props> = ({ category }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: "rgba(255,255,255,0.15)",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
      }}
    >
      <Ionicons name="musical-notes" size={12} color="rgba(255,255,255,0.9)" />
      <Text
        style={{
          color: "rgba(255,255,255,0.9)",
          fontSize: 10,
          fontWeight: "500",
          fontFamily: "vazir",
        }}
      >
        {category}
      </Text>
    </View>
  );
};

export default CategoryBadge;
