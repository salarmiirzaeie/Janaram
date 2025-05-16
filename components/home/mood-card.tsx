import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, Text } from "react-native";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
} from "../ui/actionsheet";
import { Badge, BadgeText } from "../ui/badge";
import { Button, ButtonText } from "../ui/button";
import { HStack } from "../ui/hstack";
import { Pressable } from "../ui/pressable";
import { Textarea, TextareaInput } from "../ui/textarea";
import { VStack } from "../ui/vstack";
import MinimalChart from "./minimal-chart";
const moods = [
  { emoji: "😄", label: "خوشحال", value: 1 },
  { emoji: "😐", label: "معمولی", value: 2 },
  { emoji: "😞", label: "ناراحت", value: 3 },
  { emoji: "😡", label: "عصبانی", value: 4 },
  { emoji: "😴", label: "خسته", value: 5 },
  { emoji: "😟", label: "مظطرب", value: 6 },
];
const MoodCard = () => {
  const [mood, setMood] = useState(0);
  const [moodSheet, setMoodSheet] = useState(false);
  return (
    <>
      {!mood ? (
        <Pressable
          onPress={() => setMoodSheet(true)}
          className="w-60 h-60   py-4 rounded-full bg-blue-300 items-center justify-center"
        >
          <Feather name="smile" size={36} color="white" />
          <Text className="text-white mt-4 text-lg font-bold">
            امروز چه حسی داری؟
          </Text>
        </Pressable>
      ) : (
        <Pressable className="w-full h-70 rounded-3xl px-5 py-4 bg-blue-100">
          <HStack className="items-center">
            <Pressable onPress={() => setMoodSheet(true)}>
              <VStack space="sm" className="items-center">
                <Text className="text-4xl">😄</Text>
                <VStack>
                  <Text className="text-base font-bold text-gray-700">
                    شاد و پرانرژی
                  </Text>
                  <Text className="text-xs text-green-600">
                    +10٪ بهتر از دیروز
                  </Text>
                </VStack>
              </VStack>
            </Pressable>

            <VStack>
              <MinimalChart />
              <Text className="text-xs text-gray-400 mb-3 -mt-14 text-center font-semiBold">
                نوسان مود در هفته
              </Text>
              <Text className="text-sm text-gray-600 text-center italic">
                «به خودت افتخار کن، امروز با لبخند شروع شد.»
              </Text>
            </VStack>
          </HStack>
        </Pressable>
      )}
      <Actionsheet
        isOpen={moodSheet}
        closeOnOverlayClick={true}
        onClose={() => setMoodSheet(false)}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent className={"py-16 "}>
          <VStack
            space="lg"
            className="h-5/6 w-full  flex-grow justify-between items-center"
          >
            <Text className="text-2xl font-semiBold">
              مود امروزتو با یه ایموجی نشون بده
            </Text>
            <Badge className="rounded-full" size="lg">
              <BadgeText>۱۴۰۱/۱۲/۱۴</BadgeText>
            </Badge>
            <FlatList
              data={moods}
              keyExtractor={(item) => item.value.toString()}
              numColumns={3}
              className="w-full mt-8  flex-grow-0"
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => setMood(item.value)}
                  className={`h-28 flex-1 shadow shadow-md m-2 border ${
                    item.value === mood
                      ? "border-background-300"
                      : "border-transparent"
                  } 
                  ${
                    item.value === mood ? "bg-white" : "bg-background-100"
                  } border-background-100 rounded-3xl items-center justify-center`}
                >
                  <Text
                    style={{ fontSize: 60, fontWeight: "bold", lineHeight: 80 }}
                  >
                    {item.emoji}
                  </Text>
                </Pressable>
              )}
            />
            <VStack space="md" className="w-full">
              <HStack className="items-center justify-end">
                <Text className="text-black text-right text-sm font-medium">
                  {"(اختیاری)"}
                </Text>
                <Text className="text-black text-right text-lg font-semibold">
                  {"یادداشت "}
                </Text>
              </HStack>

              <Textarea
                size="md"
                isReadOnly={false}
                isInvalid={false}
                isDisabled={false}
                className="w-full bg-background-100 rounded-3xl border-0 p-4"
              >
                <TextareaInput placeholder="یادداشت امروزتو بنویس" />
              </Textarea>
            </VStack>
            <Button onPress={() => setMoodSheet(false)} className="w-full">
              <ButtonText>ذخیره</ButtonText>
            </Button>
          </VStack>
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
};

export default MoodCard;
