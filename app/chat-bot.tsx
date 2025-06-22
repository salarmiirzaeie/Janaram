import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InferenceClient } from "@huggingface/inference";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const client = new InferenceClient(process.env.EXPO_PUBLIC_CHATBOT_KEY);

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AIPsychologistChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = React.useRef<ScrollView>(null);

  // پیام خوشامدگویی اولیه
  useEffect(() => {
    const welcomeMessage: Message = {
      role: "assistant",
      content:
        "سلام! من یک دستیار روانشناس هوش مصنوعی هستم. می‌تونم به شما در بیان و درک احساساتتون کمک کنم. امروز چه حسی دارید؟",
    };
    setMessages([welcomeMessage]);
  }, []);

  React.useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const prompt = `
      شما یک روانشناس حرفه‌ای هستید که به مراجعان خود کمک می‌کنید. 
      مراجع: "${input}"
      
      لطفاً با لحنی گرم، همدلانه و حرفه‌ای پاسخ دهید:
      - ابتدا احساسات مراجع را تایید کنید
      - سپس سوالات باز و تشویق‌کننده بپرسید
      - از قضاوت یا دادن راه‌حل فوری خودداری کنید
      - پاسخ شما باید بین 2 تا 4 جمله باشد
      `;

      const response = await client.chatCompletion({
        provider: "novita",
        model: "deepseek-ai/DeepSeek-V3-0324",
        messages: [
          {
            role: "system",
            content:
              "شما یک روانشناس حرفه‌ای با 20 سال سابقه کار هستید که به مراجعان در بیان و پردازش احساساتشان کمک می‌کنید. از تکنیک‌های درمانی شناختی-رفتاری و درمان متمرکز بر هیجان استفاده می‌کنید.",
          },
          ...newMessages.map((msg) => ({
            role: msg.role,
            content: msg.role === "user" ? msg.content : msg.content,
          })),
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      if (response?.choices?.[0]?.message?.content) {
        const aiMessage: Message = {
          role: "assistant",
          content: response.choices[0].message.content,
        };
        setMessages([...newMessages, aiMessage]);
      } else {
        throw new Error("پاسخ نامعتبر از سرور دریافت شد");
      }
    } catch (error: any) {
      console.error("API Error:", error);
      let errorMessage = "متأسفم، در پردازش درخواست شما مشکلی پیش آمد.";

      const aiMessage: Message = {
        role: "assistant",
        content: errorMessage + "\n\nاگر مایلید، می‌توانید دوباره احساسات خود را با من در میان بگذارید.",
      };
      setMessages([...newMessages, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 81}
    >
      <StatusBar barStyle="dark-content" backgroundColor={"#fff"} />
      <View style={styles.innerContainer}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.messagesContainer}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((msg, idx) => (
            <Card key={idx} style={[styles.messageCard, msg.role === "user" ? styles.userMessage : styles.aiMessage]}>
              <Text style={styles.messageText}>{msg.content}</Text>
            </Card>
          ))}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#5D7AFF" />
              <Text style={styles.loadingText}>در حال پردازش...</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="احساسات و افکار خود را اینجا بنویسید..."
            placeholderTextColor="#888"
            style={styles.textInput}
            onSubmitEditing={handleSend}
            multiline
            returnKeyType="send"
            blurOnSubmit={false}
          />
          <Button onPress={handleSend} style={styles.sendButton} disabled={isLoading}>
            <ButtonText style={styles.sendButtonText}>{isLoading ? "..." : "ارسال"}</ButtonText>
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFF",
  },
  innerContainer: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  messageCard: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    maxWidth: "85%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#E3EEFF",
    borderBottomRightRadius: 4,
  },
  aiMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EDF2F7",
    borderBottomLeftRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#1A202C",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginTop: 8,
  },
  loadingText: {
    marginLeft: 8,
    color: "#5D7AFF",
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderColor: "#EDF2F7",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    padding: 14,
    minHeight: 56,
    maxHeight: 150,
    textAlignVertical: "top",
    backgroundColor: "#F8FAFC",
    fontSize: 16,
    color: "#1A202C",
  },
  sendButton: {
    marginLeft: 12,
    alignSelf: "center",
    backgroundColor: "#5D7AFF",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sendButtonText: {
    color: "white",
    fontWeight: "500",
  },
});
