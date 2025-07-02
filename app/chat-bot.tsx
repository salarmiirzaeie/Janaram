import { Button, ButtonText } from "@/components/ui/button";
import { InferenceClient } from "@huggingface/inference";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const client = new InferenceClient(process.env.EXPO_PUBLIC_CHATBOT_KEY);

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const initialMessage = {
  role: "assistant",
  content:
    "سلام! من یک دستیار روانشناس هوش مصنوعی هستم. می‌تونم به شما در بیان و درک احساساتتون کمک کنم. امروز چه حسی دارید؟",
};

export default function AIPsychologistChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([initialMessage]);
  const [isLoading, setIsLoading] = useState(false);
  const listRef = React.useRef<FlatList>(null);

  const insets = useSafeAreaInsets();

  const scrollToEnd = () => {
    listRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    scrollToEnd();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("https://router.huggingface.co/novita/v3/openai/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_CHATBOT_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider: "novita",
          model: "deepseek/deepseek-v3-0324",
          messages: [{ role: "user", content: `به عنوان یک روانشناسی به این متن پاسخ بده:${userMessage.content}` }],
        }),
      });

      const data = await response.json();

      const content = data?.choices?.[0]?.message?.content;

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: content || "متأسفم، مشکلی در پاسخ‌دهی پیش آمد. لطفاً دوباره تلاش کنید.",
        },
      ]);
    } catch (error) {
      console.error("API Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "متأسفم، مشکلی در پردازش درخواست شما پیش آمد.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <Animated.View
      entering={FadeInUp.duration(300)}
      style={[styles.messageCard, item.role === "user" ? styles.userMessage : styles.aiMessage]}
    >
      <Text style={styles.messageText}>{item.content}</Text>
    </Animated.View>
  );

  return (
    <View style={[styles.innerContainer, { paddingBottom: insets.bottom }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "android" ? undefined : "padding"}
        keyboardVerticalOffset={insets.bottom}
      >
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <AnimatedFlatList
          ref={listRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(_, idx) => idx.toString()}
          contentContainerStyle={styles.messagesContainer}
          onContentSizeChange={scrollToEnd}
          showsVerticalScrollIndicator={false}
        />
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#5D7AFF" />
            <Text style={styles.loadingText}>در حال پردازش...</Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="احساسات و افکار خود را اینجا بنویسید..."
            placeholderTextColor="#888"
            style={styles.textInput}
            multiline
            returnKeyType="send"
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
          />
          <Button onPress={handleSend} style={styles.sendButton} disabled={isLoading}>
            <ButtonText style={styles.sendButtonText}>{isLoading ? "..." : "ارسال"}</ButtonText>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
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
    justifyContent: "center",
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
