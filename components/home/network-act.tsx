import React from "react";
import { Image } from "react-native";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
} from "../ui/actionsheet";
import { Text } from "../ui/text";

const NetworkAct = () => {
  return (
    <Actionsheet snapPoints={[50]} isOpen={true}>
      <ActionsheetBackdrop />
      <ActionsheetContent className="py-10 px-6 justify-between rounded-t-3xl">
        <Text className="font-vazirBold text-xl"> متصل نبودن به اینترنت </Text>
        <Image
          className="w-56 h-52"
          source={require("@/assets/images/NotNetwork.png")}
        />
        <Text className="font-vazir text-right">
          به اینترنت متصل نیستید. برای استفاده از اپلیکیشن به اینترنت متصل شوید.
        </Text>
      </ActionsheetContent>
    </Actionsheet>
  );
};

export default NetworkAct;
