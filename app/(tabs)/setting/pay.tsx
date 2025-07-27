import { Button, ButtonText } from "@/components/ui/button";
import { useBazaar } from "@cafebazaar/react-native-poolakey";
import React from "react";
import { Text, View } from "react-native";

const pay = () => {
  const bazaar = useBazaar(process.env.EXPO_PUBLIC_BAZAR_RSA_KEY);

  return (
    <View>
      <Text>pay</Text>
      <Button onPress={() => bazaar.subscribeProduct("trial_subscription")}>
        <ButtonText>پرداخت</ButtonText>
      </Button>
    </View>
  );
};

export default pay;
