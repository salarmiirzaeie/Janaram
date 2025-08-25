import { IMood } from "@/redux/mood/mood-slice";
import { getEmojiFromMood, getLabelFromMood } from "@/utils/mood";
import { format as formatJalali } from "date-fns-jalali";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Divider } from "../ui/divider";
import { VStack } from "../ui/vstack";

export const MoodLogItem = ({ log, isFirst, isLast }: { log: IMood; isFirst?: boolean; isLast?: boolean }) => {
  return (
    <View style={styles.container}>
      <VStack className="items-center ml-4 justify-center ">
        <Image source={getEmojiFromMood(log.mood || 2)} resizeMode="cover" className="h-12 w-12" />

        <Divider className={`flex-1 ${isLast ? "bg-transparent" : ""}`} orientation="vertical" />
      </VStack>
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.time}>{formatJalali(log.date, "yyyy/MM/dd")}</Text>
        </View>
        <Text style={styles.mood}>{getLabelFromMood(log.mood || 2)}</Text>

        <Text style={styles.note}>{log.note}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  emoji: {
    fontSize: 28,
  },
  content: {
    flex: 1,
    paddingBottom: 24,
  },
  row: {
    flexDirection: "row-reverse",
    gap: 8,
  },
  time: {
    color: "#ccc",
    fontSize: 12,
  },
  meta: {
    color: "#aaa",
    fontSize: 12,
  },
  mood: {
    color: "gray",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "right",
  },
  note: {
    color: "#ccc",
    textAlign: "right",
    fontSize: 18,
  },
  addLog: {
    color: "#888",
    fontStyle: "italic",
    textAlign: "right",
  },
});
