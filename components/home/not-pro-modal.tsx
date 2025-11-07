import { useAppSelector } from "@/hooks/useAppSelector";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import React from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import { Button, ButtonText } from "../ui/button";
import { Text } from "../ui/text";
interface Props {
  showStreakModal: boolean;
  onClose: () => void;
}
const NotProModal: React.FC<Props> = ({ showStreakModal, onClose }) => {
  const animationRef = React.useRef<LottieView>(null);
  const dispatch = useDispatch();
  const { message } = useAppSelector((state) => state.pro);
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showStreakModal}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>

          <LottieView
            ref={animationRef}
            source={require("@/assets/animations/pro.json")}
            autoPlay={true}
            loop={true}
            style={styles.animation}
          />
          <Text className="font-vazir text-center mb-4">{message}</Text>
          <Button
            onPress={() => {
              onClose();
              dispatch({
                type: "initialize/setIsFirstModalShow",
                payload: true,
              });
            }}
            className="bg-primary-500"
          >
            <ButtonText className="text-white">فعالسازی Pro</ButtonText>
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark background for modal
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
    position: "relative", // Ensure positioning context for absolute children
  },
  animation: {
    width: 200,
    height: 200,
  },
  closeButton: {
    position: "absolute",
    top: 10, // Reduced from top-20 (80px) to top: 10px
    right: 10, // Reduced from right-20 (80px) to right: 10px
    zIndex: 10, // Ensure the button is above other content
  },
});
export default NotProModal;
