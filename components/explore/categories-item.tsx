import { router } from "expo-router";
import React, { FC, ReactNode, useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
interface categoryItemProps {
  cat: { id: string; title: string; icon: ReactNode; colors: string[] };
}
const STATIC_STYLES = StyleSheet.create({
  categoryGradient: {
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  searchGradient: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#E9EDF2",
  },
  skeletonHorizontal: {
    height: 208,
    width: 176,
    marginHorizontal: 8,
    borderRadius: 16,
  },
});
const CategoriesItem: FC<categoryItemProps> = ({ cat }) => {
  const handleCategoryPress = useCallback(() => {
    router.push({
      pathname: "/all-files",
      params: { type: cat.id, title: cat.title },
    });
  }, []);
  return (
    <TouchableOpacity
      className="flex-1 min-w-[30%]"
      onPress={handleCategoryPress}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={cat.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={STATIC_STYLES.categoryGradient}
        // @ts-ignore – shadowColor supports string but TS may complain
        shadowColor={cat.colors[0]}
      >
        <View className="mb-1">{cat.icon}</View>
        <Text className="text-white font-vazirBold text-sm">{cat.title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default CategoriesItem;
