import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

const ProBadge = () => {
  return (
    <View
      style={{
        position: "absolute",
        top: 12,
        right: 12,
        backgroundColor: "rgba(0,0,0,0.3)",
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        zIndex: 10,
      }}
    >
      <Ionicons name="diamond" size={12} color="#FFD700" />
      <Text
        style={{
          color: "#FFD700",
          fontSize: 10,
          fontWeight: "bold",
          fontFamily: "vazir",
        }}
      >
        PRO
      </Text>
    </View>
  );
};

export default ProBadge;
