import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { VStack } from "@/components/ui/vstack";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, TextInput } from "react-native";

type SubType = "gratitude_exercise" | "daily_tip" | "journaling";

export default function TextActivityScreen() {
  const { subType } = useLocalSearchParams<{ subType: SubType }>();
  const [text, setText] = useState("");
  const [gratitudeList, setGratitudeList] = useState<string[]>([]);

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
    console.log("User input:", {
      gratitudeList,
      journaling: text,
    });
    // اینجا می‌تونی API بزنی و ذخیره کنی
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

  const renderContent = () => {
    switch (subType) {
      case "gratitude_exercise":
        return (
          <VStack space="lg">
            <Text className="text-xl font-vazirBold text-right">شکرگزاری</Text>
            <Text className="text-base font-vazir text-gray-600 text-right">
              امروز بابت چه چیزهایی شکرگزار هستی؟ هر مورد رو جداگانه بنویس.
            </Text>

            <HStack space="md" className="items-center">
              <TextInput
                value={text}
                onChangeText={setText}
                placeholder="بنویس..."
                className="flex-1 border border-gray-300 rounded-2xl p-4 text-right"
              />
              <Button size="md" onPress={handleAddGratitude}>
                <ButtonText>+</ButtonText>
              </Button>
            </HStack>

            <VStack space="sm">
              {gratitudeList.map((item, idx) => (
                <Card key={idx} className="p-3 bg-green-100">
                  <HStack className="justify-between items-center">
                    <Text className="text-right flex-1 pr-2">{item}</Text>
                    <Button
                      size="xs"
                      variant="outline"
                      onPress={() => handleDeleteGratitude(idx)}
                      className="border-red-400"
                    >
                      <ButtonText className="text-red-500">حذف</ButtonText>
                    </Button>
                  </HStack>
                </Card>
              ))}
            </VStack>

            {/* هشدار */}
            {/* <Text className="text-xs text-gray-500 text-right mt-2">
              ⚠️ متن‌هایی که اینجا می‌نویسی جایی ذخیره نمی‌شن و فقط برای خودته.
            </Text> */}
          </VStack>
        );

      case "daily_tip":
        return (
          <Card className="p-6 bg-primary-100">
            <Text className="text-lg font-vazirBold text-right">نکته امروز</Text>
            <Text className="text-base font-vazir mt-2 text-right text-gray-700">{randomTip} </Text>
          </Card>
        );

      case "journaling":
        return (
          <VStack space="lg">
            <Text className="text-xl font-vazirBold text-right">ژورنال روزانه</Text>
            <Text className="text-base text-gray-600 font-vazir text-right">
              افکارت رو همینجا بنویس. هر چیزی که توی ذهنت هست.
            </Text>
            <Textarea className="border  border-gray-300 rounded-2xl p-4 text-right">
              <TextareaInput className="text-right" value={text} onChangeText={setText} placeholder="بنویس..." />
            </Textarea>

            {/* هشدار */}
            {/* <View className="border border-warning-400 rounded-2xl p-3">
              <Text className="text-xs text-warning-600 text-right mt-2">
                ⚠️ متن‌هایی که اینجا می‌نویسی جایی ذخیره نمی‌شن و فقط برای خودته.
              </Text>
            </View> */}
          </VStack>
        );

      default:
        return <Text>فعالیت نامعتبر</Text>;
    }
  };

  return (
    <ScrollView className="flex-1 bg-white p-6">
      <VStack space="xl">{renderContent()}</VStack>
      {subType !== "daily_tip" && (
        <Button onPress={handleSubmit} className="mt-6">
          <ButtonText>ثبت</ButtonText>
        </Button>
      )}
    </ScrollView>
  );
}
