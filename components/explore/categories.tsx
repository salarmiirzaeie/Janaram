import {
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";
import CategoriesItem from "./categories-item";
const CATEGORIES = [
  {
    id: "calm",
    title: "آرامش",
    icon: <Feather name="wind" size={24} color="white" />,
    colors: ["#79AED6", "#5E95BD"],
  },
  {
    id: "self",
    title: "خودسازی",
    icon: <MaterialIcons name="self-improvement" size={24} color="white" />,
    colors: ["#9966CC", "#804DB3"],
  },
  {
    id: "instrumental",
    title: "بی کلام",
    icon: <FontAwesome5 name="guitar" size={22} color="white" />,
    colors: ["#91A5BE", "#5E95BD"],
  },
  {
    id: "sleep",
    title: "خواب خوب",
    icon: <Feather name="moon" size={24} color="white" />,
    colors: ["#91A5BE", "#7A8BA8"],
  },
  {
    id: "love",
    title: "عشق",
    icon: <Ionicons name="heart" size={24} color="white" />,
    colors: ["#FF9966", "#FFAD85"],
  },
  {
    id: "nature",
    title: "طبیعت",
    icon: <MaterialIcons name="nature-people" size={24} color="white" />,
    colors: ["#79AED6", "#9966CC"],
  },
];
const Categories = () => {
  return (
    <View className="mx-5 mb-0">
      <View className="flex-row flex-wrap gap-3">
        {CATEGORIES.map((cat) => (
          <CategoriesItem key={cat.id} cat={cat} />
        ))}
      </View>
    </View>
  );
};
export default React.memo(Categories);
