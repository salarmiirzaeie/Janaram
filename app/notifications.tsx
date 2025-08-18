import React from "react";
import { FlatList } from "react-native";

import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Feather } from "@expo/vector-icons";

import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";

const notificationsData: any = [];

const Notifications = () => {
  const renderItem = ({ item }: { item: any }) => (
    <Pressable
      onPress={() => {}}
      className={"p-4 border border-b-1 mb-1 rounded-md border-gray-200" + (item.read ? " bg-gray-50" : " bg-blue-100")}
    >
      <HStack space="md" className="items-center justify-between">
        <HStack space="md" className="items-center">
          <Feather name={item.read ? "check-circle" : "bell"} size={20} color={item.read ? "#6c757d" : "#007bff"} />
          <VStack>
            <Text className="font-bold ">{item.title}</Text>
            <Text className="font-sm">{item.message}</Text>
          </VStack>
        </HStack>

        <Text className="text-gray-400 text-sm">{item.time}</Text>
      </HStack>
    </Pressable>
  );
  return (
    <VStack className="flex-1 bg-background-50 p-4 pb-8">
      <FlatList
        data={[...notificationsData].sort((a, b) => b.time.localeCompare(a.time))}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={() => <Text className="text-center text-gray-400">پیامی وجود ندارد </Text>}
      />

      {notificationsData.filter((n: any) => !n.read).length > 0 && (
        <Button onPress={() => {}} action="secondary">
          <ButtonText>Clear All</ButtonText>
          <ButtonIcon as={() => <Feather name="trash-2" size={16} color="white" />} />
        </Button>
      )}
    </VStack>
  );
};

export default Notifications;
