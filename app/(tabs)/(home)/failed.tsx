import { Text } from "@/components/ui/text";
import { AntDesign } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";

function PaymentFailed() {
  const router = useRouter();
  const { type } = useLocalSearchParams<{ type?: string }>();
  const isAppointment = type === "appointment";

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
          fontFamily: "vazirBold",
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
          fontFamily: "vazir",
          lineHeight: 22,
        }}
      >
        {isAppointment
          ? "پرداخت نوبت انجام نشد. اگر مهلت پرداخت باقی مانده، از «نوبت‌های من» دوباره تلاش کنید."
          : "درخواست پرداخت شما با مشکل مواجه شد."}
      </Text>

      {isAppointment ? (
        <TouchableOpacity
          onPress={() => router.dismissTo("/(tabs)/appointments")}
          style={{
            backgroundColor: "#4CAF50",
            padding: 15,
            borderRadius: 10,
            marginTop: 30,
            width: "100%",
          }}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontWeight: "bold",
              fontFamily: "vazirBold",
            }}
          >
            نوبت‌های من
          </Text>
        </TouchableOpacity>
      ) : (
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
            style={{
              color: "white",
              textAlign: "center",
              fontWeight: "bold",
              fontFamily: "vazirBold",
            }}
          >
            بازگشت به صفحه اصلی
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default PaymentFailed;
