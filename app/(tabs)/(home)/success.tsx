// app/payment/success.tsx
import { Text } from "@/components/ui/text";
import { AntDesign } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";

function PaymentSuccess() {
  const router = useRouter();
  const { refId } = useLocalSearchParams();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <AntDesign name="check-circle" size={80} color="#4CAF50" />
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginTop: 20,
          textAlign: "center",
        }}
      >
        پرداخت موفق
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: "#666",
          marginTop: 10,
          textAlign: "center",
        }}
      >
        شماره پیگیری: {refId}
      </Text>
      <Text className="text-center mt-4 text-gray-400">
        نوبت شما با موفقیت تایید شد. روانشناس محترم در زمان تعیین شده با شما
        تماس خواهد گرفت
      </Text>

      <TouchableOpacity
        onPress={() => router.dismissTo("/my-appointments")}
        style={{
          backgroundColor: "#4CAF50",
          padding: 15,
          borderRadius: 10,
          marginTop: 30,
          width: "100%",
        }}
      >
        <Text
          style={{ color: "white", textAlign: "center", fontWeight: "bold" }}
        >
          لیست نوبت های من
        </Text>
      </TouchableOpacity>
    </View>
  );
}
export default PaymentSuccess;
