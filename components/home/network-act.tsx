import React from "react";
import { DevSettings, Image } from "react-native";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
} from "../ui/actionsheet";
import { Button, ButtonText } from "../ui/button";
import { Text } from "../ui/text";

const NetworkAct = () => {
  return (
    <Actionsheet className="" snapPoints={[50]} isOpen={true}>
      <ActionsheetBackdrop />
      <ActionsheetContent className="py-10 px-6 justify-around rounded-t-3xl">
        <Text className="font-vazirBold text-xl"> متصل نبودن به اینترنت </Text>
        <Image
          className="w-56 h-52"
          source={require("@/assets/images/NotNetwork.png")}
        />
        <Text className="font-vazir text-right">
          به اینترنت متصل نیستید. برای استفاده از اپلیکیشن به اینترنت متصل شوید.
        </Text>
        <Button
          onPress={() => {
            DevSettings.reload();
          }}
          className="w-full"
        >
          <ButtonText>تلاش دوباره</ButtonText>
        </Button>
      </ActionsheetContent>
    </Actionsheet>
  );
};

export default NetworkAct;
