import React from "react";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
interface IVStackProps extends React.ComponentProps<typeof VStack> {
  index: number;
}
const TestCard: React.FC<IVStackProps> = (props) => {
  return (
    <HStack
      className={`  p-5 justify-center rounded-3xl items-center w-full h-20 ${
        props.index % 2 ? "bg-red-300" : "bg-orange-300"
      } `}
    >
      <Text className="text-white font-semiBold text-xl">تست استرس </Text>
    </HStack>
  );
};

export default TestCard;
