import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import axios from "axios";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";

export default function ChatWithAI() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = React.useRef<ScrollView>(null);
  const systemMessage = {
    role: "system",
    content:
      "تو یک روانشناس حرفه‌ای هستی که به زبان فارسی با کاربر صحبت می‌کنی و با همدلی به او کمک می‌کنی احساساتش را بشناسد و حال بهتری داشته باشد.",
  };
  React.useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama3-70b-8192",
          messages: [systemMessage, ...newMessages],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_CHATBOT_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const reply = res.data.choices[0].message.content;
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (error: any) {
      console.error(error.response?.data || error.message);
      setMessages([...newMessages, { role: "assistant", content: "❌ خطا در ارتباط با جان آرام" }]);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "white" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 81}
    >
      <StatusBar barStyle="dark-content" backgroundColor={"#fff"} />
      <View style={{ flex: 1 }}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
        >
          {messages.slice(1).map((msg, idx) => (
            <Card
              key={idx}
              className={`mb-2 p-2 ${msg.role === "user" ? "bg-primary-100 self-end" : "bg-gray-100 self-start"}`}
            >
              <Text>{msg.content}</Text>
            </Card>
          ))}
          {isLoading && <ActivityIndicator size="small" color="#999" style={{ marginTop: 10 }} />}
        </ScrollView>

        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 16,
            borderTopWidth: 1,
            borderColor: "#ddd",
            paddingBottom: 24,
            paddingTop: 16,
            backgroundColor: "white",
          }}
        >
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="احساست رو بنویس..."
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 12,
              padding: 10,
            }}
          />
          <Button onPress={handleSend} className="ml-2">
            <ButtonText>ارسال</ButtonText>
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
