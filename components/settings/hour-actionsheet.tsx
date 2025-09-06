import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetFlatList,
  ActionsheetItem,
  ActionsheetItemText,
} from "@/components/ui/actionsheet";
import { Text } from "@/components/ui/text";
import { setMeditationTimer } from "@/redux/intialize/initialize-slice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const MeditationHourActionsheet: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const selectedHour = useSelector((state: any) => state.settings.meditationHour);

  const hours = Array.from({ length: 17 }, (_, i) => {
    const h = i + 7;
    return {
      id: h,
      label: `${h}:00 ${h < 12 ? "صبح" : h === 12 ? "ظهر" : "بعد از ظهر"}`,
    };
  });

  const handleSelectHour = (hour: number) => {
    dispatch(setMeditationTimer(hour));
    onClose();
  };

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        <ActionsheetFlatList
          className="h-1/2"
          data={hours}
          renderItem={({ item: hour }: any) => (
            <ActionsheetItem className="justify-end" key={hour.id} onPress={() => handleSelectHour(hour.id)}>
              <ActionsheetItemText className="text-right">
                <Text className={selectedHour === hour.id ? "text-primary-500 font-vazirBold" : "font-vazir"}>
                  {hour.label}
                </Text>
              </ActionsheetItemText>
            </ActionsheetItem>
          )}
        />
      </ActionsheetContent>
    </Actionsheet>
  );
};

export default MeditationHourActionsheet;
