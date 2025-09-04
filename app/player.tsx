import { Slider, SliderFilledTrack, SliderThumb, SliderTrack } from "@/components/ui/slider";
import { Spinner } from "@/components/ui/spinner";
import { useAudioPlayer } from "@/context/AudioPlayerContext"; // <-- your context
import { BASE_URL_IMAGES } from "@/redux/api-slice";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function PlayerScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();
  console.log(id);
  const { track, isPlaying, position, duration, loadTrack, togglePlay, seek, isLoading } = useAudioPlayer();

  // Load the selected track when this screen is opened
  useEffect(() => {
    if (id) {
      loadTrack(id); // Only load once; it won't reload if it's already playing the same track
    }
  }, [id]);

  const formatMillis = (millis: number) => {
    const mins = Math.floor(millis / 60000);
    const secs = Math.floor((millis % 60000) / 1000);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (!id) {
    return <Text style={{ padding: 20 }}>Track not found</Text>;
  }

  return (
    <View className="p-safe flex-1 bg-white p-8 justify-center items-center">
      <Image source={{ uri: BASE_URL_IMAGES + track?.image }} style={styles.cover} />
      <Text style={styles.title}>{track?.title}</Text>
      <Text style={styles.artist}>{track?.description}</Text>

      <Slider size="md" value={position} minValue={0} maxValue={duration} onChange={seek} className="w-11/12">
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
          {isLoading ? (
            <View
              style={{
                width: 56,
                height: 56,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#4caf50",
                borderRadius: 34,
              }}
            >
              <Spinner color={"#fff"} />
            </View>
          ) : (
            <Ionicons
              name={isPlaying ? "pause-circle" : "play-circle"}
              size={68}
              color="#4caf50" // سبز آرامش‌بخش
            />
          )}
        </Pressable>
        <Ionicons name="play-skip-forward" size={32} color="#666" />
      </View>
    </View>
  );
}

// رنگ‌ها و فونت‌های جدیدتر برای حس آرامش
const styles = StyleSheet.create({
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
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
    fontFamily: "vazirBold", // یا custom فونت مثل "IRANSans"
    marginHorizontal: 20,
    textAlign: "center",
  },
  artist: {
    color: "#888",
    fontSize: 16,
    marginBottom: 40,
    textAlign: "center",
    marginHorizontal: 20,
    fontFamily: "vazir",
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
