import React from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

interface AboutModalProps {
  visible: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalContainer}>
          <Text style={styles.header}>درباره جان‌آرام</Text>
          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            <Text style={styles.text}>
              در شلوغی زندگی‌های امروزی، داشتن لحظه‌ای برای آرام‌سازی ذهن و شنیدن صدای درون، یک نیاز واقعی‌ست.{"\n\n"}
              <Text style={styles.bold}>جان‌آرام</Text> با هدف ایجاد فضایی برای آرامش ذهن، مراقبت از احساسات، و آگاهی از
              خود ساخته شده است.{"\n\n"}
              در این اپلیکیشن می‌تونی:{"\n"}• با مدیتیشن‌های کوتاه و کاربردی در دسته‌هایی مثل کاهش استرس، خواب آرام،
              خودپذیری، تمرکز ذهن و عشق به خود، ذهن‌تو آروم کنی.{"\n"}• با{" "}
              <Text style={styles.bold}>مود ترکینگ روزانه</Text>، حال و احساست رو ثبت کنی، نوسانات خلقی‌ت رو بهتر بشناسی
              و الگوهای روحی‌ت رو مرور کنی.{"\n\n"}
              جان‌آرام فقط یک اپلیکیشن نیست؛ یه همراه روزانه‌ست برای کمک به ذهنی سبک‌تر، دلی آروم‌تر و شناختی عمیق‌تر از
              خودت.{"\n\n"}
              <Text style={styles.medium}>لحظه‌ای برای خودت باش. با جان‌آرام.</Text>
            </Text>
          </ScrollView>
          <Pressable style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>باشه</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default AboutModal;
const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxHeight: "80%",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
    fontFamily: "vazirBold",
  },
  body: {
    marginBottom: 20,
  },
  text: {
    fontSize: 14,
    lineHeight: 28,
    textAlign: "right",
    fontFamily: "vazir",
  },
  bold: {
    fontFamily: "vazirBold",
  },
  medium: {
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#4A90E2",
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});
