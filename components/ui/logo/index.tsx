import React from "react";
import { Image } from "react-native";
interface Props extends React.ComponentProps<typeof Image> {}
const Logo: React.FC<Props> = (props) => {
  return <Image source={require("@/assets/images/logo.png")} {...props} />;
};

export default Logo;
