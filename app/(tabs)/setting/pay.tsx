import { useBazaar } from "@cafebazaar/react-native-poolakey";
import React from "react";
import { Text, View } from "react-native";

const pay = () => {
  const bazaar = useBazaar(process.env.BAZAR_RSA_KEY);

  return (
    <View>
      <Text>pay</Text>
    </View>
  );
};

export default pay;
