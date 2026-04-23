import LottieView from "lottie-react-native";
import React, { useEffect } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "../ui/text";

// Assuming CloseIcon is from react-native-vector-icons or a similar library
import { toPersianDigits } from "@/utils/persian";
import { Ionicons } from "@expo/vector-icons"; // Example: Using Ionicons from expo-vector-icons
import { router } from "expo-router";
import { Button, ButtonText } from "../ui/button";

interface Props {
  showStreakModal: boolean;
  onClose: () => void;
  streakCount: number;
}

const StreakModal: React.FC<Props> = ({
  showStreakModal,
  onClose,
  streakCount,
}) => {
  const animationRef = React.useRef<LottieView>(null);

  // Close modal
  const handleClose = () => {
    onClose();
  };

  // Play animation when modal opens
  useEffect(() => {
    if (showStreakModal && animationRef.current) {
      animationRef.current.play();
    }
  }, [showStreakModal]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showStreakModal}
      onRequestClose={handleClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>

          <LottieView
            ref={animationRef}
            source={require("@/assets/animations/Seedling.json")}
            autoPlay={true}
            loop={true}
            style={styles.animation}
          />
          <Text className="mt-6 font-vazirBold">
            تبریک! یک روز دیگه با آرامش 🔥
          </Text>
          <Text className="my-3 font-sm font-vazir">
            {toPersianDigits(streakCount)} روز با جانارام 🌱
          </Text>
          <Button
            onPress={() => {
              handleClose();
              router.navigate("/train");
            }}
            className="mt-4"
          >
            <ButtonText>شروع </ButtonText>
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

export default StreakModal;
