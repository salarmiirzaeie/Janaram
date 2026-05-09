// app/(tabs)/psychologist.tsx
import HorizonListHeader from "@/components/explore/horizon-list-header";
import CategoryChip from "@/components/psychologist/category-chip";
import PsychoCard from "@/components/psychologist/psycho-card";
import PsychologistCard from "@/components/psychologist/PsychologistCard-recommend";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useGetPsychologistsQuery } from "@/services/psychologist/psychologist-adapter";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "react-native-linear-gradient";

const { width } = Dimensions.get("window");

// پالت کامل رنگی (همان قبل)
export const colors = {
  primary: {
    50: "#F0F6FA",
    100: "#E1EDF5",
    200: "#C3DBEB",
    300: "#A5C9E1",
    400: "#87B7D7",
    500: "#79AED6",
    600: "#5E95BD",
    700: "#477BA3",
    800: "#336180",
    900: "#214760",
  },
  secondary: {
    50: "#F5F0FA",
    100: "#EBE0F5",
    200: "#D6C2EB",
    300: "#C2A3E1",
    400: "#AD85D7",
    500: "#9966CC",
    600: "#804DB3",
    700: "#663399",
    800: "#4D1A80",
    900: "#330D66",
  },
  accent: {
    50: "#FFF5F0",
    100: "#FFEBE0",
    200: "#FFD6C2",
    300: "#FFC2A3",
    400: "#FFAD85",
    500: "#FF9966",
    600: "#E6804D",
    700: "#CC6633",
    800: "#A34D26",
    900: "#7A331A",
  },
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },
};

// انواع داده (با API همخوانی دارد)
export type Category = {
  id: string;
  title: string;
  icon: string;
  color: string;
};

// دسته‌بندی‌های ثابت (آیکون‌ها فقط برای نمایش UI، فیلتر سمت سرور ارسال می‌شوند)
const categories: Category[] = [
  {
    id: "individual",
    title: "مشاور فردی",
    icon: "person-outline",
    color: colors.primary[500],
  },
  {
    id: "sexual",
    title: "مشاور جنسی",
    icon: "heart-outline",
    color: colors.accent[500],
  },
  {
    id: "addiction",
    title: "ترک اعتیاد",
    icon: "fitness-outline",
    color: colors.secondary[500],
  },
  {
    id: "phobia",
    title: "فوبیا و استرس",
    icon: "warning-outline",
    color: "#F59E0B",
  },
  { id: "children", title: "کودکان", icon: "happy-outline", color: "#10B981" },
  { id: "family", title: "خانواده", icon: "people-outline", color: "#EF4444" },
  { id: "couple", title: "زوج درمانی", icon: "people", color: "#8B5CF6" },
];

const allCategory: Category = {
  id: "all",
  title: "همه",
  icon: "apps-outline",
  color: colors.gray[500],
};

