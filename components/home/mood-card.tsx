import { useAppSelector } from "@/hooks/useAppSelector";
import { setMood } from "@/redux/mood/mood-slice";
import { getEmojiFromMood, getLabelFromMood, moods } from "@/utils/mood";
import { Feather } from "@expo/vector-icons";
import { format, subDays } from "date-fns";
import { format as formatJalali } from "date-fns-jalali";
import React, { useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, Text } from "react-native";
import { useDispatch } from "react-redux";
import { Actionsheet, ActionsheetBackdrop, ActionsheetContent } from "../ui/actionsheet";
import { Badge, BadgeText } from "../ui/badge";
import { Button, ButtonText } from "../ui/button";
import { HStack } from "../ui/hstack";
import { Pressable } from "../ui/pressable";
import { Textarea, TextareaInput } from "../ui/textarea";
import { VStack } from "../ui/vstack";
import MinimalChart from "./minimal-chart";

const MoodCard = () => {
  const [moodState, setMoodState] = useState(0);
  const [moodSheet, setMoodSheet] = useState(false);
  const dispatch = useDispatch();
  const today = format(new Date(), "yyyy-MM-dd");
  const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");
  const moodData = useAppSelector((state) => state.mood.find((m) => m.date === today));
  const [note, setNote] = useState(moodData?.note || "");

  const moodDataForYesterday = useAppSelector((state) => state.mood.find((m) => m.date === yesterday));
  const yesterdayMood = moodDataForYesterday?.mood ?? 0;
  const mood = moodData?.mood ?? 0;

  const handleSave = () => {
    const today = new Date();
    const formatted = format(today, "yyyy-MM-dd");
    dispatch(setMood({ date: formatted, mood: moodState, note }));
    setMoodSheet(false);
  };

  return (
    <>
      {!mood ? (
        <Pressable
          onPress={() => setMoodSheet(true)}
          className="w-60 h-60   py-4 rounded-full bg-blue-300 items-center justify-center"
        >
          <Feather name="smile" size={36} color="white" />
          <Text className="text-white mt-4 text-lg font-semiBold">امروز چه حسی داری؟</Text>
        </Pressable>
      ) : (
        <Pressable onPress={() => setMoodSheet(true)} className="w-full h-60 rounded-3xl px-5 py-4 bg-blue-100">
          <HStack className="items-center">
            <VStack space="sm" className="items-center">
              <Text className="text-sm color-gray-400 font-body">مود امروز</Text>
              <Text className="text-4xl">{getEmojiFromMood(mood)}</Text>
              <VStack>
                <Text className="text-center  font-semiBold text-gray-700">{getLabelFromMood(mood)}</Text>
                {yesterdayMood < mood ? (
                  <Text className="text-xs font-medium text-green-600">بهتر از دیروز +</Text>
                ) : (
                  <Text className="text-xs font-medium text-red-600">بدتر از دیروز -</Text>
                )}
              </VStack>
            </VStack>

            <VStack className="flex-1">
              <MinimalChart />
            </VStack>
          </HStack>
        </Pressable>
      )}
      <Actionsheet
        isOpen={moodSheet}
        closeOnOverlayClick={true}
        onClose={() => {
          setMoodSheet(false);
          setMoodState(0);
        }}
      >
        <ActionsheetBackdrop />
        <KeyboardAvoidingView
          behavior={moodSheet ? (Platform.OS === "ios" ? "padding" : "height") : undefined}
          className="w-full"
        >
          <ActionsheetContent className={"py-14 "}>
            <VStack space="lg" className=" w-full  flex-grow justify-between items-center">
              <Text className="text-2xl font-semiBold">مود امروزتو با یه ایموجی نشون بده</Text>
              <Badge className="rounded-full" size="lg">
                <BadgeText>{formatJalali(new Date(), "yyyy/MM/dd")}</BadgeText>
              </Badge>
              <FlatList
                data={moods}
                keyExtractor={(item) => item.value.toString()}
                numColumns={3}
                className="w-full   flex-grow-0"
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => setMoodState(item.value)}
                    className={`h-28 flex-1  shadow-md m-2 border ${
                      item.value === moodState ? "border-background-300" : "border-transparent"
                    } 
                  ${
                    moodState
                      ? item.value === moodState
                        ? "bg-white"
                        : "bg-background-100"
                      : mood === item.value
                      ? "bg-white"
                      : "bg-background-100"
                  } border-background-100 rounded-3xl items-center justify-center`}
                  >
                    <Text style={{ fontSize: 50, fontWeight: "bold", lineHeight: 80 }}>{item.emoji}</Text>
                    <Text style={{ fontSize: 14, fontWeight: "bold", lineHeight: 20, marginBottom: 10 }}>
                      {item.label}
                    </Text>
                  </Pressable>
                )}
              />
              <VStack space="md" className="w-full">
                <HStack className="items-center justify-end">
                  <Text className="text-black text-right text-sm font-medium">{"(اختیاری)"}</Text>
                  <Text className="text-black text-right text-lg font-semibold">{"یادداشت "}</Text>
                </HStack>

                <Textarea
                  size="md"
                  isReadOnly={false}
                  isInvalid={false}
                  isDisabled={false}
                  className="w-full bg-background-100 rounded-3xl border-0 p-4"
                >
                  <TextareaInput
                    value={note}
                    className="text-right"
                    onChangeText={(text) => setNote(text)}
                    placeholder="یادداشت امروزتو بنویس"
                  />
                </Textarea>
              </VStack>
              <Button onPress={handleSave} className="w-full">
                <ButtonText>ذخیره</ButtonText>
              </Button>
            </VStack>
          </ActionsheetContent>
        </KeyboardAvoidingView>
      </Actionsheet>
    </>
  );
};

export default MoodCard;
