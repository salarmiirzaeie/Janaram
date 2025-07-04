import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView, // Still needed for loading indicator
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, useAnimatedStyle, withTiming } from "react-native-reanimated";

// Define the type for a single message object
interface MessageType {
  role: "user" | "assistant"; // Role can be 'user' or 'assistant'
  content: string; // Message content
}

// Define the props for the Message component
interface MessageProps {
  item: MessageType; // Changed from 'message' to 'item' to match FlatList renderItem signature
}

// A simple message component to display individual chat messages.
// It includes basic styling and a Reanimated layout animation for entry.
const Message: React.FC<MessageProps> = ({ item }) => {
  // Determine if the message is from the current user based on the role
  const isCurrentUser = item.role === "user";

  // useAnimatedStyle for subtle fade/slide on initial render (if not using layout animations)
  // Keeping it here for potential future use or if layout animations are disabled.
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(1, { duration: 300 }),
      transform: [{ translateY: withTiming(0, { duration: 300 }) }],
    };
  });

  return (
    // Apply layout animation directly to the message bubble for entry
    <Animated.View
      // `entering` is a Reanimated layout animation that defines how the component
      // animates when it is first mounted into the view hierarchy.
      entering={FadeIn.duration(300).delay(50)} // Reverted to original FadeIn
      style={[
        styles.messageBubble, // Reverted to original messageBubble style
        isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
        animatedStyle, // Apply the animated style for any dynamic changes
      ]}
    >
      <Text style={isCurrentUser ? styles.currentUserText : styles.otherUserText}>{item.content}</Text>
    </Animated.View>
  );
};

// Create an Animated FlatList component for better performance with animations
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<MessageType>);

// The main ChatScreen component that orchestrates the chat interface.
const App: React.FC = () => {
  // Initial message from the AI assistant
  const initialMessage: MessageType = {
    role: "assistant",
    content:
      "سلام! من یک دستیار روانشناس هوش مصنوعی هستم. می‌تونم به شما در بیان و درک احساساتتون کمک کنم. امروز چه حسی دارید؟",
  };

  // State to hold the list of messages in the chat.
  const [messages, setMessages] = useState<MessageType[]>([initialMessage]);
  // State to hold the text currently being typed in the input field.
  const [input, setInput] = useState<string>("");
  // State to manage loading indicator during API calls.
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Ref to access the FlatList component, primarily for scrolling to the end.
  const listRef = useRef<FlatList<MessageType>>(null);

  // Hook to get safe area insets for correct UI positioning, especially on notched devices.
  const [insets, setInset] = useState(0);

  // Function to scroll the FlatList to the end.
  const scrollToEnd = () => {
    listRef.current?.scrollToEnd({ animated: true });
  };

  // Effect to scroll to the end whenever new messages are added.
  useEffect(() => {
    setTimeout(() => {
      scrollToEnd();
    }, 100);
  }, [messages]);

  // Effect to manage keyboard listeners.
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", (e) => {
      setInset(80);
      // You could use `e.endCoordinates.height` here for custom animations.
    });
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      // When keyboard hides, ensure FlatList scrolls to the very end.
      // A small timeout might be necessary to allow layout to settle.
      setInset(0);
      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 100); // Small delay to allow layout to settle
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Function to handle sending a message and calling the AI API.
  const handleSend = async () => {
    if (!input.trim()) return; // Do not send empty messages

    const userMessage: MessageType = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages); // Optimistically add user message to UI
    setInput(""); // Clear input field
    setIsLoading(true); // Show loading indicator

    try {
      // API call to Hugging Face router for chatbot response
      const response = await fetch("https://router.huggingface.co/novita/v3/openai/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_CHATBOT_KEY}`, // Placeholder for API key
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider: "novita",
          model: "deepseek/deepseek-v3-0324",
          // Prompt the AI to act as a psychologist
          messages: [
            { role: "user", content: `به عنوان یک روانشناسی در دو جمله به این متن پاسخ بده:${userMessage.content}` },
          ],
        }),
      });

      const data = await response.json();

      const content = data?.choices?.[0]?.message?.content;

      // Add AI's response to messages
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: content || "متأسفم، مشکلی در پاسخ‌دهی پیش آمد. لطفاً دوباره تلاش کنید.",
        },
      ]);
    } catch (error) {
      console.error("API Error:", error);
      // Add an error message if API call fails
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "متأسفم، مشکلی در پردازش درخواست شما پیش آمد.",
        },
      ]);
    } finally {
      setIsLoading(false); // Hide loading indicator
      // Ensure scroll to end after response/error
      requestAnimationFrame(() => {
        listRef.current?.scrollToEnd({ animated: true });
      });
    }
  };

  // Render function for each message item in the FlatList
  const renderItem = ({ item }: { item: MessageType }) => <Message item={item} />;

  return (
    <SafeAreaView style={styles.container}>
      {/* StatusBar for styling the device's status bar */}
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={insets} // Use safe area inset for offset
      >
        <AnimatedFlatList
          ref={listRef}
          data={messages}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.messagesContainer} // Reverted to original messagesContainer
          onContentSizeChange={scrollToEnd}
          onLayout={scrollToEnd} // Keep onLayout for initial scroll/layout changes
          showsVerticalScrollIndicator={false} // Hide scroll indicator
        />

        {/* Loading indicator displayed when AI is processing */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#5D7AFF" />
            <Text style={styles.loadingText}>در حال پردازش...</Text>
          </View>
        )}

        <View
          style={styles.inputContainer} // Reverted to original inputContainer
        >
          <TextInput
            style={styles.textInput} // Reverted to original textInput
            value={input}
            onChangeText={setInput}
            placeholder="احساسات و افکار خود را اینجا بنویسید..." // Updated placeholder
            placeholderTextColor="#888"
            multiline
            returnKeyType="send"
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
            autoFocus
          />
          <TouchableOpacity
            style={styles.sendButton} // Reverted to original sendButton
            onPress={handleSend}
            disabled={isLoading || !input.trim()}
          >
            <Text style={styles.sendButtonText}>{isLoading ? "..." : "ارسال"}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
    justifyContent: "flex-end", // Align messages to the bottom
    flexGrow: 1, // Allow content to grow and push input to bottom
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 15,
    marginBottom: 8,
    elevation: 1, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  currentUserMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF", // iOS Blue
  },
  otherUserMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#E5E5EA", // iOS Gray
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
    maxHeight: 120, // Limit height for multiline input
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
  // Styles for loading indicator (kept from AI integration)
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

export default App;
