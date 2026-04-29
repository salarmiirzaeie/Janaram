import { LegendList } from "@legendapp/list";
import React, { FC, ReactNode } from "react";
import { VStack } from "../ui/vstack";
import HorizonListHeader from "./horizon-list-header";
import MusicMainCard from "./main-music-card";

interface horizonTitleProps {
  item: {
    data: any[];
    title: string;
    icon: ReactNode;
    id: string;
  };
}
const HorizonList: FC<horizonTitleProps> = ({ item }) => {
  return (
    <VStack className="mt-4 ">
      <HorizonListHeader title={item?.title} icon={item?.icon} id={item?.id} />

      <LegendList
        data={item?.data}
        keyExtractor={(item, index) => item?.id?.toString()}
        renderItem={({ item, index }: any) => (
          <MusicMainCard item={item} index={index} />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12 }}
      />
    </VStack>
  );
};

export default HorizonList;
