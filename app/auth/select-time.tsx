import ProgressOnboarding from "@/components/auth/Pregoress-bar";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useCustomToast } from "@/hooks/useToast";
import { setMeditationTimer } from "@/redux/intialize/initialize-slice";
import { router } from "expo-router";
import React, { useState } from "react";
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";

const TimeSelection = () => {
  const dispatch = useDispatch();
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const toast = useCustomToast();
  const hours: { id: number; label: string }[] = Array.from({ length: 17 }, (_, i) => {
    const hour = i + 7; // Start from 7 AM
    return {
      id: hour,
      label: `${hour}:00 ${hour < 12 ? "صبح" : hour === 12 ? "ظهر" : "بعد از ظهر"}`,
    };
  });
  const handleHourSelect = (hourId: number) => {
    setSelectedHour(hourId);
  };

  const handleNext = () => {
    // Logic for saving selected time and navigating to the next page
    // dispatch(setSelectedTime(selectedHour));
    if (!selectedHour) {
      toast.show({ msg: "لطفا ساعت را انتخاب کنید", type: "error" });
      return;
    }
    dispatch(setMeditationTimer(selectedHour));
    router.push("/auth/personalizing");
  };

  const renderHourItem = ({ item }: { item: { id: number; label: string } }) => (
    <TouchableOpacity
      onPress={() => handleHourSelect(item.id)}
      style={[styles.hourItem, selectedHour === item.id ? styles.selectedHour : null]}
    >
      <Text className={`text-md font-medium ${selectedHour === item.id ? "text-white" : "text-[#4A4E69]"}`}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <VStack className="flex-1 bg-white items-center p-4 justify-between">
      <ProgressOnboarding className="" onBack={() => router.back()} currentStep={4} totalSteps={5} />
      <VStack space="md" className="flex-1 items-center justify-center">
        <Image
          source={require("@/assets/illustrations/meditation.png")} // Assume a cute clock illustration
          className="h-48 w-48 mb-8"
        />
        <Text className="text-2xl font-semiBold  tracking-wide">چه ساعتی دوست داری مدیتیشن کنی؟</Text>
        <Text className=" text-typography-400 text-center text-md px-4">یه ساعت انتخاب کن تا با هم شروع کنیم!</Text>
        <View style={styles.squareContainer}>
          <FlatList
            data={hours}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderHourItem}
            contentContainerStyle={styles.flatListContent}
            showsVerticalScrollIndicator={true}
          />
        </View>
      </VStack>
      <VStack className="w-full p-4">
        <Button onPress={handleNext} className="w-full  rounded-xl" size="xl">
          <ButtonText className="text-white font-bold"> ادامه </ButtonText>
        </Button>
      </VStack>
    </VStack>
  );
};

const styles = StyleSheet.create({
  squareContainer: {
    width: 300, // Fixed width for square
    height: 300, // Fixed height for square
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    overflow: "hidden", // Ensures content stays within rounded corners
    marginTop: 16,
    backgroundColor: "#F9FAFB",
  },
  flatListContent: {
    padding: 16,
  },
  hourItem: {
    flex: 1,
    padding: 12,
    margin: 4,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  selectedHour: {
    backgroundColor: "#6B7280",
  },
});

export default TimeSelection;
