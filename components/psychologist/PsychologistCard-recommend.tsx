import { colors } from "@/app/(tabs)/psychologist";
import RatingStars from "@/components/psychologist/rating-start";
import { BASE_URL_IMAGES } from "@/redux/api-slice";
import { Psychologist } from "@/services/psychologist/psychologist-adapter";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Dimensions, Image, TouchableOpacity, View } from "react-native";
import PrimaryButton from "../ui/button/primary-button";
import { Text } from "../ui/text";

const { width } = Dimensions.get("window");

const PsychologistCard = ({ psychologist }: { psychologist: Psychologist }) => {
  const handlePress = () => {
    router.push({
      pathname: "/doctor-det",
      params: { id: psychologist.id },
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handlePress}
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        marginRight: 12,
        width: width * 0.45,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
        borderWidth: 0.5,
        borderColor: "#F0F0F0",
        overflow: "hidden",
      }}
    >
      {/* عکس دایره‌ای در بالا */}
      <View
        style={{
          paddingTop: 16,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: colors.secondary[50],
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          {psychologist.avatar ? (
            <Image
              source={{ uri: BASE_URL_IMAGES + psychologist.avatar }}
              style={{ width: 80, height: 80 }}
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="person" size={40} color={colors.secondary[400]} />
          )}
        </View>
      </View>

      {/* محتوا */}
      <View style={{ padding: 14, alignItems: "center" }}>
        {/* نام */}
        <Text
          style={{
            fontSize: 15,
            fontFamily: "vazirBold",
            color: "#1F2937",
            marginBottom: 2,
            textAlign: "center",
          }}
          numberOfLines={1}
        >
          {psychologist.name}
        </Text>

        {/* تخصص */}
        <Text
          style={{
            fontSize: 11,
            color: "#9CA3AF",
            marginBottom: 8,
            textAlign: "center",
          }}
          numberOfLines={1}
        >
          {psychologist.specialty || "روانشناس"}
        </Text>

        {/* امتیاز */}
        <View style={{ marginBottom: 12 }}>
          <RatingStars rating={psychologist.rating} />
        </View>

        {/* دکمه */}
        {/* <TouchableOpacity
          onPress={handlePress}
          style={{
            backgroundColor: colors.primary[500],
            paddingVertical: 8,
            paddingHorizontal: 20,
            borderRadius: 20,
            alignItems: "center",
            width: "100%",
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
        </TouchableOpacity> */}
        <PrimaryButton title="دریافت نوبت" onPress={handlePress} />
      </View>
    </TouchableOpacity>
  );
};

export default PsychologistCard;
