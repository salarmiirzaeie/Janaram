import {
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@/components/ui/slider";
import { useAudioPlayer } from "@/context/AudioPlayerContext"; // <-- your context
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

const tracks = {
  "1": {
    id: "1",
    title: "Track 1",
    artist: "Artist A",
    file: require("@/assets/audio/1.mp3"),
    image: require("@/assets/images/med.png"),
  },
};

export default function PlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const track = tracks[id as keyof typeof tracks];
  const {
    track: currentTrack,
    isPlaying,
    position,
    duration,
    loadTrack,
    togglePlay,
    seek,
  } = useAudioPlayer();

  // Load the selected track when this screen is opened
  useEffect(() => {
    if (track) {
      loadTrack(track); // Only load once; it won't reload if it's already playing the same track
    }
  }, [id]);

  const formatMillis = (millis: number) => {
    const mins = Math.floor(millis / 60000);
    const secs = Math.floor((millis % 60000) / 1000);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (!track) {
    return <Text style={{ padding: 20 }}>Track not found</Text>;
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Ionicons name="chevron-back" size={28} color="#555" />
      </Pressable>

      <Image source={track.image} style={styles.cover} />

      <Text style={styles.title}>{track.title}</Text>
      <Text style={styles.artist}>{track.artist}</Text>

      <Slider
        size="md"
        value={position}
        minValue={0}
        maxValue={duration}
        onChange={seek}
        className="w-11/12"
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>

      <View style={styles.timeRow}>
        <Text style={styles.time}>{formatMillis(position)}</Text>
        <Text style={styles.time}>{formatMillis(duration)}</Text>
      </View>

      <View style={styles.controls}>
        <Ionicons name="play-skip-back" size={32} color="#666" />
        <Pressable onPress={togglePlay}>
          <Ionicons
            name={isPlaying ? "pause-circle" : "play-circle"}
            size={68}
            color="#4caf50" // سبز آرامش‌بخش
          />
        </Pressable>
        <Ionicons name="play-skip-forward" size={32} color="#666" />
      </View>
    </View>
  );
}

// رنگ‌ها و فونت‌های جدیدتر برای حس آرامش
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f5f2", // زمینه‌ی روشن و آرام
    alignItems: "center",
    paddingTop: 60,
    justifyContent: "center",
  },
  backBtn: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  cover: {
    width: 220,
    height: 220,
    borderRadius: 110,
    marginBottom: 30,
    borderWidth: 2,
    borderColor: "#dcdcdc",
  },
  title: {
    color: "#2e2e2e",
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 4,
    fontFamily: "System", // یا custom فونت مثل "IRANSans"
  },
  artist: {
    color: "#888",
    fontSize: 16,
    marginBottom: 40,
  },
  timeRow: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  time: {
    color: "#aaa",
    fontSize: 13,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "70%",
    alignItems: "center",
    marginTop: 40,
  },
});
