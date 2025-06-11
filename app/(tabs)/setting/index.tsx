import AboutModal from "@/components/settings/about-modal";
import { Divider } from "@/components/ui/divider";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAppSelector } from "@/hooks/useAppSelector";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import React from "react";
import { Linking, Pressable, ScrollView, Switch } from "react-native";
import { useDispatch } from "react-redux";

export default function SettingsScreen() {
  const [aboutModalVisible, setAboutModalVisible] = React.useState(false);
  const { moodNotification, newMeditationsNotification } = useAppSelector((state) => state.settings);
  const dispatch = useDispatch();
  return (
    <ScrollView className="bg-white flex-1 p-4">
      {/* اعلان‌ها */}
      <VStack className="mb-6">
        <Text className="text-primary-500 mb-2 text-right font-medium">اعلان‌ها</Text>
        <SettingSwitch
          value={moodNotification}
          setValue={(value) => dispatch({ type: "settings/setMoodNotification", payload: value })}
          icon={<AntDesign name="notification" size={24} color="black" />}
          label="یادآوری مود روزانه"
        />
        <SettingSwitch
          value={newMeditationsNotification}
          setValue={(value) => dispatch({ type: "settings/setNewMeditationsNotification", payload: value })}
          icon={<AntDesign name="notification" size={24} color="black" />}
          label="اطلاع از تست‌های جدید"
        />
      </VStack>
      <Divider />
      {/* ظاهر و رابط کاربری */}
      {/* <VStack className="my-6">
        <Text className="text-primary-500 mb-2 text-right font-medium">
          رابط کاربری
        </Text>
        <SettingSwitch
          icon={<Ionicons name="moon" size={24} color="black" />}
          label="حالت تاریک"
        />
      </VStack> */}
      <Divider />
      {/* عمومی */}
      <VStack className="my-6">
        <Text className="text-primary-500 mb-2 text-right font-medium">عمومی</Text>

        <SettingItem
          icon={<AntDesign name="infocirlceo" size={24} color="black" />}
          label="درباره اپلیکیشن"
          onPress={() => {
            setAboutModalVisible(true);
          }}
        />
        <SettingItem
          icon={<Ionicons name="call" size={24} color="black" />}
          label="تماس با ما"
          onPress={() => {
            Linking.openURL("mailto:salarmiirzapour@gmail.com");
          }}
        />
      </VStack>
      <AboutModal visible={aboutModalVisible} onClose={() => setAboutModalVisible(false)} />
    </ScrollView>
  );
}

const SettingItem = ({
  icon: IconComp,
  label,
  onPress,
  isDanger = false,
}: {
  icon: any;
  label: string;
  onPress: () => void;
  isDanger?: boolean;
}) => (
  <Pressable onPress={onPress}>
    <HStack space="md" className="py-3 items-center flex-row-reverse">
      {IconComp}
      <Text className={`text-base ${isDanger ? "text-red-500" : "text-gray-800"}`}>{label}</Text>
    </HStack>
  </Pressable>
);

const SettingSwitch = ({
  icon: IconComp,
  label,
  value,
  setValue,
}: {
  icon: any;
  label: string;
  value?: boolean;
  setValue: (value: boolean) => void;
}) => {
  return (
    <HStack className="py-3 items-center flex-row-reverse justify-between">
      <HStack space="md" className="items-center">
        {IconComp}
        <Text className="text-base text-gray-800">{label}</Text>
      </HStack>
      <Switch value={value} onValueChange={setValue} />
    </HStack>
  );
};
