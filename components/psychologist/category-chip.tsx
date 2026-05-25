import { Category, colors } from "@/app/(tabs)/psychologist";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { Text } from "../ui/text";

const CategoryChip = ({
  category,
  isSelected,
  onPress,
}: {
  category: Category;
  isSelected: boolean;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 30,
        marginRight: 10,
        backgroundColor: isSelected ? category.color : "white",
        borderWidth: isSelected ? 0 : 1,
        borderColor: colors.gray[200],
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
      }}
    >
      <Ionicons
        name={category.icon as any}
        size={20}
        color={isSelected ? "white" : category.color}
      />
      <Text
        style={{
          color: isSelected ? "white" : colors.gray[700],
          fontSize: 13,
          fontFamily: "vazir",
        }}
      >
        {category.title}
      </Text>
    </TouchableOpacity>
  );
};
export default CategoryChip;
