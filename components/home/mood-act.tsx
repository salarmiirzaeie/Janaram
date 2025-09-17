import { useSetMoodMutation } from "@/services/mood/mood-adapter";
import { moods } from "@/utils/mood";
import { format as formatJalali } from "date-fns-jalali";
import React, { useState } from "react";
import { FlatList, Image, KeyboardAvoidingView, Platform, Pressable, Text } from "react-native";
import { Actionsheet, ActionsheetBackdrop, ActionsheetContent } from "../ui/actionsheet";
import { Badge, BadgeText } from "../ui/badge";
import { Button, ButtonSpinner, ButtonText } from "../ui/button";
import { HStack } from "../ui/hstack";
import { Textarea, TextareaInput } from "../ui/textarea";
import { VStack } from "../ui/vstack";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  handleStreakModal: () => void;
}

const MoodAct: React.FC<Props> = ({ isOpen, onClose, handleStreakModal }) => {
  const [setMood, { isLoading }] = useSetMoodMutation();
  const [moodState, setMoodState] = useState(0);
  const [note, setNote] = useState("");

  const handleSave = () => {
    setMood({ mood: moodState, note })
      .unwrap()
      .then((res) => {
        onClose();
        if (res.data.isTodayFirstMood) {
          handleStreakModal();
        }
      });
  };

  return (
    <Actionsheet isOpen={isOpen} closeOnOverlayClick onClose={onClose}>
      <ActionsheetBackdrop />
      <KeyboardAvoidingView
        behavior={isOpen ? (Platform.OS === "ios" ? "padding" : "height") : undefined}
        className="w-full"
        keyboardVerticalOffset={0}
      >
        <ActionsheetContent className="py-12  px-5">
          <VStack space="lg" className="w-full flex-grow justify-between items-center">
            {/* Title */}
            <Text className="text-2xl font-vazirBold text-primary-800 text-center">
              حس امروزتو با یه ایموجی نشون بده
            </Text>

            {/* Date Badge */}
            <Badge className="rounded-full bg-calm-100">
              <BadgeText className="text-calm-500">{formatJalali(new Date(), "yyyy/MM/dd")}</BadgeText>
            </Badge>

            {/* Mood Options */}
            <FlatList
              data={moods}
              keyExtractor={(item) => item.value.toString()}
              numColumns={3}
              className="w-full flex-grow-0 mt-4"
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => setMoodState(item.value)}
                  className={`flex-1 m-2 h-28 rounded-3xl items-center justify-between py-3  border-2
                    ${
                      item.value === moodState ? "border-primary-500 bg-white" : "border-transparent bg-background-100"
                    }`}
                >
                  <Image source={item.emoji} resizeMode="contain" className="h-4/6 w-3/6" />
                  <Text className="font-vazirBold text-primary-800 mt-1">{item.label}</Text>
                </Pressable>
              )}
            />

            {/* Note Input */}
            <VStack space="md" className="w-full mt-4">
              <HStack className="items-center justify-end mb-1">
                <Text className="text-sm font-vazir text-primary-600">(اختیاری)</Text>
                <Text className="text-2xl font-vazirBold text-primary-800 ml-2">یادداشت</Text>
              </HStack>
              <Textarea size="md" className="w-full bg-accent-100 rounded-3xl border-0 p-4">
                <TextareaInput
                  value={note}
                  className="text-right font-vazir text-primary-800"
                  onChangeText={(text) => setNote(text)}
                  placeholder="یادداشت امروزتو بنویس"
                  placeholderTextColor="#999"
                />
              </Textarea>
            </VStack>

            {/* Save Button */}
            <Button onPress={handleSave} disabled={isLoading} className="w-full bg-primary-500 rounded-xl mt-4">
              {isLoading && <ButtonSpinner color="white" />}
              <ButtonText className="text-white font-vazirBold">{isLoading ? "در حال ذخیره..." : "ذخیره"}</ButtonText>
            </Button>
          </VStack>
        </ActionsheetContent>
      </KeyboardAvoidingView>
    </Actionsheet>
  );
};

export default MoodAct;
