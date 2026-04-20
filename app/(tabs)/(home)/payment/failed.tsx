// app/payment/failed.tsx
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

function PaymentFailed() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <AntDesign name="close-circle" size={80} color="#f44336" />
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginTop: 20,
          textAlign: "center",
        }}
      >
        پرداخت ناموفق
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: "#666",
          marginTop: 10,
          textAlign: "center",
        }}
      >
        درخواست پرداخت شما با مشکل مواجه شد
      </Text>

      <TouchableOpacity
        onPress={() => router.push("/")}
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
          بازگشت به صفحه اصلی
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 10 }}>
        <Text style={{ color: "#4CAF50", textAlign: "center" }}>تلاش مجدد</Text>
      </TouchableOpacity>
    </View>
  );
}
export default PaymentFailed;
