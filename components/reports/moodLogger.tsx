import { useGetMoodReportQuery } from "@/services/report/report-adapter";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "../ui/text";
import { MoodLogItem } from "./MoodLogItem";

export default function MoodLogger() {
  const { data, isLoading } = useGetMoodReportQuery({ page: 1, limit: 30 });

  const logs = data?.data || [];
  const sortedLogs = logs
    ?.filter((log) => log.mood !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scroll}>
        {sortedLogs && sortedLogs.length > 0 ? (
          sortedLogs.map((log, index) => (
            <MoodLogItem key={index} log={log} isFirst={index === 0} isLast={index === sortedLogs.length - 1} />
          ))
        ) : (
          <Text>هنوز حسی ثبت نشده</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#ffff",
    padding: 16,
    borderRadius: 24,
  },
  scroll: {
    marginTop: 16,
  },
});
