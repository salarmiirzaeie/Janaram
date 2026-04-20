import { useSetMoodMutation } from "@/services/mood/mood-adapter";
import { moods } from "@/utils/mood";
import { format as formatJalali } from "date-fns-jalali";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
} from "react-native";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
} from "../ui/actionsheet";
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
        behavior={
          isOpen ? (Platform.OS === "ios" ? "padding" : "height") : undefined
        }
        className="w-full"
        keyboardVerticalOffset={0}
      >
        <ActionsheetContent className="px-5 pb-8 pt-4">
          <VStack
            space="lg"
            className="w-full flex-grow justify-between items-center"
          >
            {/* Title */}
            <Text className="text-2xl font-vazirBold text-primary-800 text-center">
              حس امروزتو با یه ایموجی نشون بده
            </Text>

            {/* Date Badge - Using your color palette */}
            <Badge className="rounded-full bg-primary-100">
              <BadgeText className="text-primary-600">
                {formatJalali(new Date(), "yyyy/MM/dd")}
              </BadgeText>
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
                  className={`flex-1 m-2 h-28 rounded-3xl items-center justify-between py-3 border-2
                    ${
                      item.value === moodState
                        ? "border-primary-500 bg-white"
                        : "border-primary-100 bg-primary-50"
                    }`}
                >
                  <Image
                    source={item.emoji}
                    resizeMode="contain"
                    className="h-4/6 w-3/6"
                  />
                  <Text
                    className={`font-vazirBold text-sm mt-1 ${
                      item.value === moodState
                        ? "text-primary-700"
                        : "text-primary-500"
                    }`}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              )}
            />

            {/* Note Input */}
            <VStack space="md" className="w-full mt-4">
              <HStack className="items-center justify-end mb-1">
                <Text className="text-sm font-vazir text-tertiary-500">
                  (اختیاری)
                </Text>
                <Text className="text-lg font-vazirBold text-primary-800 ml-2">
                  یادداشت
                </Text>
              </HStack>
              <Textarea
                size="md"
                className="w-full bg-primary-50 rounded-3xl border-0 p-4"
              >
                <TextareaInput
                  value={note}
                  className="text-right font-vazir text-primary-700"
                  onChangeText={(text) => setNote(text)}
                  placeholder="یادداشت امروزتو بنویس"
                  placeholderTextColor="#91A5BE"
                />
              </Textarea>
            </VStack>

            {/* Save Button */}
            <Button
              onPress={handleSave}
              disabled={isLoading || moodState === 0}
              className={`w-full rounded-xl mt-4 ${
                moodState === 0 ? "bg-tertiary-400" : "bg-primary-500"
              }`}
            >
              {isLoading && <ButtonSpinner color="white" />}
              <ButtonText className="text-white font-vazirBold">
                {isLoading ? "در حال ذخیره..." : "ذخیره"}
              </ButtonText>
            </Button>
          </VStack>
        </ActionsheetContent>
      </KeyboardAvoidingView>
    </Actionsheet>
  );
};

export default MoodAct;
