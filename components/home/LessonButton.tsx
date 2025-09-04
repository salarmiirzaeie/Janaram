import React, { FC } from "react";

import { FlexAlignType, View } from "react-native";
import { Button, ButtonIcon } from "../ui/button";
import { CheckIcon } from "../ui/icon";
import { VStack } from "../ui/vstack";
import CircularProgressBar from "./CircularProgress";
interface ILessonButton {
  onPress: () => void;
  alignSelf: FlexAlignType;
  status: "complete" | "incomplete" | "progress";
  icon?: any;
}

const LessonButton: FC<ILessonButton> = ({ onPress, alignSelf, status, icon }) => {
  return (
    <View className={`w-full `} style={{ alignItems: alignSelf }}>
      {status === "progress" ? (
        <CircularProgressBar progress={0.7} color={"#6740F6"} bgColor="lightgray" stroke={5}>
          <VStack className="rounded-full items-center w-16 h-16 bg-background-100">
            <Button onPress={onPress} className="bg-primary-500 rounded-full w-12 h-12" size="lg">
              <ButtonIcon color="white" size="xl" as={icon} />
            </Button>
          </VStack>
        </CircularProgressBar>
      ) : (
        <VStack
          className={
            "rounded-full items-center w-16 h-16" + status === "complete"
              ? "bg-yellow-200"
              : status === "incomplete"
              ? "bg-gray-200"
              : "bg-gray-500"
          }
        >
          <Button
            onPress={onPress}
            className={
              " rounded-full w-12 h-12" + status === "complete"
                ? "bg-yellow-200"
                : status === "incomplete"
                ? "bg-gray-200"
                : "bg-gray-500"
            }
            size="lg"
          >
            <ButtonIcon color="white" size="xl" as={status === "complete" ? CheckIcon : icon} />
          </Button>
        </VStack>
      )}
    </View>
  );
};

export default LessonButton;
