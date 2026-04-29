import { Spinner } from "@/components/ui/spinner";
import { useAudioPlayer } from "@/context/AudioPlayerContext";
import { usePro } from "@/hooks/usePro";
import { Entypo } from "@expo/vector-icons";
import React, { FC, useCallback, useState } from "react";
import { TouchableOpacity, View } from "react-native";
interface props {
  color: string;
  item: any;
}
const PlayButton: FC<props> = ({ color, item }) => {
  const [isLoading, setLoading] = useState(false);
  const { track, loadTrack, isPlaying } = useAudioPlayer();
  const isCurrentlyPlaying = track?.id === item.id && isPlaying;

  const { handleOpenNotProModal, isProActive, showInterstitial } = usePro();

  const handlePlay = useCallback(async () => {
    if (isLoading) return;
    setLoading(true);
    try {
      if (item.isPro && !isProActive) return handleOpenNotProModal();
      showInterstitial();
      await loadTrack(item.id);
    } finally {
      setLoading(false);
    }
  }, [
    item.id,
    item.isPro,
    isProActive,
    loadTrack,
    handleOpenNotProModal,
    showInterstitial,
    isLoading,
  ]);
  if (isLoading)
    return (
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: "rgba(255,255,255,0.2)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spinner color="#fff" size="small" />
      </View>
    );
  return (
    <TouchableOpacity
      onPress={handlePlay}
      activeOpacity={0.8}
      style={{
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
      }}
    >
      {isCurrentlyPlaying ? (
        <Entypo name="controller-paus" size={22} color={color} />
      ) : (
        <Entypo
          name="controller-play"
          size={24}
          color={color}
          style={{ marginLeft: 2 }}
        />
      )}
    </TouchableOpacity>
  );
};

export default PlayButton;
