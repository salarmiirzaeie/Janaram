import { Slider, SliderFilledTrack, SliderThumb, SliderTrack } from "@/components/ui/slider";
import { Spinner } from "@/components/ui/spinner";
import { useAudioPlayer } from "@/context/AudioPlayerContext";
import { BASE_URL_IMAGES } from "@/redux/api-slice";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function PlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { track, isPlaying, position, duration, loadTrack, togglePlay, seek, isLoading } = useAudioPlayer();

  useEffect(() => {
    if (id) {
      loadTrack(id);
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
      {isLoading || !track ? (
        // Skeleton Loading State
        <>
          <View style={styles.skeletonCover} />
          <View style={styles.skeletonTitle} />
          <View style={styles.skeletonDesc} />
          <View style={styles.skeletonSlider} />
          <View style={styles.skeletonTimeRow}>
            <View style={styles.skeletonTime} />
            <View style={styles.skeletonTime} />
          </View>
          <View style={styles.skeletonControls} />
        </>
      ) : (
        // Real Content
        <>
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
                <Ionicons name={isPlaying ? "pause-circle" : "play-circle"} size={68} color="#4caf50" />
              )}
            </Pressable>
            <Ionicons name="play-skip-forward" size={32} color="#666" />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
    fontFamily: "vazirBold",
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

  // Skeleton styles
  skeletonCover: {
    width: 220,
    height: 220,
    borderRadius: 110,
    marginBottom: 30,
    backgroundColor: "#e0e0e0",
  },
  skeletonTitle: {
    width: "60%",
    height: 20,
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
    marginBottom: 12,
  },
  skeletonDesc: {
    width: "80%",
    height: 16,
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
    marginBottom: 30,
  },
  skeletonSlider: {
    width: "90%",
    height: 6,
    borderRadius: 4,
    backgroundColor: "#e0e0e0",
    marginBottom: 16,
  },
  skeletonTimeRow: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 20,
  },
  skeletonTime: {
    width: 40,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
  },
  skeletonControls: {
    width: "70%",
    height: 68,
    borderRadius: 34,
    backgroundColor: "#e0e0e0",
    marginTop: 40,
  },
});
