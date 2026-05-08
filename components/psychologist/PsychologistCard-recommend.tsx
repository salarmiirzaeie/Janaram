import { colors } from "@/app/(tabs)/psychologist";
import RatingStars from "@/components/psychologist/rating-start";
import { Psychologist } from "@/services/psychologist/psychologist-adapter";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Dimensions, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Button, ButtonText } from "../ui/button";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
const { width } = Dimensions.get("window");

const PsychologistCard = ({ psychologist }: { psychologist: Psychologist }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => {
        router.push({
          pathname: "/doctor-det",
          params: {
            id: psychologist.id,
          },
        });
      }}
      style={{
        backgroundColor: "white",
        borderRadius: 20,
        marginRight: 16,
        width: width * 0.7,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: colors.gray[200],
      }}
    >
      <LinearGradient
        colors={[colors.primary[50], "white"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 20, padding: 16 }}
      >
        <HStack space="md" className="items-start ">
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: colors.primary[100],
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="person" size={32} color={colors.primary[500]} />
          </View>
          <VStack className="flex-1">
            <Text className="text-base text-right font-vazirBold text-gray-800">
              {psychologist.name}
            </Text>
            <Text className="text-xs text-right font-vazir text-gray-500 mt-0.5">
              {psychologist.specialty}
            </Text>
            <HStack space="sm" className="mt-1 flex-row-reverse items-center">
              <RatingStars rating={psychologist.rating} />
              <View className="w-1 h-1 bg-gray-300 rounded-full" />
              <Text className="text-xs font-vazir  text-gray-500">
                {psychologist.experience} سال
              </Text>
            </HStack>
            <HStack className="justify-end  items-center mt-2">
              {/* <HStack space="xs" className="items-center">
                  <Text
                    className="text-sm font-vazirBold"
                    style={{ color: colors.accent[600] }}
                  >
                    {psychologist.sessionPrice.toLocaleString()}
                  </Text>
                  <Text className="text-xs text-gray-500">تومان</Text>
                </HStack> */}
              {/* {psychologist.availableToday ? (
                <View className="bg-green-100 px-2 py-0.5 rounded-full">
                  <Text className="text-green-600 text-xs">
                    امروز نوبت دارد
                  </Text>
                </View>
              ) : (
                <View className="bg-gray-100 px-2 py-0.5 rounded-full">
                  <Text className="text-gray-500 text-xs">پر شده</Text>
                </View>
              )} */}
            </HStack>
          </VStack>
        </HStack>
        <Button
          onPress={() => {
            router.push({
              pathname: "/doctor-det",
              params: {
                id: psychologist.id,
              },
            });
          }}
          className="mt-3 rounded-full h-10"
          style={{ backgroundColor: colors.primary[500] }}
        >
          <ButtonText className="text-sm">دریافت نوبت</ButtonText>
        </Button>
      </LinearGradient>
    </TouchableOpacity>
  );
};
export default PsychologistCard;
