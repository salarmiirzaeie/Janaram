import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Divider } from "../ui/divider";
import { VStack } from "../ui/vstack";

export type MoodLog = {
  time: string;
  temperature: string;
  weather: string;
  mood: "احساسی" | "معمولی" | "افتضاح";
  note?: string;
};

const moodEmojis: Record<MoodLog["mood"], string> = {
  احساسی: "😊",
  معمولی: "😐",
  افتضاح: "😞",
};

export const MoodLogItem = ({
  log,
  isFirst,
  isLast,
}: {
  log: MoodLog;
  isFirst?: boolean;
  isLast?: boolean;
}) => {
  return (
    <View style={styles.container}>
      <VStack className="items-center ml-4 justify-center ">
        <Text style={styles.emoji}>{moodEmojis[log.mood]}</Text>

        <Divider
          className={`flex-1 ${isLast ? "bg-transparent" : ""}`}
          orientation="vertical"
        />
      </VStack>
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.time}>{log.time}</Text>
        </View>
        <Text style={styles.mood}>{log.mood}</Text>

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
