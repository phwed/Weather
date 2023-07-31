// Wind.js
import React from "react";
import { View, Image, Text } from "react-native";
import { theme } from "../theme";

const Stats = (props) => {
  return (
    <View className="flex-row space-x-2 items-center">
      <Image source={props.image} className="w-6 h-6" />
      <Text
        className="text-white  text-base"
        style={{
          fontFamily: theme.semiBold,
        }}
      >
        {props.stats}
      </Text>
    </View>
  );
};

export default Stats;
