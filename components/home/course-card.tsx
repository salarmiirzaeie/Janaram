import { useAudioPlayer } from "@/context/AudioPlayerContext";
import { BASE_URL_IMAGES } from "@/redux/api-slice";
import { usePlansQuery } from "@/services/upgrade/upgrade-adapter";
import { Meditation } from "@/types";
import { Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, View } from "react-native";
import { useDispatch } from "react-redux";
import { Badge, BadgeText } from "../ui/badge";
import { HStack } from "../ui/hstack";
import { Pressable } from "../ui/pressable";
import { Spinner } from "../ui/spinner";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
interface IVStackProps extends React.ComponentProps<typeof VStack> {
  index: number;
  item: Meditation;
}
const cardColors = [
  { bg: "bg-secondary-300", btn: "bg-secondary-500" },
  { bg: "bg-primary-300", btn: "bg-primary-500" },
  { bg: "bg-calm-300", btn: "bg-calm-500" },
];

const CourseCard: React.FC<IVStackProps> = ({ index, item }) => {
  const { loadTrack, track } = useAudioPlayer();
  const [isLoading, setLoading] = useState(false);
  const { data: plans } = usePlansQuery(null);
  const proPlan = plans?.data.plans?.find((plan) => plan.name === "unlimited");
  const dispatch = useDispatch();
  const handleOpenNotProModal = () => {
    dispatch({
      type: "pro/setShowNotProModal",
      payload: {
        message: "🌙 این مدیتیشن مخصوص کاربران Pro است",
        showNotProModal: true,
      },
    });
  };
  const handlePlay = async () => {
    setLoading(true);
    if (item.id) {
      if (item.isPro && !proPlan?.isActive) {
        handleOpenNotProModal();
        setLoading(false);

        return;
      }
      await loadTrack(item.id);
    }
    setLoading(false);
  };

  const colorSet = cardColors[index % cardColors.length];

  return (
    <Pressable
      onPress={() => {
        if (item.isPro && !proPlan?.isActive) {
          handleOpenNotProModal();
          return;
        }
        router.push({
          pathname: "/player",
          params: {
            id: `${item?.id}`,
          },
        });
      }}
    >
      {item?.isPro && (
        <Badge
          className={`absolute left-2 ${colorSet.btn} z-50 rounded-r-xl top-1/4`}
        >
          <BadgeText className="font-vazir text-white">{"Pro"}</BadgeText>
        </Badge>
      )}
      <VStack
        className={`rounded-3xl shadow-sm h-52 w-48 justify-between p-5 mx-2 ${colorSet.bg}`}
      >
        <Image
          source={{
            uri: BASE_URL_IMAGES + item.image,
          }}
          className="absolute top-0 left-0 right-0 bottom-0 h-52 w-48 opacity-50 rounded-3xl"
          resizeMode="cover"
        />
        {/* <Image
          source={require("@/assets/images/log-vector.png")}
          className="absolute -left-16 right-0 bottom-0 h-[112px] w-52 opacity-40 rounded-3xl"
          resizeMode="cover"
        /> */}
        <Text className="text-xl z-40 text-right font-vazirBold text-white">
          {item?.title?.length > 25
            ? item?.title.slice(0, 25) + "..."
            : item?.title}
        </Text>
        <HStack className="items-center justify-between">
          <Badge className="rounded-full">
            <BadgeText>{item?.duration} دقیقه</BadgeText>
          </Badge>
          {isLoading ? (
            <View
              style={{
                width: 48,
                height: 48,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#999",
                borderRadius: 34,
              }}
            >
              <Spinner color={"#fff"} />
            </View>
          ) : (
            <Pressable
              onPress={handlePlay}
              className={`rounded-full h-14 w-14 justify-center items-center ${colorSet.btn}`}
            >
              <Entypo name="controller-play" size={24} color="white" />
            </Pressable>
          )}
        </HStack>
      </VStack>
    </Pressable>
  );
};

export default CourseCard;
