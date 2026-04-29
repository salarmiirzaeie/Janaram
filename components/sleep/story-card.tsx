import { usePro } from "@/hooks/usePro";
import { BASE_URL_IMAGES } from "@/redux/api-slice";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback } from "react";
import { TouchableOpacity, View } from "react-native";
import FastImage from "react-native-fast-image";
import LinearGradient from "react-native-linear-gradient";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";

const StoryCard = ({ item }: { item: any; index: number }) => {
  const { handleOpenNotProModal, isProActive, showInterstitial } = usePro();

  const handlePress = useCallback(() => {
    if (item.isPro && !isProActive) return handleOpenNotProModal();
    showInterstitial();
    router.push({
      pathname: "/player",
      params: { id: item.id },
    });
  }, [item.id]);

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
      <LinearGradient
        colors={["#1a1a2e", "#16213e"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: 300,
          height: 190,
          borderRadius: 24,
          marginHorizontal: 8,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.1)",
        }}
      >
        <FastImage
          source={{ uri: BASE_URL_IMAGES + item.image }}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            opacity: 0.3,
          }}
          resizeMode="cover"
        />

        <View className="absolute top-4 right-4">
          <MaterialIcons
            name="auto-stories"
            size={32}
            color="rgba(255,255,255,0.2)"
          />
        </View>

        <View className="flex-1 justify-between p-6">
          <View>
            <Text className="text-white font-vazirBold  text-xl text-right mb-2">
              {item.title}
            </Text>
            <Text className="text-white/70 font-vazir text-sm text-right line-clamp-2">
              {item.description}
            </Text>
          </View>

          <HStack className="items-center justify-between mt-4">
            <View className="flex-row items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full">
              <Feather
                name="headphones"
                size={12}
                color="rgba(255,255,255,0.6)"
              />
              <Text className="text-white/60 font-vazir text-xs">
                {item.duration} دقیقه
              </Text>
            </View>
            <View className="bg-primary-500/20 rounded-full p-2">
              <Feather name="play" size={16} color="#79AED6" />
            </View>
          </HStack>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};
export default StoryCard;
