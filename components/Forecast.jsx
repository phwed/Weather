import React from 'react';
import { View, Text } from 'react-native';
import { Image } from "expo-image";
import { theme } from '../theme';
import { weatherImages } from '../constants/config';
import moment from "moment";


export const Forecast = ({day}, key) => {


    return (
      <View
        key={key}
        className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
        style={{
          backgroundColor: theme.bgWhite(0.15),
        }}
      >
        <Image
          source={weatherImages[day?.day?.condition?.text]}
          className="w-11 h-11"
        />
        <Text
          className="text-white"
          style={{
            fontFamily: theme.regular,
          }}
        >
          {/* show day in format Mon 05 */}
          {moment(day?.date).format("ddd DD")}
        </Text>
        <Text
          className="text-white text-xl"
          style={{
            fontFamily: theme.bold,
          }}
        >
          {day?.day?.avgtemp_c}
          &#176;
        </Text>
      </View>
    );
};

