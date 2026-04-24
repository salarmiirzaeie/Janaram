import React from "react";
import { Linking } from "react-native";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "../ui/actionsheet";
import { Button, ButtonText } from "../ui/button";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
interface Props {
  showActionsheet: boolean;
  handleClose: () => void;
}
const UpdateModal: React.FC<Props> = ({ showActionsheet, handleClose }) => {
  return (
    <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        <VStack space="lg" className="p-4 items-center justify-center">
          <VStack className="space-y-2">
            <Text className="text-lg font-vazirBold text-center">
              بروزرسانی جدید موجود است{" "}
            </Text>
            <Text className="text-sm text-gray-500">
              لطفا برای استفاده از اپلیکیشن جدید، بروزرسانی را انجام دهید
            </Text>
          </VStack>
          <HStack className="space-x-2 justify-center">
            <Button
              onPress={handleClose}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              <Text>انصراف</Text>
            </Button>
            <Button
              onPress={() =>
                Linking.openURL(
                  "https://cafebazaar.ir/app/com.salarmiirzapour.Janaram"
                )
              }
              className="px-4 py-2 bg-blue-500 rounded-lg"
            >
              <ButtonText> بروزرسانی</ButtonText>
            </Button>
          </HStack>
        </VStack>
      </ActionsheetContent>
    </Actionsheet>
  );
};

export default UpdateModal;
