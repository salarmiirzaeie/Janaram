import TestCard from "@/components/home/test-card";
import { VStack } from "@/components/ui/vstack";
import React from "react";
const Tests = () => {
  return (
    <VStack space="md" className=" p-4">
      {[1, 2, 3, 4, 5, 6, 7].map((item) => (
        <TestCard index={item} key={item} />
      ))}
    </VStack>
  );
};

export default Tests;
