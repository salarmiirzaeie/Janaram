import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { MoodLog, MoodLogItem } from "./MoodLogItem";

const logs: MoodLog[] = [
  {
    time: "۹:۰۶ شب",
    temperature: "۱۷° سانتی‌گراد",
    weather: "ابری",
    mood: "احساسی",
    note: "شام با مارشال پایان خوبی برای روزم بود.",
  },
  {
    time: "۵:۱۵ عصر",
    temperature: "۲۶° سانتی‌گراد",
    weather: "آفتابی و ابری",
    mood: "معمولی",
  },
  {
    time: "۲:۱۶ ظهر",
    temperature: "۲۹° سانتی‌گراد",
    weather: "ابری",
    mood: "افتضاح",
    note: "رئیسم گفت برای جمعه فهرست دستاورد‌هام رو بنویسم و واقعاً هیچ‌چی ندارم!",
  },
];

export default function MoodLogger() {
  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scroll}>
        {logs.map((log, index) => (
          <MoodLogItem
            key={index}
            log={log}
            isFirst={index === 0}
            isLast={index === logs.length - 1}
          />
        ))}
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
