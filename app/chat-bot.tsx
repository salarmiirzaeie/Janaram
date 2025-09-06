import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { useGetChatHistoryQuery, useStartConversationMutation } from "@/services/ai/ai-adapter";
import React, { useEffect, useRef, useState } from "react";
import {
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
import { useDispatch } from "react-redux";

export interface MessageType {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

export interface ApiMessageType {
  user: string;
  ai: string;
  timestamp: Date;
}

interface MessageProps {
  item: MessageType;
}

const Message: React.FC<MessageProps> = ({ item }) => {
  const isCurrentUser = item.role === "user";
  return (
    <View style={[styles.messageBubble, isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage]}>
      <Text
        style={[
          isCurrentUser ? styles.currentUserText : styles.otherUserText,
          { fontFamily: isCurrentUser ? "vazirBold" : "vazir" },
        ]}
      >
        {item.content}
      </Text>
    </View>
  );
};

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
  const dispatch = useDispatch();
  const limit = 10;
  const {
    data: historyData,
    isFetching: isFetchingHistory,
    error: historyError,
  } = useGetChatHistoryQuery({ page, limit });
  const [hasMore, setHasMore] = useState(true);

  const transformApiMessages = (apiMessages: ApiMessageType[]): MessageType[] =>
    apiMessages.flatMap((msg) => [
      { role: "assistant", content: msg.ai, timestamp: msg.timestamp },
      { role: "user", content: msg.user, timestamp: msg.timestamp },
    ]);

  const scrollToBottom = () => {
    if (messages.length > 0) listRef.current?.scrollToIndex({ index: 0, animated: true });
  };

  useEffect(() => {
    if (data && data.success && data.data?.response) {
      setMessages((prev) => [{ role: "assistant", content: data.data.response, timestamp: new Date() }, ...prev]);
      setShowPremium(false);
    } else if (error) {
      let errorMessage = "متأسفم، مشکلی در پردازش درخواست شما پیش آمد.";
      if ("status" in error) {
        if (error.status === 429) {
          setShowPremium(true);
          errorMessage = "حداکثر تعداد گفت‌وگوهای روزانه برای طرح رایگان به پایان رسیده است.";
        } else if (error.status === 404) errorMessage = "کاربر یافت نشد.";
        else if (error.status === 400) errorMessage = "درخواست نامعتبر است.";
        else if (error.status === 502)
          errorMessage = "درخواست به دلیل زمان‌بندی سرور هوش مصنوعی ناموفق بود. لطفاً دوباره تلاش کنید.";
      }
      setMessages((prev) => [{ role: "assistant", content: errorMessage, timestamp: new Date() }, ...prev]);
    }
    scrollToBottom();
  }, [data, error]);

  useEffect(() => {
    if (historyData?.success) {
      if (historyData.data.messages.length > 0) {
        const newMessages = transformApiMessages(historyData.data.messages).filter(
          (newMsg) => !messages.some((msg) => msg.content === newMsg.content && msg.role === newMsg.role)
        );
        setMessages((prev) => (page === 1 ? [...newMessages, ...prev] : [...prev, ...newMessages]));
        const totalPages = historyData.data.pagination.totalPages;
        setHasMore(page < totalPages);
        if (page === 1 && page < totalPages) setPage(2);
      } else if (page === 1 && messages.length === 0) setMessages([initialMessage]);
    } else if (historyError) {
      let errorMessage = "خطا در بارگذاری تاریخچه گفت‌وگو. لطفاً دوباره تلاش کنید.";
      if ("status" in historyError) {
        if (historyError.status === 404) errorMessage = "کاربر یافت نشد.";
        else if (historyError.status === 400) errorMessage = "پارامترهای صفحه‌بندی نامعتبر هستند.";
      }
      setMessages((prev) => [{ role: "assistant", content: errorMessage, timestamp: new Date() }, ...prev]);
    }
    scrollToBottom();
  }, [historyData, historyError, page]);

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

  const handleLoadMore = () => {
    if (!isFetchingHistory && hasMore) setPage((prev) => prev + 1);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage: MessageType = { role: "user", content: input.trim(), timestamp: new Date() };
    setMessages((prev) => [userMessage, ...prev]);
    setInput("");
    try {
      await startConversation({ message: userMessage.content }).unwrap();
    } catch {}
    scrollToBottom();
  };

  const renderItem = ({ item }: { item: MessageType }) => <Message item={item} />;

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: "#fff" /* calm-100 */ }}>
      <View style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
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
            inverted
            initialNumToRender={20}
            windowSize={5}
          />
          {showPremium && (
            <VStack className="p-4 m-4 bg-accent-200 rounded-2xl">
              <Text className="text-lg font-vazirBold text-right text-accent-500 mb-4">
                شما محدودیت روزانه ۱۰ گفت‌وگو را استفاده کردید. با خرید اشتراک به صورت نامحدود مشاوره بگیرید.
              </Text>
              <Button
                onPress={() =>
                  dispatch({
                    type: "initialize/setIsFirstModalShow",
                    payload: true,
                  })
                }
                className="bg-primary-500"
              >
                <ButtonText className="text-white">خرید اشتراک</ButtonText>
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
              {isLoading ? <ButtonSpinner color="#fff" /> : <Text style={styles.sendButtonText}>ارسال</Text>}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  messagesContainer: { paddingVertical: 10, paddingHorizontal: 15, flexGrow: 1, justifyContent: "flex-end" },
  messageBubble: { maxWidth: "80%", padding: 10, borderRadius: 15, marginBottom: 8 },
  currentUserMessage: { alignSelf: "flex-end", backgroundColor: "#47A9DA" }, // primary-500
  otherUserMessage: { alignSelf: "flex-start", backgroundColor: "#C8E6C9" }, // calm-200
  currentUserText: { color: "#FFFFFF" },
  otherUserText: { color: "#388E3C" }, // calm-500
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#A5D6A7",
    backgroundColor: "#FFFFFF",
    paddingBottom: 10,
  }, // بدون رنگ اضافی
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
    color: "#000000",
  }, // بدون رنگ پالت
  sendButton: {
    backgroundColor: "#47A9DA",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  }, // primary-500
  sendButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600", fontFamily: "vazirBold" },
});

export default ChatScreen;
