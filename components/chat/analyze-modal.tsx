import { useCustomToast } from "@/hooks/useToast";
import { useAnalyzePersonalityMutation } from "@/services/ai/ai-adapter";
import React, { useEffect } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface AboutModalProps {
  visible: boolean;
  onClose: () => void;
}

const AnalyzeModal: React.FC<AboutModalProps> = ({ visible, onClose }) => {
  const [analyzeResult, setAnalyzeResult] = React.useState<string>("");
  const [analyze, { isLoading }] = useAnalyzePersonalityMutation();
  const toast = useCustomToast();
  useEffect(() => {
    if (visible) {
      analyze({})
        .unwrap()
        .then((res) => {
          setAnalyzeResult(res.data.analysis);
        })
        .catch((e) => {
          onClose();
          toast.show({
            type: "error",
            msg: e?.data?.message || "خطایی رخ داده است",
          });
        });
    }
  }, [visible]);
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.modalContainer}>
          <Text style={styles.header}>تحلیل شخصیت من </Text>
          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {isLoading ? (
              <Text style={styles.text}>در حال تحلیل...</Text>
            ) : (
              <Text style={styles.text}>{analyzeResult}</Text>
            )}
          </ScrollView>
          <Pressable style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>باشه</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default AnalyzeModal;
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
