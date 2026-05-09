import { colors } from "@/app/(tabs)/psychologist";
import RatingStars from "@/components/psychologist/rating-start";
import { BASE_URL_IMAGES } from "@/redux/api-slice";
import { Psychologist } from "@/services/psychologist/psychologist-adapter";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Dimensions, Image, TouchableOpacity, View } from "react-native";
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
        borderRadius: 20,
        marginRight: 12,
        width: width * 0.68,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: "#eee",
        overflow: "hidden",
      }}
    >
      {/* عکس */}
      <View
        style={{
          width: "100%",
          height: 110,
          backgroundColor: colors.secondary[100],
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {psychologist.avatar ? (
          <Image
            source={{ uri: BASE_URL_IMAGES + psychologist.avatar }}
            style={{ width: "100%", height: 110 }}
            resizeMode="cover"
          />
        ) : (
          <Ionicons name="person" size={44} color={colors.secondary[400]} />
        )}
      </View>

      {/* محتوا */}
      <View style={{ padding: 12 }}>
        {/* نام */}
        <Text
          style={{
            fontSize: 15,
            fontFamily: "vazirBold",
            color: "#1F2937",
            marginBottom: 2,
            textAlign: "right",
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
            marginBottom: 6,
            textAlign: "right",
          }}
          numberOfLines={1}
        >
          {psychologist.specialty || "روانشناس"}
        </Text>

        {/* امتیاز و تجربه */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <RatingStars rating={psychologist.rating} />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <MaterialIcons name="work-outline" size={11} color="#9CA3AF" />
            <Text style={{ fontSize: 10, color: "#9CA3AF" }}>
              {psychologist.experience} سال
            </Text>
          </View>
        </View>

        {/* دکمه */}
        <TouchableOpacity
          onPress={handlePress}
          style={{
            backgroundColor: colors.primary[500],
            paddingVertical: 8,
            borderRadius: 25,
            alignItems: "center",
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
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default PsychologistCard;
