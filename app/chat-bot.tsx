import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { resetNotificationCount } from "@/redux/notifications/notifications-slice";
import {
  useGetChatHistoryQuery,
  useStartConversationMutation,
} from "@/services/ai/ai-adapter";
import { Ionicons } from "@expo/vector-icons";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import LinearGradient from "react-native-linear-gradient";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

// ========== Types ==========
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

// ========== Constants ==========
const INITIAL_MESSAGE: MessageType = {
  role: "assistant",
  content:
    "سلام! من یک دستیار روانشناس هوش مصنوعی هستم. می‌تونم به شما در بیان و درک احساساتتون کمک کنم. امروز چه حسی دارید؟",
  timestamp: new Date(),
};

const LIMIT = 10;

// ========== Message Component ==========
const Message = React.memo(({ item }: { item: MessageType }) => {
  const isCurrentUser = item.role === "user";

  return (
    <View
      style={[
        styles.messageBubble,
        isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          isCurrentUser ? styles.currentUserText : styles.otherUserText,
        ]}
      >
        {item.content}
      </Text>
    </View>
  );
});

Message.displayName = "Message";

// ========== Premium Banner Component ==========
const PremiumBanner = React.memo(({ onPress }: { onPress: () => void }) => (
  <LinearGradient
    colors={["#FFF3E0", "#FFE0B2"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.premiumBanner}
  >
    <VStack space="sm">
      <Text className="text-right font-vazirBold text-base text-accent-600">
        ⚡ محدودیت روزانه به پایان رسید
      </Text>
      <Text className="text-right font-vazir text-sm text-accent-500">
        شما محدودیت روزانه ۱۰ گفت‌وگو را استفاده کردید. با خرید اشتراک به صورت
        نامحدود مشاوره بگیرید.
      </Text>
      <Button onPress={onPress} className="bg-primary-500 mt-2 rounded-full">
        <ButtonText className="text-white font-vazirBold">
          🚀 خرید اشتراک Pro
        </ButtonText>
      </Button>
    </VStack>
  </LinearGradient>
));

PremiumBanner.displayName = "PremiumBanner";

// ========== Send Button Component ==========
const SendButton = React.memo(
  ({
    onPress,
    isLoading,
    disabled,
  }: {
    onPress: () => void;
    isLoading: boolean;
    disabled: boolean;
  }) => (
    <TouchableOpacity
      style={[styles.sendButton, disabled && styles.sendButtonDisabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ButtonSpinner color="#79AED6" />
      ) : (
        <LinearGradient
          colors={disabled ? ["#D3DBE5", "#BDC9D8"] : ["#79AED6", "#9966CC"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.sendGradient}
        >
          <Ionicons name="send" size={20} color="white" />
        </LinearGradient>
      )}
    </TouchableOpacity>
  )
);

SendButton.displayName = "SendButton";

const ChatScreen: React.FC = () => {
  const initialMessage: MessageType = {
    role: "assistant",
    content:
      "سلام! من یک دستیار روانشناس هوش مصنوعی هستم. می‌تونم به شما در بیان و درک احساساتتون کمک کنم. امروز چه حسی دارید؟",
    timestamp: new Date(),
  };

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState<string>("");
  const flatListRef = useRef<KeyboardAwareFlatList | null>(null);
  const [showPremium, setShowPremium] = useState(false);
  const [startConversation, { isLoading, error, data }] =
    useStartConversationMutation();
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const limit = 10;
  const {
    data: historyData,
    isFetching: isFetchingHistory,
    error: historyError,
  } = useGetChatHistoryQuery({ page, limit });
  const [hasMore, setHasMore] = useState(true);
  const insets = useSafeAreaInsets();

  const transformApiMessages = (apiMessages: ApiMessageType[]): MessageType[] =>
    apiMessages.flatMap((msg) => [
      { role: "assistant", content: msg.ai, timestamp: msg.timestamp },
      { role: "user", content: msg.user, timestamp: msg.timestamp },
    ]);

  const scrollToBottom = () => {
    if (messages.length > 0) flatListRef.current?.scrollToFocusedInput;
  };

  useEffect(() => {
    dispatch(resetNotificationCount());
  }, []);

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
      let errorMessage = "متأسفم، مشکلی در پردازش درخواست شما پیش آمد.";
      if ("status" in error) {
        if (error.status === 429) {
          setShowPremium(true);
          errorMessage =
            "حداکثر تعداد گفت‌وگوهای روزانه برای طرح رایگان به پایان رسیده است.";
        } else if (error.status === 404) errorMessage = "کاربر یافت نشد.";
        else if (error.status === 400) errorMessage = "درخواست نامعتبر است.";
        else if (error.status === 502)
          errorMessage =
            "درخواست به دلیل زمان‌بندی سرور هوش مصنوعی ناموفق بود. لطفاً دوباره تلاش کنید.";
      }
      setMessages((prev) => [
        { role: "assistant", content: errorMessage, timestamp: new Date() },
        ...prev,
      ]);
    }
    scrollToBottom();
  }, [data, error]);

  useEffect(() => {
    if (historyData?.success) {
      if (historyData.data.messages.length > 0) {
        const newMessages = transformApiMessages(
          historyData.data.messages
        ).filter(
          (newMsg) =>
            !messages.some(
              (msg) =>
                msg.content === newMsg.content && msg.role === newMsg.role
            )
        );
        setMessages((prev) =>
          page === 1 ? [...newMessages, ...prev] : [...prev, ...newMessages]
        );
        const totalPages = historyData.data.pagination.totalPages;
        setHasMore(page < totalPages);
        if (page === 1 && page < totalPages) setPage(2);
      } else if (page === 1 && messages.length === 0)
        setMessages([initialMessage]);
    } else if (historyError) {
      let errorMessage =
        "خطا در بارگذاری تاریخچه گفت‌وگو. لطفاً دوباره تلاش کنید.";
      if ("status" in historyError) {
        if (historyError.status === 404) errorMessage = "کاربر یافت نشد.";
        else if (historyError.status === 400)
          errorMessage = "پارامترهای صفحه‌بندی نامعتبر هستند.";
      }
      setMessages((prev) => [
        { role: "assistant", content: errorMessage, timestamp: new Date() },
        ...prev,
      ]);
    }
    scrollToBottom();
  }, [historyData, historyError, page]);

  const handleLoadMore = () => {
    if (!isFetchingHistory && hasMore) setPage((prev) => prev + 1);
  };

  const isSendDisabled = useMemo(() => {
    return isLoading || !input.trim();
  }, [isLoading, input]);

  const keyExtractor = useCallback(
    (_: MessageType, idx: number) => idx.toString(),
    []
  );
  const handleUpgradePress = useCallback(() => {
    dispatch({
      type: "initialize/setIsFirstModalShow",
      payload: true,
    });
  }, [dispatch]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage: MessageType = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [userMessage, ...prev]);
    setInput("");
    try {
      await startConversation({ message: userMessage.content }).unwrap();
    } catch {}
    scrollToBottom();
  };

  const renderItem = ({ item }: { item: MessageType }) => (
    <Message item={item} />
  );

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <LinearGradient
        colors={["#F0F6FA", "#FFFFFF", "#F5F0FA"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 80}
        >
          <KeyboardAwareFlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: insets.bottom + 80 },
            ]}
            extraScrollHeight={120}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.1}
            showsVerticalScrollIndicator={false}
            inverted
            keyboardShouldPersistTaps="handled"
          />

          {showPremium && <PremiumBanner onPress={handleUpgradePress} />}

          {/* Input Section */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={input}
              onChangeText={setInput}
              placeholder="احساسات و افکار خود را اینجا بنویسید..."
              placeholderTextColor="#91A5BE"
              multiline
              returnKeyType="send"
              onSubmitEditing={handleSend}
              blurOnSubmit={false}
            />

            <SendButton
              onPress={handleSend}
              isLoading={isLoading}
              disabled={isSendDisabled}
            />
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  gradient: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 15,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 20,
    marginBottom: 12,
  },
  currentUserMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#79AED6",
    borderBottomRightRadius: 4,
  },
  otherUserMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#E9EDF2",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  currentUserText: {
    color: "#FFFFFF",
    fontFamily: "vazirBold",
  },
  otherUserText: {
    color: "#336180",
    fontFamily: "vazir",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E9EDF2",
    backgroundColor: "#FFFFFF",
    gap: 12,
  },
  textInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#214760",
    backgroundColor: "#F5F7FA",
    textAlignVertical: "top",
    fontFamily: "vazir",
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  premiumBanner: {
    margin: 16,
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#FFE0B2",
    shadowColor: "#FF9966",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});

export default ChatScreen;
