import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { VStack } from "@/components/ui/vstack";
import { useCustomToast } from "@/hooks/useToast";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
import Animated, { FadeInUp } from "react-native-reanimated";

type SubType = "gratitude_exercise" | "daily_tip" | "journaling";

export default function TextActivityScreen() {
  const { subType } = useLocalSearchParams<{ subType: SubType }>();
  const [text, setText] = useState("");
  const [gratitudeList, setGratitudeList] = useState<string[]>([]);
  const toast = useCustomToast();

  const handleAddGratitude = () => {
    if (text.trim() !== "") {
      setGratitudeList([...gratitudeList, text.trim()]);
      setText("");
    }
  };

  const handleDeleteGratitude = (index: number) => {
    setGratitudeList(gratitudeList.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    toast.show({ msg: "با موفقیت ذخیره شد", type: "success" });
    router.back();
  };

  const tips = [
    "هر روز فرصتی تازه برای شروع دوباره است.",
    "موفقیت نتیجه تلاش‌های کوچک و پیوسته است.",
    "لبخند بزن، حتی در سخت‌ترین روزها.",
    "خودت را باور کن، تو قوی‌تر از چیزی هستی که فکر می‌کنی.",
    "امروز بهترین زمان برای اقدام است.",
    "هر شکست پلی برای رسیدن به پیروزی است.",
    "انرژی مثبتت را با دیگران تقسیم کن.",
    "با هر قدم کوچک به هدف نزدیک‌تر می‌شوی.",
    "به جای مقایسه، روی رشد خودت تمرکز کن.",
    "قدر لحظه‌های حال را بدان.",
    "ذهن آرام، قلب شاد می‌آورد.",
    "هیچ چیز غیرممکن نیست اگر باور داشته باشی.",
    "امروز کاری کن که فردایت به خودت افتخار کند.",
    "هر روز یک قدم کوچک برای بهتر شدن بردار.",
    "قدردان داشته‌هایت باش تا زندگی زیباتر شود.",
    "هر سختی در دل خود فرصتی دارد.",
    "به جای نگرانی، روی حل مسائل تمرکز کن.",
    "تو همانقدر خوشبختی که فکر می‌کنی.",
    "هر روز با امید از نو آغاز کن.",
    "روی نقاط قوتت تمرکز کن و بدرخش.",
  ];
  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  const getHeaderInfo = () => {
    switch (subType) {
      case "gratitude_exercise":
        return {
          title: "شکرگزاری",
          icon: "🌸",
          gradient: ["#79AED6", "#9966CC"],
          bg: "bg-primary-50",
        };
      case "daily_tip":
        return {
          title: "نکته روز",
          icon: "💡",
          gradient: ["#FF9966", "#E6804D"],
          bg: "bg-accent-50",
        };
      case "journaling":
        return {
          title: "ژورنال روزانه",
          icon: "📝",
          gradient: ["#9966CC", "#79AED6"],
          bg: "bg-secondary-50",
        };
      default:
        return {
          title: "فعالیت",
          icon: "✨",
          gradient: ["#79AED6", "#9966CC"],
          bg: "bg-primary-50",
        };
    }
  };

  const headerInfo = getHeaderInfo();

  const renderContent = () => {
    switch (subType) {
      case "gratitude_exercise":
        return (
          <Animated.View entering={FadeInUp.duration(600).delay(200)}>
            <VStack space="lg">
              <LinearGradient
                colors={["#F9F9FF", "#FFFFFF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 20,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "#E9EDF2",
                }}
              >
                <Text className="text-base font-vazir text-primary-600 text-right leading-6">
                  نوشتن چیزهایی که بابت آن‌ها شکرگزار هستی باعث افزایش حس مثبت و
                  آرامش درونی می‌شود. هر مورد را جداگانه بنویس، حتی چیزهای کوچک
                  مثل یک لبخند یا یک فنجان چای گرم.
                </Text>
              </LinearGradient>

              <HStack space="md" className="items-center">
                <View className="flex-1">
                  <View
                    style={{
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: "#E9EDF2",
                      overflow: "hidden",
                      backgroundColor: "#FFFFFF",
                    }}
                  >
                    <TextInput
                      value={text}
                      onChangeText={setText}
                      placeholder="مثلاً: امروز از بودن کنار خانواده‌ام خوشحالم..."
                      placeholderTextColor="#AAA"
                      style={{
                        flex: 1,
                        padding: 16,
                        textAlign: "right",
                        fontFamily: "vazir",
                        fontSize: 14,
                        color: "#374151",
                      }}
                      multiline
                    />
                  </View>
                </View>
                <TouchableOpacity
                  onPress={handleAddGratitude}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={["#79AED6", "#9966CC"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Feather name="plus" size={24} color="white" />
                  </LinearGradient>
                </TouchableOpacity>
              </HStack>

              <VStack space="sm">
                {gratitudeList.map((item, idx) => (
                  <Animated.View
                    key={idx}
                    entering={FadeInUp.duration(300).delay(idx * 50)}
                  >
                    <View
                      style={{
                        borderRadius: 16,
                        padding: 12,
                        borderWidth: 1,
                        borderColor: "#E9EDF2",
                        backgroundColor: "#F0F6FA",
                      }}
                    >
                      <HStack className="justify-between items-center">
                        <TouchableOpacity
                          onPress={() => handleDeleteGratitude(idx)}
                          style={{
                            backgroundColor: "#FEE2E2",
                            borderRadius: 999,
                            padding: 8,
                          }}
                        >
                          <Feather name="trash-2" size={16} color="#FF6B6B" />
                        </TouchableOpacity>
                        <Text className="text-right flex-1 pr-3 font-vazir text-gray-700">
                          {item}
                        </Text>
                        <Feather name="heart" size={18} color="#79AED6" />
                      </HStack>
                    </View>
                  </Animated.View>
                ))}
              </VStack>

              <View className="bg-primary-50 rounded-2xl p-4">
                <HStack space="sm" className="items-center justify-end">
                  <Feather name="shield" size={14} color="#79AED6" />
                  <Text className="text-xs text-primary-500 text-right font-vazir">
                    نوشته‌های تو فقط روی دستگاهت هستن و جایی ذخیره نمی‌شن.
                  </Text>
                </HStack>
              </View>
            </VStack>
          </Animated.View>
        );

      case "daily_tip":
        return (
          <Animated.View entering={FadeInUp.duration(600).delay(200)}>
            <LinearGradient
              colors={["#FFF9F5", "#FFFFFF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 28,
                padding: 24,
                borderWidth: 1,
                borderColor: "#FFE8D6",
              }}
            >
              <HStack space="md" className="items-center mb-4">
                <View className="bg-accent-100 rounded-full p-3">
                  <Text className="text-2xl">💡</Text>
                </View>
                <Text className="text-xl font-vazirBold text-accent-700 flex-1 text-right">
                  نکته امروز
                </Text>
              </HStack>

              <Text className="text-lg font-vazirBold text-primary-700 text-right leading-7 mt-2">
                {randomTip}
              </Text>
              <Text className="text-base font-vazir text-tertiary-600 text-right leading-6 mt-4">
                این جمله‌های انگیزشی می‌تونن بهت انرژی بدن. چند بار در روز بخون
                و یادت باشه عمل کردن به همین نکات کوچیک می‌تونه تغییر بزرگی
                بسازه.
              </Text>

              <View className="mt-6 pt-4 border-t border-accent-100">
                <HStack space="sm" className="items-center justify-end">
                  <Feather name="repeat" size={14} color="#FF9966" />
                  <Text className="text-xs text-accent-500 text-right font-vazir">
                    هر بار که این صفحه رو باز کنی، یک نکته جدید می‌بینی
                  </Text>
                </HStack>
              </View>
            </LinearGradient>
          </Animated.View>
        );

      case "journaling":
        return (
          <Animated.View entering={FadeInUp.duration(600).delay(200)}>
            <VStack space="lg">
              <LinearGradient
                colors={["#F9F9FF", "#FFFFFF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 20,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "#E9EDF2",
                }}
              >
                <Text className="text-base font-vazir text-primary-600 text-right leading-6">
                  ژورنال نوشتن یعنی تخلیه‌ی ذهنی. می‌تونی احساساتت، نگرانی‌ها یا
                  حتی ایده‌های خلاقانه‌ات رو روی کاغذ (اینجا) بیاری. این تمرین
                  باعث می‌شه ذهن سبک‌تر بشه و دید بهتری به روزت پیدا کنی.
                </Text>
              </LinearGradient>

              <View
                style={{
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: "#E9EDF2",
                  overflow: "hidden",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <Textarea className="border-0 bg-transparent h-80 p-4">
                  <TextareaInput
                    className="text-right font-vazir text-base"
                    value={text}
                    onChangeText={setText}
                    placeholder="شروع کن به نوشتن..."
                    placeholderTextColor="#AAA"
                    textAlignVertical="top"
                  />
                </Textarea>
              </View>

              <View className="bg-primary-50 rounded-2xl p-4">
                <HStack space="sm" className="items-center justify-end">
                  <Feather name="lock" size={14} color="#79AED6" />
                  <Text className="text-xs text-primary-500 text-right font-vazir">
                    نوشته‌های این بخش فقط برای خودته و در جایی ذخیره نمی‌شن.
                  </Text>
                </HStack>
              </View>
            </VStack>
          </Animated.View>
        );

      default:
        return (
          <Text className="text-center text-gray-500">فعالیت نامعتبر</Text>
        );
    }
  };

  return (
    <LinearGradient
      colors={["#F0F6FA", "#FFFFFF", "#F5F0FA"]}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="p-6">
            {/* Content */}
            {renderContent()}
            {/* Submit Button */}
            {subType !== "daily_tip" && (
              <Animated.View entering={FadeInUp.duration(600).delay(400)}>
                <TouchableOpacity
                  onPress={handleSubmit}
                  activeOpacity={0.8}
                  className="mt-8"
                >
                  <LinearGradient
                    colors={["#79AED6", "#9966CC"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      borderRadius: 24,
                      paddingVertical: 16,
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "row",
                      gap: 8,
                    }}
                  >
                    <Feather name="check" size={20} color="white" />
                    <Text className="text-white font-vazirBold text-lg">
                      ثبت و ذخیره
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
