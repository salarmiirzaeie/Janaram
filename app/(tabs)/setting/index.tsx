import AboutModal from "@/components/settings/about-modal";
import MeditationHourActionsheet from "@/components/settings/hour-actionsheet";
import LogoutModal from "@/components/settings/logout-modal";
import ProfileCard from "@/components/settings/profile-card";
import RulesModal from "@/components/settings/rules-modal";
import { Divider } from "@/components/ui/divider";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAppSelector } from "@/hooks/useAppSelector";
import useAuth from "@/hooks/useAuth";
import { AntDesign, Ionicons, Octicons } from "@expo/vector-icons";
import React from "react";
import {
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  Share,
  Switch,
} from "react-native";
import { useDispatch } from "react-redux";

const SettingsScreen = () => {
  const [aboutModalVisible, setAboutModalVisible] = React.useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = React.useState(false);
  const [rulesModalVisible, setRulesModalVisible] = React.useState(false);
  const [showMeditationSheet, setShowMeditationSheet] = React.useState(false);
  const meditationHour = useAppSelector(
    (state) => state.initialize.meditationTimer
  );
  const { moodNotification, newMeditationsNotification } = useAppSelector(
    (state) => state.settings
  );
  const dispatch = useDispatch();
  const { logOutUser } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <ProfileCard />

        {/* بخش عمومی */}
        <VStack className="mb-6 p-4">
          <Text className="text-primary-500 mb-2 text-right font-vazir">
            عمومی
          </Text>
          <SettingItem
            icon={<AntDesign name="info-circle" size={24} color="black" />}
            label="درباره اپلیکیشن"
            onPress={() => setAboutModalVisible(true)}
          />
          <SettingItem
            icon={<Ionicons name="basket" size={24} color="black" />}
            label="خرید اشتراک"
            onPress={() =>
              dispatch({
                type: "initialize/setIsFirstModalShow",
                payload: true,
              })
            }
          />
          <SettingItem
            icon={<Octicons name="law" size={24} color="black" />}
            label="قوانین برنامه"
            onPress={() => setRulesModalVisible(true)}
          />
          <SettingItem
            icon={<Ionicons name="share-social" size={24} color="black" />}
            label="معرفی به دوستان"
            onPress={async () => {
              try {
                await Share.share({
                  message:
                    "سلام! این اپلیکیشن رو از دست نده 😍 \n\nلینک دانلود: https://cafebazaar.ir/app/com.salarmiirzapour.Janaram",
                });
              } catch (error) {
                console.error("Error sharing:", error);
              }
            }}
          />
          <SettingItem
            icon={<AntDesign name="clock-circle" size={24} color="black" />}
            label={`ساعت مدیتیشن: ${
              meditationHour ? `${meditationHour}:00` : "انتخاب نشده"
            }`}
            onPress={() => setShowMeditationSheet(true)}
          />
          <SettingItem
            icon={<Ionicons name="call" size={24} color="black" />}
            label="تماس با ما"
            onPress={() => Linking.openURL("mailto:info@janaram.ir")}
          />
          <SettingItem
            icon={<Ionicons name="exit" size={24} color="black" />}
            label="خروج"
            onPress={() => setLogoutModalVisible(true)}
            isDanger
          />
        </VStack>

        <Divider />

        {/* بخش اعلان‌ها */}
        <VStack className="my-6 p-4">
          <Text className="text-primary-500 mb-2 text-right font-vazir">
            اعلان‌ها
          </Text>
          <SettingSwitch
            icon={<AntDesign name="notification" size={24} color="black" />}
            label="یادآوری حال روزانه"
            value={moodNotification}
            setValue={(value) =>
              dispatch({ type: "settings/setMoodNotification", payload: value })
            }
          />

          <SettingSwitch
            icon={<AntDesign name="notification" size={24} color="black" />}
            label="اطلاع از مدیتیشن های جدید"
            value={newMeditationsNotification}
            setValue={(value) =>
              dispatch({
                type: "settings/setNewMeditationsNotification",
                payload: value,
              })
            }
          />
        </VStack>

        <Divider />

        <AboutModal
          visible={aboutModalVisible}
          onClose={() => setAboutModalVisible(false)}
        />
        <RulesModal
          visible={rulesModalVisible}
          onClose={() => setRulesModalVisible(false)}
        />
        <LogoutModal
          visible={logoutModalVisible}
          onClose={() => setLogoutModalVisible(false)}
        />
        <MeditationHourActionsheet
          isOpen={showMeditationSheet}
          onClose={() => setShowMeditationSheet(false)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default React.memo(SettingsScreen);

const SettingItem = ({
  icon,
  label,
  onPress,
  isDanger = false,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  isDanger?: boolean;
}) => (
  <Pressable onPress={onPress}>
    <HStack space="md" className="py-3 items-center flex-row-reverse">
      {icon}
      <Text
        className={`text-base ${
          isDanger ? "text-red-500" : "text-gray-800"
        } font-vazir`}
      >
        {label}
      </Text>
    </HStack>
  </Pressable>
);

const SettingSwitch = ({
  icon,
  label,
  value,
  setValue,
}: {
  icon: React.ReactNode;
  label: string;
  value?: boolean;
  setValue: (value: boolean) => void;
}) => (
  <HStack className="py-3 items-center flex-row-reverse justify-between">
    <HStack space="md" className="items-center">
      {icon}
      <Text className="text-base text-gray-800 font-vazir">{label}</Text>
    </HStack>
    <Switch value={value} onValueChange={setValue} />
  </HStack>
);
