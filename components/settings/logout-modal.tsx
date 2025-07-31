import useAuth from "@/hooks/useAuth";
import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

interface LogoutModalProps {
  visible: boolean;
  onClose: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ visible, onClose }) => {
  const { logOutUser } = useAuth();
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalContainer}>
          <Text style={styles.text}>آیا مطمئن هستید که می‌خواهید خارج شوید؟</Text>
          <Pressable style={styles.button} onPress={logOutUser}>
            <Text style={styles.buttonText}>بله</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutModal;
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
    marginBottom: 20,
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