export default function PsychologistScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // استفاده از API واقعی
  const {
    data: psychologists = [],
    isLoading,
    isError,
    refetch,
  } = useGetPsychologistsQuery({
    category: selectedCategory === null ? undefined : selectedCategory,
    search: searchQuery || undefined,
  });

  // مرتب‌سازی برای پیشنهاد ویژه (بر اساس امتیاز، از API گرفته می‌شود)
  const topPsychologists = [...psychologists]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 5);

  // فیلتر local فقط برای جستجو (در صورت نیاز) – اما API قبلاً فیلتر کرده
  // برای اطمینان از هماهنگی، از داده‌های API مستقیماً استفاده می‌کنیم
  const filteredPsychologists = psychologists; // API از قبل فیلتر کرده

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
        contentContainerStyle={{ paddingBottom: 200 }} // فضای خالی برای نوار پایین
      >
        {/* هدر */}
        <LinearGradient
          colors={[colors.primary[50], colors.secondary[50]]}
          style={{
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 30,
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
          }}
        >
          <Text className="text-2xl text-right font-vazirBold text-gray-800">
            مشاوره تلفنی با روانشناس
          </Text>
          <Text className="text-gray-600 text-right font-vazir text-sm mt-2">
            از بین متخصصان مجرب، متخصص مورد نظر خود را انتخاب کنید
          </Text>

          <View
            className="mt-4 bg-white rounded-full shadow-sm"
            style={{ elevation: 2 }}
          >
            <Input className="border-0 rounded-full h-12">
              <InputSlot className="pl-3">
                <InputIcon
                  as={() => (
                    <Ionicons
                      name="search"
                      size={18}
                      color={colors.gray[400]}
                    />
                  )}
                />
              </InputSlot>
              <InputField
                placeholder="جستجوی نام پزشک یا تخصص..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="text-right"
                textAlign="right"
              />
            </Input>
          </View>
        </LinearGradient>

        {/* نوار دسته‌بندی‌ها */}
        <View
          className="py-4 bg-white"
          style={{
            borderBottomWidth: 1,
            borderBottomColor: colors.gray[100],
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
          >
            <CategoryChip
              category={allCategory}
              isSelected={selectedCategory === null}
              onPress={() => setSelectedCategory(null)}
            />
            {categories.map((cat) => (
              <CategoryChip
                key={cat.id}
                category={cat}
                isSelected={selectedCategory === cat.id}
                onPress={() => setSelectedCategory(cat.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* محتوای اصلی */}
        <View className="bg-white">
          {isLoading ? (
            <View className="py-20 items-center">
              <ActivityIndicator size="large" color={colors.primary[500]} />
              <Text className="text-gray-500 mt-2">دریافت اطلاعات...</Text>
            </View>
          ) : isError ? (
            <View className="py-20 items-center">
              <Ionicons
                name="alert-circle-outline"
                size={48}
                color={colors.gray[400]}
              />
              <Text className="text-gray-500 mt-2 text-center px-5">
                خطا در دریافت اطلاعات. لطفاً دوباره تلاش کنید.
              </Text>
              <TouchableOpacity onPress={() => refetch()} className="mt-4">
                <Text className="text-primary-500">تلاش مجدد</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* پیشنهاد ویژه (فقط وقتی هیچ دسته و جستجویی انتخاب نشده) */}
              {!selectedCategory &&
                !searchQuery &&
                topPsychologists.length > 0 && (
                  <View className="mt-4">
                    <HStack className="justify-between  flex-row-reverse items-center">
                      <HorizonListHeader
                        hideAll
                        title={"پیشنهاد ویژه"}
                        icon={
                          <Ionicons
                            name="star-sharp"
                            size={24}
                            color={colors.accent[500]}
                          />
                        }
                        id={"1"}
                      />

                      {/* در صورت نیاز می‌توان دکمه مشاهده همه را فعال کرد */}
                    </HStack>
                    <ScrollView
                      horizontal
                      contentContainerClassName="px-5 py-4"
                      showsHorizontalScrollIndicator={false}
                    >
                      {topPsychologists.map((doc) => (
                        <PsychologistCard key={doc.id} psychologist={doc} />
                      ))}
                    </ScrollView>
                  </View>
                )}

              {/* لیست عمودی همه روانشناسان */}
              <View className=" mt-2 mb-8">
                <HorizonListHeader
                  hideAll
                  title={
                    selectedCategory
                      ? `متخصصان ${
                          categories.find((c) => c.id === selectedCategory)
                            ?.title || ""
                        }`
                      : "همه روانشناسان"
                  }
                  icon={
                    <MaterialIcons
                      name="all-inclusive"
                      size={24}
                      color={colors.primary[500]}
                    />
                  }
                  id={"1"}
                />
                {}
                {filteredPsychologists.length === 0 ? (
                  <View className="py-10 px-5 items-center">
                    <Ionicons
                      name="sad-outline"
                      size={48}
                      color={colors.gray[400]}
                    />
                    <Text className="text-gray-500 mt-2">
                      نتیجه‌ای یافت نشد
                    </Text>
                  </View>
                ) : (
                  <VStack className="px-5" space="md">
                    {filteredPsychologists.map((doc) => (
                      <PsychoCard key={doc.id} doc={doc} />
                    ))}
                  </VStack>
                )}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
