import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { AntDesign, Feather } from "@expo/vector-icons";
import React, { useMemo } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
const createStyles = (CARD_WIDTH: number, SMALL_CARD_WIDTH: number) =>
  StyleSheet.create({
    storyCardGradient: {
      width: CARD_WIDTH,
      height: 220,
      borderRadius: 24,
      marginHorizontal: 8,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.1)",
    },
    mainHeaderGradient: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: "rgba(255,255,255,0.1)",
    },
    tipsGradient: {
      borderRadius: 24,
      padding: 20,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.1)",
    },
    skeletonStory: {
      width: CARD_WIDTH,
      height: 224,
      marginHorizontal: 8,
      borderRadius: 24,
      backgroundColor: "rgba(255,255,255,0.05)",
    },
    skeletonSmall: {
      width: SMALL_CARD_WIDTH,
      height: 208,
      marginHorizontal: 8,
      borderRadius: 24,
      backgroundColor: "rgba(255,255,255,0.05)",
    },
  });

// ========== کامپوننت مجزا برای هدر اصلی ==========
export const MainHeader = React.memo(
  ({
    onSearch,
    onBack,
    showIcons,
  }: {
    onSearch: () => void;
    onBack: () => void;
    showIcons?: boolean;
  }) => {
    const { width } = useWindowDimensions();
    const styles = useMemo(() => createStyles(width, 0), [width]);

    return (
      <LinearGradient
        colors={["#1a1a2e", "#16213e"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.mainHeaderGradient}
      >
        <HStack className="items-center justify-between">
          {showIcons ? (
            <TouchableOpacity
              onPress={() => {
                onSearch();
              }}
              className={`w-10 h-10 rounded-full bg-white/10 justify-center items-center`}
            >
              <Feather name="search" size={20} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={onBack}
              className={`w-10 h-10 rounded-full bg-white/10 justify-center items-center`}
            >
              <AntDesign name="left" size={20} color="white" />
            </TouchableOpacity>
          )}
          <HStack space="sm" className="items-center">
            <Feather name="moon" size={20} color="#79AED6" />
            <Text className="text-white font-vazirBold text-lg">خواب آرام</Text>
          </HStack>
          <TouchableOpacity
            onPress={onBack}
            className="w-10 h-10 rounded-full bg-transparent justify-center items-center"
          >
            <View className="w-6 h-6" />
          </TouchableOpacity>
        </HStack>
      </LinearGradient>
    );
  }
);
