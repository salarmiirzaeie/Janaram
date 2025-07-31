import { useCustomToast } from "@/hooks/useToast";
import { useGetChatHistoryQuery } from "@/services/ai/ai-adapter";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ChatHistoryItem {
  conversationId: string;
  createdAt: Date;
  updatedAt: Date;
  messages: { role: "user" | "assistant"; content: string; timestamp: Date }[];
}

const ChatHistory = () => {
  const [page, setPage] = useState(1);
  const [selectedConversation, setSelectedConversation] = useState<ChatHistoryItem | null>(null);
  const limit = 10;
  const toast = useCustomToast();
  const { data, error, isLoading, refetch } = useGetChatHistoryQuery({ page, limit });

  const handleLoadMore = () => {
    if (data?.data) {
      if (data?.data?.page < data?.data?.totalPages) {
        setPage((prev) => prev + 1);
      }
    }
  };

  const handleSelectConversation = (conversation: ChatHistoryItem) => {
    setSelectedConversation(conversation);
  };

  const closeModal = () => {
    setSelectedConversation(null);
  };

  if (isLoading && page === 1) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    Alert.alert("خطا", (error as any)?.data?.message || "خطایی در دریافت تاریخچه گفت‌وگو رخ داد");
    router.back();
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          {(error as any)?.data?.message || "خطایی در دریافت تاریخچه گفت‌وگو رخ داد"}
        </Text>
        <Button title="تلاش مجدد" onPress={refetch} />
      </View>
    );
  }

  if (!data?.success || !data.data?.conversations.length) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noHistoryText}>هیچ گفت‌وگویی یافت نشد</Text>
      </View>
    );
  }

  const renderConversationItem = ({ item }: { item: ChatHistoryItem }) => {
    const lastMessage = item.messages[item.messages.length - 1];
    const preview = lastMessage?.content.slice(0, 50) + (lastMessage?.content.length > 50 ? "..." : "");

    return (
      <TouchableOpacity style={styles.conversationItem} onPress={() => handleSelectConversation(item)}>
        <Text style={styles.conversationTitle}>گفت‌وگو {item.conversationId.slice(0, 8)}...</Text>
        <Text style={styles.conversationDate}>
          {new Date(item.updatedAt).toLocaleDateString("fa-IR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
        <Text style={styles.conversationPreview}>
          {lastMessage ? `${lastMessage.role === "user" ? "شما: " : "دستیار: "}${preview}` : "بدون پیام"}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data.data.conversations}
        keyExtractor={(item) => item.conversationId}
        renderItem={renderConversationItem}
        ListFooterComponent={
          data.data.page < data.data.totalPages ? (
            <Button title="بارگذاری بیشتر" onPress={handleLoadMore} disabled={isLoading} />
          ) : null
        }
        style={styles.conversationList}
      />

      <Modal visible={!!selectedConversation} animationType="slide" onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>گفت‌وگو {selectedConversation?.conversationId.slice(0, 8)}...</Text>
          <FlatList
            data={selectedConversation?.messages || []}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View
                style={[styles.messageContainer, item.role === "user" ? styles.userMessage : styles.assistantMessage]}
              >
                <Text style={styles.messageContent}>
                  {item.role === "user" ? "شما: " : "دستیار: "}
                  {item.content}
                </Text>
                <Text style={styles.messageTimestamp}>
                  {new Date(item.timestamp).toLocaleTimeString("fa-IR")} -{" "}
                  {new Date(item.timestamp).toLocaleDateString("fa-IR")}
                </Text>
              </View>
            )}
            style={styles.messageList}
          />
          <Button title="بستن" onPress={closeModal} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 15, textAlign: "right" },
  conversationList: { flex: 1 },
  conversationItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 10,
  },
  conversationTitle: { fontSize: 16, fontWeight: "bold", textAlign: "right" },
  conversationDate: { fontSize: 14, color: "#666", textAlign: "right" },
  conversationPreview: { fontSize: 14, color: "#333", textAlign: "right", marginTop: 5 },
  errorText: { fontSize: 16, color: "red", textAlign: "center", marginBottom: 10 },
  noHistoryText: { fontSize: 16, textAlign: "center" },
  modalContainer: { flex: 1, padding: 20, backgroundColor: "#fff" },
  modalHeader: { fontSize: 18, fontWeight: "bold", marginBottom: 15, textAlign: "right" },
  messageList: { flex: 1 },
  messageContainer: { padding: 10, marginVertical: 5, borderRadius: 8 },
  userMessage: { backgroundColor: "#DCF8C6", alignSelf: "flex-end", maxWidth: "80%" },
  assistantMessage: { backgroundColor: "#ECECEC", alignSelf: "flex-start", maxWidth: "80%" },
  messageContent: { fontSize: 14, textAlign: "right" },
  messageTimestamp: { fontSize: 12, color: "#666", marginTop: 5, textAlign: "right" },
});

export default ChatHistory;
