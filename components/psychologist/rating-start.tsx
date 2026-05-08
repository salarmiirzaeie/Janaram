import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Ionicons } from "@expo/vector-icons";

const RatingStars = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  return (
    <HStack space="xs" className="items-center">
      {[...Array(5)].map((_, i) => {
        let iconName: string = "star-outline";
        if (i < fullStars) iconName = "star";
        else if (i === fullStars && hasHalfStar) iconName = "star-half";
        return (
          <Ionicons key={i} name={iconName as any} size={12} color="#FBBF24" />
        );
      })}
      <Text className="text-xs text-gray-600 mr-1">{rating?.toFixed(1)}</Text>
    </HStack>
  );
};
export default RatingStars;
