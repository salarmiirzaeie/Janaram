import React from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

interface RulesModalProps {
  visible: boolean;
  onClose: () => void;
}

const RulesModal: React.FC<RulesModalProps> = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalContainer}>
          <Text style={styles.header}>قوانین و مقررات</Text>
          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            <Text style={styles.text}>
              استفاده شما از برنامه جان‌آرام به منزله‌ی پذیرش کامل شرایط زیر است:{"\n\n"}
              <Text style={styles.bold}>۱. هدف اپلیکیشن:</Text> جان‌آرام با هدف آرام‌سازی ذهن، مراقبت احساسی و افزایش
              آگاهی از خود طراحی شده است. این برنامه جایگزین مشاوره حرفه‌ای روان‌شناسی یا پزشکی نیست.{"\n\n"}
              <Text style={styles.bold}>۲. حفظ حریم خصوصی:</Text> اطلاعات شخصی شما نزد ما محرمانه باقی می‌ماند و بدون
              اجازه‌ی شما با هیچ نهادی به اشتراک گذاشته نمی‌شود.{"\n\n"}
              <Text style={styles.bold}>۳. نحوه استفاده:</Text> استفاده از زبان توهین‌آمیز، تهدیدآمیز یا رفتارهای
              غیرقانونی در گفتگو با چت‌بات ممنوع است. برنامه فقط برای استفاده شخصی طراحی شده است.{"\n\n"}
              <Text style={styles.bold}>۴. چت‌بات روان‌شناس:</Text> پاسخ‌هایی که از چت‌بات دریافت می‌کنید برای پشتیبانی
              ذهنی و روحی هستند و نباید به‌عنوان توصیه‌ی قطعی روان‌شناسی تلقی شوند.{"\n\n"}
              <Text style={styles.bold}>۵. تغییرات در مقررات:</Text> این قوانین ممکن است در آینده تغییر کنند. نسخه‌ی
              جدید در برنامه منتشر خواهد شد. ادامه استفاده به معنای پذیرش نسخه‌ی جدید است.{"\n\n"}
              <Text style={styles.bold}>۶. مالکیت محتوا:</Text> تمامی حقوق مادی و معنوی محتوای این برنامه، شامل فایل‌های
              صوتی، متون، طراحی‌ها و سایر عناصر بصری و شنیداری، متعلق به تیم "جان‌آرام" است. هرگونه کپی‌برداری، استفاده
              یا انتشار بدون اجازه‌ی کتبی، غیرمجاز است و پیگرد قانونی خواهد داشت.{"\n\n"}
              {"\n\n"}
              با نصب و استفاده از این برنامه، شما با شرایط بالا موافقت می‌کنید.{"\n"}
              <Text style={styles.medium}>ممنون از اعتمادت ❤️</Text>
            </Text>
          </ScrollView>
          <Pressable style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>متوجه شدم</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default RulesModal;

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
