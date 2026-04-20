import React from "react";
import { BackHandler, Linking, Text } from "react-native";
import { useDispatch } from "react-redux";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
} from "../ui/actionsheet";
import { Button, ButtonText } from "../ui/button";
import { VStack } from "../ui/vstack";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}
const PACKAGE_NAME = "com.salarmiirzapour.Janaram"; // <-- جایگزین کن

const RateAppSheet: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const openCafeBazaar = async () => {
    // تلاش برای باز کردن deep link کافه‌بازار؛ fallback به وب در صورت failure
    const bazaarDeepLink = `bazaar://details?id=${PACKAGE_NAME}`;
    const bazaarWeb = `https://cafebazaar.ir/app/?id=${PACKAGE_NAME}`;

    try {
      const supported = await Linking.canOpenURL(bazaarDeepLink);
      if (supported) {
        await Linking.openURL(bazaarDeepLink);
      } else {
        await Linking.openURL(bazaarWeb);
      }
    } catch (err) {
      // fallback web
      try {
        await Linking.openURL(bazaarWeb);
      } catch (e) {
        console.warn("cannot open market link", e);
      }
    }

    // پس از هدایت، نشان دادن که دیگر نباید دوباره پرسیده شود.
    dispatch({ type: "initialize/setIsCommented", payload: true });
    onClose();
  };

  const remindLater = async () => {
    onClose();
    setTimeout(() => {
      BackHandler.exitApp(); // بعد از بستن، اپ بسته بشه
    }, 300); // یه تاخیر کوچیک برای انیمیشن مودال
  };

  const dontAskAgain = async () => {
    dispatch({ type: "initialize/setIsCommented", payload: true });
    onClose();
    setTimeout(() => {
      BackHandler.exitApp(); // بعد از بستن، اپ بسته بشه
    }, 300); // یه تاخیر کوچیک برای انیمیشن مودال
  };
  return (
    <Actionsheet isOpen={isOpen} closeOnOverlayClick onClose={onClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent className="py-10 px-6 rounded-t-3xl">
        <VStack space="lg" className="items-center">
          {/* Title */}
          <Text className="text-2xl font-vazirBold text-primary-800 text-center">
            از ما راضی بودی؟ ❤️
          </Text>

          {/* Subtitle */}
          <Text className="text-center text-primary-600 font-vazir leading-6">
            خیلی خوشحال می‌شیم اگر چند لحظه وقت بذاری و تو کافه‌بازار بهمون
            امتیاز بدی و نظرتو بنویسی.
          </Text>

          {/* Buttons */}
          <VStack space="md" className="w-full mt-4">
            <Button
              onPress={openCafeBazaar}
              className="w-full bg-primary-500 rounded-xl"
            >
              <ButtonText className="text-white text-center font-vazirBold">
                الان امتیاز می‌دم
              </ButtonText>
            </Button>

            <Button
              onPress={remindLater}
              className="w-full bg-background-100 rounded-xl"
            >
              <ButtonText className="text-primary-800 text-center font-vazirBold">
                بعداً یادآوری کن
              </ButtonText>
            </Button>

            <Text
              onPress={dontAskAgain}
              className="text-center text-primary-400 font-vazir mt-2"
            >
              نه، ممنون
            </Text>
          </VStack>
        </VStack>
      </ActionsheetContent>
    </Actionsheet>
  );
};

export default RateAppSheet;
