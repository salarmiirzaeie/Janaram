import React from "react";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

const TestCard = () => {
  return (
    <VStack className="bg-red-500 w-full h-24 rounded-xl">
      <Text className="text-white">TestCard</Text>
    </VStack>
  );
};

export default TestCard;
