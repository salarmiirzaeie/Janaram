import React from "react";
import { Image } from "react-native";
import { Button, ButtonText } from "../ui/button";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
interface IVStackProps extends React.ComponentProps<typeof VStack> {
  index: number;
}
const TestCard: React.FC<IVStackProps> = (props) => {
  return (
    <HStack
      className={`  p-5  rounded-3xl  justify-between w-full h-48 bg-blue-300 shadow shadow-md`}
    >
      <VStack className="flex-1 justify-center items-center">
        <Image
          source={require("@/assets/images/meditation.png")}
          className="w-40 h-40"
          alt="test"
        />
      </VStack>
      <VStack className="flex-1 justify-between">
        <VStack space="md">
          <Text className="font-semiBold text-xl text-right">
            دوره ی مدیتیشن
          </Text>
          <Text className="font-medium text-sm text-right">
            خواب عمیق از کابوس تا آرامش
          </Text>
        </VStack>
        <Button>
          <ButtonText>شروع</ButtonText>
        </Button>
      </VStack>
    </HStack>
  );
};

export default TestCard;
