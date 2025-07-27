import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { useStartConversationMutation } from "@/services/ai/ai-adapter";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Define the type for a single message object
interface MessageType {
  role: "user" | "assistant";
  content: string;
}

// Define the props for the Message component
interface MessageProps {
  item: MessageType;
}

// A simple message component to display individual chat messages.
const Message: React.FC<MessageProps> = ({ item }) => {
  const isCurrentUser = item.role === "user";

  return (
    <View style={[styles.messageBubble, isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage]}>
      <Text style={isCurrentUser ? styles.currentUserText : styles.otherUserText}>{item.content}</Text>
    </View>
  );
};

// Create an Animated FlatList component
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<MessageType>);

// The main ChatScreen component
const ChatScreen: React.FC = () => {
  const initialMessage: MessageType = {
    role: "assistant",
    content:
      "سلام! من یک دستیار روانشناس هوش مصنوعی هستم. می‌تونم به شما در بیان و درک احساساتتون کمک کنم. امروز چه حسی دارید؟",
  };

  const [messages, setMessages] = useState<MessageType[]>([initialMessage]);
  const [input, setInput] = useState<string>("");
  const listRef = useRef<FlatList<MessageType>>(null);
  const [insets, setInset] = useState(0);
  const [showPremium, setShowPremium] = useState(false);
  const [startConversation, { isLoading, error, data, status }] = useStartConversationMutation();
  const scrollToEnd = () => {
    listRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    setTimeout(() => {
      scrollToEnd();
    }, 100);
  }, [messages]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", (e) => {
      setInset(80);
    });
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setInset(0);
      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: MessageType = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await startConversation({ message: userMessage.content }).unwrap();
      if (!response.success) {
        throw new Error(response.message || "خطای سرور");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.data?.response || "متأسفم، مشکلی در پاسخ‌دهی پیش آمد.",
        },
      ]);
    } catch (error: any) {
      if (error.status === 429) {
        setShowPremium(true);
        return;
      }
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: error.data?.message || "متأسفم، مشکلی در پردازش درخواست شما پیش آمد.",
        },
      ]);
    } finally {
      requestAnimationFrame(() => {
        listRef.current?.scrollToEnd({ animated: true });
      });
    }
  };

  const renderItem = ({ item }: { item: MessageType }) => <Message item={item} />;

  return (
    <SafeAreaProvider className="flex-1">
      <View className="p-safe" style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={insets}
        >
          <AnimatedFlatList
            ref={listRef}
            data={messages}
            keyExtractor={(_, idx) => idx.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.messagesContainer}
            onContentSizeChange={scrollToEnd}
            onLayout={scrollToEnd}
            showsVerticalScrollIndicator={false}
          />
          {showPremium && (
            <VStack className="p-4 m-4 bg-white rounded-2xl">
              <Text className="text-lg font-semiBold  text-right mb-4 text-gray-600">
                شما محدودیت روزانه ۱۰ گفت وگو را استفاده کردید با خرید اشتراک به صورت نامحدود مشاوره بگیرید
              </Text>
              <Button onPress={() => router.navigate("/(tabs)/setting/subscription")} className="bg-purple-600">
                <ButtonText>خرید اشتراک</ButtonText>
              </Button>
            </VStack>
          )}

          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#5D7AFF" />
              <Text style={styles.loadingText}>در حال پردازش...</Text>
            </View>
          )}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={input}
              onChangeText={setInput}
              placeholder="احساسات و افکار خود را اینجا بنویسید..."
              placeholderTextColor="#888"
              multiline
              returnKeyType="send"
              onSubmitEditing={handleSend}
              blurOnSubmit={false}
              autoFocus
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={isLoading || !input.trim()}>
              <Text style={styles.sendButtonText}>{isLoading ? "..." : "ارسال"}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messagesContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: "flex-end",
    flexGrow: 1,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 15,
    marginBottom: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  currentUserMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
  },
  otherUserMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#E5E5EA",
  },
  currentUserText: {
    color: "#FFFFFF",
  },
  otherUserText: {
    color: "#000000",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
    paddingBottom: 24,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
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
});

export default ChatScreen;
