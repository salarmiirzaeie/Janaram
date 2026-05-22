import { Text } from "@/components/ui/text";
import { AntDesign } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";

function PaymentSuccess() {
  const router = useRouter();
  const { refId, type } = useLocalSearchParams<{
    refId?: string;
    type?: string;
  }>();

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
      <AntDesign name="check-circle" size={80} color="#4CAF50" />
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginTop: 20,
          textAlign: "center",
          fontFamily: "vazirBold",
        }}
      >
        پرداخت موفق
      </Text>
      {refId ? (
        <Text
          style={{
            fontSize: 16,
            color: "#666",
            marginTop: 10,
            textAlign: "center",
            fontFamily: "vazir",
          }}
        >
          شماره پیگیری: {refId}
        </Text>
      ) : null}
      <Text
        style={{
          textAlign: "center",
          marginTop: 16,
          color: "#9CA3AF",
          fontFamily: "vazir",
          lineHeight: 22,
        }}
      >
        {isAppointment
          ? "نوبت شما با موفقیت تأیید شد. جزئیات را در «نوبت‌های من» ببینید."
          : "پرداخت با موفقیت انجام شد."}
      </Text>

      <TouchableOpacity
        onPress={
          () =>
            // isAppointment
            router.push("/(tabs)/appointments")
          // : router.dismissTo("/")
        }
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
          {isAppointment ? "نوبت‌های من" : "بازگشت به خانه"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default PaymentSuccess;
