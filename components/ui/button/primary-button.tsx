import React, { FC } from "react";
import { TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Text } from "../text";
interface props {
  onPress: () => void;
  title: string;
  size?: "md" | "sm" | "lg";
}
const PrimaryButton: FC<props> = ({ onPress, title, size = "md" }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={["#79AED6", "#9966CC"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 16,
          paddingVertical: 8,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 8,
          paddingHorizontal: 16,
        }}
      >
        <Text className="text-white font-vazirBold ">{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default PrimaryButton;
