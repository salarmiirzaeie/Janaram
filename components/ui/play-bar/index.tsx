import { useAudioPlayer } from "@/context/AudioPlayerContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { HStack } from "../hstack";

export default function NowPlayingBar() {
  const { track, isPlaying, position, duration, loadTrack, togglePlay, seek, stop } = useAudioPlayer();
  const router = useRouter();

  if (!track) return null;
  console.log(track);
  return (
    <View
      style={{
        position: "absolute",
        bottom: 75,
        left: 0,
        right: 0,
        backgroundColor: "#FFF",
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        zIndex: 100,
      }}
    >
      <Image source={{ uri: track.image }} style={{ width: 48, height: 48, borderRadius: 8 }} />
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/player",
            params: { id: track.id, title: track.title, artist: track.artist, image: track.image },
          })
        }
        style={{ flex: 1, marginLeft: 10 }}
      >
        <Text numberOfLines={1} style={{ color: "", fontSize: 12, fontFamily: "vazirBold" }}>
          {track.title}
        </Text>
        <Text numberOfLines={1} style={{ color: "#000", fontSize: 10, fontFamily: "vazir" }}>
          {track.artist}
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
