import { useAudioPlayer } from "@/context/AudioPlayerContext";
import { BASE_URL_IMAGES } from "@/redux/api-slice";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HStack } from "../hstack";

export default function NowPlayingBar() {
  const { track, isPlaying, position, trackType, loadTrack, togglePlay, seek, stop } = useAudioPlayer();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  if (!track) return null;
  return (
    <View
      style={{
        position: "absolute",
        bottom: 60 + insets.bottom,
        left: 0,
        right: 0,
        backgroundColor: "#FFF",
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        zIndex: 100,
      }}
    >
      <Image source={{ uri: BASE_URL_IMAGES + track.image }} style={{ width: 48, height: 48, borderRadius: 8 }} />
      <Pressable
        onPress={() =>
          router.push({
            pathname: trackType === "meditation" ? "/player" : "/breathingPlayer",
            params: { id: track.id },
          })
        }
        style={{ flex: 1, marginLeft: 10 }}
      >
        <Text numberOfLines={1} style={{ color: "", fontSize: 12, fontFamily: "vazirBold" }}>
          {track.title}
        </Text>
        <Text numberOfLines={1} style={{ color: "#000", fontSize: 10, fontFamily: "vazir" }}>
          {track.description}
        </Text>
      </Pressable>
      <HStack space="md" className="items-center">
        <Pressable
          onPress={(e) => {
            togglePlay();
          }}
        >
          <Ionicons name={isPlaying ? "pause" : "play"} size={28} color="#000" />
        </Pressable>
        <Pressable
          onPress={(e) => {
            stop();
          }}
        >
          <Ionicons name="close" size={28} color="#000" />
        </Pressable>
      </HStack>
    </View>
  );
}
