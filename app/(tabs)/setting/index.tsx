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
import { AntDesign, Feather, Ionicons, Octicons } from "@expo/vector-icons";
import React from "react";
import {
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  Share,
  Switch,
  View,
} from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
import Animated, { FadeInUp } from "react-native-reanimated";
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
    <LinearGradient
      colors={["#F0F6FA", "#FFFFFF", "#F5F0FA"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          {/* Header */}

          <ProfileCard />

          {/* General Section */}
          <Animated.View entering={FadeInUp.duration(600).delay(100)}>
            <VStack className="mb-6 px-4">
              <HStack className="items-center justify-end mb-5 mt-3">
                <View className="bg-primary-100 rounded-full px-3 py-1">
                  <Text className="text-primary-600 font-vazir text-xs">
                    عمومی
                  </Text>
                </View>
                <Feather
                  name="grid"
                  size={16}
                  color="#79AED6"
                  className="ml-2"
                />
              </HStack>

              <LinearGradient
                colors={["#FFFFFF", "#F9F9FF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 20,
                  paddingHorizontal: 4,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.04,
                  shadowRadius: 8,
                  elevation: 2,
                }}
              >
                <SettingItem
                  icon={
                    <AntDesign name="info-circle" size={22} color="#79AED6" />
                  }
                  label="درباره اپلیکیشن"
                  onPress={() => setAboutModalVisible(true)}
                />
                <Divider className="my-1" />
                <SettingItem
                  icon={<Ionicons name="basket" size={22} color="#9966CC" />}
                  label="خرید اشتراک"
                  onPress={() =>
                    dispatch({
                      type: "initialize/setIsFirstModalShow",
                      payload: true,
                    })
                  }
                />
                <Divider className="my-1" />
                <SettingItem
                  icon={<Octicons name="law" size={22} color="#FF9966" />}
                  label="قوانین برنامه"
                  onPress={() => setRulesModalVisible(true)}
                />
                <Divider className="my-1" />
                <SettingItem
                  icon={
                    <Ionicons name="share-social" size={22} color="#79AED6" />
                  }
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
                <Divider className="my-1" />
                <SettingItem
                  icon={
                    <AntDesign name="clock-circle" size={22} color="#91A5BE" />
                  }
                  label={`ساعت مدیتیشن: ${
                    meditationHour ? `${meditationHour}:00` : "انتخاب نشده"
                  }`}
                  onPress={() => setShowMeditationSheet(true)}
                />
                <Divider className="my-1" />
                <SettingItem
                  icon={<Ionicons name="call" size={22} color="#79AED6" />}
                  label="تماس با ما"
                  onPress={() => Linking.openURL("mailto:info@janaram.ir")}
                />
                <Divider className="my-1" />
                <SettingItem
                  icon={<Ionicons name="exit" size={22} color="#FF6B6B" />}
                  label="خروج"
                  onPress={() => setLogoutModalVisible(true)}
                  isDanger
                />
              </LinearGradient>
            </VStack>
          </Animated.View>

          {/* Notifications Section */}
          <Animated.View entering={FadeInUp.duration(600).delay(200)}>
            <VStack className="mb-6 px-4">
              <HStack className="items-center justify-end mb-5">
                <View className="bg-primary-100 rounded-full px-3 py-1">
                  <Text className="text-primary-600 font-vazir text-xs">
                    اعلان‌ها
                  </Text>
                </View>
                <Ionicons
                  name="notifications"
                  size={16}
                  color="#79AED6"
                  className="ml-2"
                />
              </HStack>

              <LinearGradient
                colors={["#FFFFFF", "#F9F9FF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 20,
                  paddingHorizontal: 4,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.04,
                  shadowRadius: 8,
                  elevation: 2,
                }}
              >
                <SettingSwitch
                  icon={<Feather name="sun" size={22} color="#FF9966" />}
                  label="یادآوری حال روزانه"
                  value={moodNotification}
                  setValue={(value) =>
                    dispatch({
                      type: "settings/setMoodNotification",
                      payload: value,
                    })
                  }
                />
                <Divider className="my-1" />
                <SettingSwitch
                  icon={<Feather name="bell" size={22} color="#79AED6" />}
                  label="اطلاع از مدیتیشن های جدید"
                  value={newMeditationsNotification}
                  setValue={(value) =>
                    dispatch({
                      type: "settings/setNewMeditationsNotification",
                      payload: value,
                    })
                  }
                />
              </LinearGradient>
            </VStack>
          </Animated.View>

          {/* App Version */}
          <Animated.View entering={FadeInUp.duration(600).delay(300)}>
            <View className="items-center mb-40 py-6">
              <Text className="text-tertiary-400 font-vazir text-xs">
                نسخه ۱.۲.۰
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>

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
    </LinearGradient>
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
  <Pressable onPress={onPress} className="active:opacity-70">
    <HStack space="md" className="py-4 px-3 items-center flex-row-reverse">
      <View
        className={`rounded-full p-2 ${
          isDanger ? "bg-red-50" : "bg-primary-50"
        }`}
      >
        {icon}
      </View>
      <Text
        className={`flex-1 text-right font-vazir text-base ${
          isDanger ? "text-red-500" : "text-gray-700"
        }`}
      >
        {label}
      </Text>
      {!isDanger && <AntDesign name="left" size={16} color="#CCC" />}
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
  <HStack className="py-4 px-3 items-center flex-row-reverse justify-between">
    <HStack space="md" className="items-center">
      <Switch
        value={value}
        onValueChange={setValue}
        trackColor={{ false: "#E5E5E5", true: "#79AED6" }}
        thumbColor={value ? "#FFFFFF" : "#FFFFFF"}
        ios_backgroundColor="#E5E5E5"
      />
      <View className="rounded-full p-2 bg-primary-50">{icon}</View>
      <Text className="flex-1 text-right font-vazir text-base text-gray-700">
        {label}
      </Text>
    </HStack>
  </HStack>
);
