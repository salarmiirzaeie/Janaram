import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { useGetChatHistoryQuery, useStartConversationMutation } from "@/services/ai/ai-adapter";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Define the type for a single message object (aligned with frontend display)
export interface MessageType {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

// Define the type for API message format
export interface ApiMessageType {
  user: string;
  ai: string;
  timestamp: Date;
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

// The main ChatScreen component
const ChatScreen: React.FC = () => {
  const initialMessage: MessageType = {
    role: "assistant",
    content:
      "سلام! من یک دستیار روانشناس هوش مصنوعی هستم. می‌تونم به شما در بیان و درک احساساتتون کمک کنم. امروز چه حسی دارید؟",
    timestamp: new Date(),
  };
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState<string>("");
  const listRef = useRef<FlatList<MessageType>>(null);
  const [insets, setInset] = useState(0);
  const [showPremium, setShowPremium] = useState(false);
  const [startConversation, { isLoading, error, data }] = useStartConversationMutation();
  const [page, setPage] = useState(1);
  const limit = 10; // Messages per page
  const {
    data: historyData,
    isFetching: isFetchingHistory,
    error: historyError,
  } = useGetChatHistoryQuery({ page, limit });
  const [hasMore, setHasMore] = useState(true);
  // Transform API messages to frontend MessageType
  const transformApiMessages = (apiMessages: ApiMessageType[]): MessageType[] => {
    return apiMessages.flatMap((msg) => [
      { role: "assistant", content: msg.ai, timestamp: msg.timestamp },

      { role: "user", content: msg.user, timestamp: msg.timestamp },
    ]);
  };

  // Scroll to the newest message (index 0 in inverted list)
  const scrollToBottom = () => {
    if (messages.length > 0) {
      listRef.current?.scrollToIndex({ index: 0, animated: true });
    }
  };

  // Handle new messages from startConversation
  useEffect(() => {
    if (data && data.success && data.data?.response) {
      setMessages((prev) => [
        {
          role: "assistant",
          content: data.data.response,
          timestamp: new Date(),
        },
        ...prev,
      ]);
      setShowPremium(false);
    } else if (error) {
      console.error("خطا در API:", error);
      let errorMessage = "متأسفم، مشکلی در پردازش درخواست شما پیش آمد.";
      if ("status" in error) {
        if (error.status === 429) {
          setShowPremium(true);
          errorMessage = "حداکثر تعداد گفت‌وگوهای روزانه برای طرح رایگان به پایان رسیده است.";
        } else if (error.status === 404) {
          errorMessage = "کاربر یافت نشد.";
        } else if (error.status === 400) {
          errorMessage = "درخواست نامعتبر است.";
        } else if (error.status === 502) {
          errorMessage = "درخواست به دلیل زمان‌بندی سرور هوش مصنوعی ناموفق بود. لطفاً دوباره تلاش کنید.";
        }
      }
      setMessages((prev) => [
        {
          role: "assistant",
          content: errorMessage,
          timestamp: new Date(),
        },
        ...prev,
      ]);
    }
    scrollToBottom();
  }, [data, error]);

  // Load initial history
  useEffect(() => {
    if (historyData?.success) {
      if (historyData.data.messages.length > 0) {
        const newMessages = transformApiMessages(historyData.data.messages).filter(
          (newMsg) => !messages.some((msg) => msg.content === newMsg.content && msg.role === newMsg.role)
        );
        setMessages((prev) => {
          if (page === 1) {
            return [...newMessages, ...prev];
          } else {
            return [...prev, ...newMessages];
          }
        });
        const totalPages = historyData.data.pagination.totalPages;
        setHasMore(page < totalPages);
        if (page === 1 && page < totalPages) {
          setPage(2);
        }
      } else if (page === 1 && messages.length === 0) {
        // Only set initial message if no history and no messages exist
        setMessages([initialMessage]);
        setHasMore(false);
      }
    } else if (historyError) {
      console.error("Error fetching history:", historyError);
      let errorMessage = "خطا در بارگذاری تاریخچه گفت‌وگو. لطفاً دوباره تلاش کنید.";
      if ("status" in historyError) {
        if (historyError.status === 404) {
          errorMessage = "کاربر یافت نشد.";
        } else if (historyError.status === 400) {
          errorMessage = "پارامترهای صفحه‌بندی نامعتبر هستند.";
        }
      }
      setMessages((prev) => [
        {
          role: "assistant",
          content: errorMessage,
          timestamp: new Date(),
        },
        ...prev,
      ]);
    }
    scrollToBottom();
  }, [historyData, historyError, page]);

  // Keyboard handling
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      setInset(80);
      scrollToBottom();
    });
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setInset(0);
      scrollToBottom();
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Load more history when scrolling to top
  const handleLoadMore = () => {
    if (!isFetchingHistory && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: MessageType = { role: "user", content: input.trim(), timestamp: new Date() };
    setMessages((prev) => [userMessage, ...prev]);
    setInput("");

    try {
      await startConversation({
        message: userMessage.content,
      }).unwrap();
    } catch (error) {
      // Error handling is managed in the useEffect for startConversation
    }
    scrollToBottom();
  };

  const renderItem = ({ item }: { item: MessageType }) => <Message item={item} />;

  return (
    <SafeAreaProvider className="flex-1">
      <View className="p-safe" style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={insets}
        >
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(_, idx) => idx.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.messagesContainer}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.1}
            showsVerticalScrollIndicator={false}
            inverted // Reverse the list to show newest messages at the bottom
            maintainVisibleContentPosition={{
              minIndexForVisible: 0,
              autoscrollToTopThreshold: 100,
            }}
            onScrollToIndexFailed={(info) => {
              setTimeout(() => {
                listRef.current?.scrollToIndex({ index: info.index, animated: true });
              }, 100);
            }}
            initialNumToRender={20}
            windowSize={5}
            maxToRenderPerBatch={5}
            removeClippedSubviews={Platform.OS === "android"}
            ListHeaderComponent={
              isFetchingHistory ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#5D7AFF" />
                  <Text style={styles.loadingText}>در حال بارگذاری تاریخچه...</Text>
                </View>
              ) : null
            }
          />
          {showPremium && (
            <VStack className="p-4 m-4 bg-white rounded-2xl">
              <Text className="text-lg font-semiBold text-right mb-4 text-gray-600">
                شما محدودیت روزانه ۱۰ گفت‌وگو را استفاده کردید. با خرید اشتراک به صورت نامحدود مشاوره بگیرید.
              </Text>
              <Button onPress={() => router.navigate("/subscription")} className="bg-purple-600">
                <ButtonText>خرید اشتراک</ButtonText>
              </Button>
            </VStack>
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
              <Text style={styles.sendButtonText}>{isLoading ? <ButtonSpinner color={"#fff"} /> : "ارسال"}</Text>
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
