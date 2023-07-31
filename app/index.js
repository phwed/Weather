import React from "react";
import {
  View,
  Text,
  StatusBar,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { theme } from "../theme";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { MapPinIcon, CalendarDaysIcon } from "react-native-heroicons/solid";
import { debounce } from "lodash";
import { fetchLocations, fetchWeatherForecast } from "../api/weather";
import { weatherImages } from "../constants/config";

import * as Progress from "react-native-progress";
import { getData, storeData } from "../utils/asyncStorage";
import { Forecast } from "../components/Forecast";
import Stats from "../components/Stats";
import { Button } from "../components/Button";

export default function HomeScreen() {
  const [showSearch, toggleSearch] = React.useReducer((state) => !state, false);
  const [locations, setLocations] = React.useState([]);
  const [weather, setWeather] = React.useState({});
  const [loading, setLoading] = React.useState(true);

  const handleLocation = (location) => {
    setLocations([]);
    toggleSearch();
    setLoading(true);
    // fetch weather forecast
    fetchWeatherForecast({ city: location.name, days: 7 }).then((res) => {
      if (res) {
        setWeather(res);
        setLoading(false);
        storeData("city", location.name);
      }
    });
  };

  const handleSearch = (value) => {
    // fetch locations if characters are more than 3
    if (value.length > 3) {
      fetchLocations({ city: value }).then((res) => {
        if (res) {
          setLocations(res);
        }
      });
    }
  };

  React.useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    let city = await getData("city");
    let defaultCity = "Accra";
    if (city) {
      defaultCity = city;
    }

    fetchWeatherForecast({ city: defaultCity, days: 7 }).then((res) => {
      if (res) {
        setWeather(res);
        setLoading(false);
      }
    });
  };

  const handleTextDebounce = React.useCallback(debounce(handleSearch, 500), []);

  const { current, location } = weather;

  return (
    <View className="flex-1 relative">
      <StatusBar barStyle="light-content" />
      <Image
        blurRadius={70}
        source={require("../assets/images/bg.png")}
        className="absolute inset-0 w-full h-full"
      />

      {
        // loading
        loading ? (
          <View className="flex-1 justify-center items-center">
            <Progress.CircleSnail color="#0bb3b2" size={100} thickness={8} />
          </View>
        ) : (
          <SafeAreaView
            className="flex flex-1"
            style={{
              marginTop: StatusBar.currentHeight + 10,
            }}
          >
            {/* search section */}
            <View
              style={{
                height: "7%",
              }}
              className="mx-4 relative z-50"
            >
              <View
                className="flex-row justify-end items-center bg-white rounded-full"
                style={{
                  backgroundColor: showSearch
                    ? theme.bgWhite(0.2)
                    : "transparent",
                }}
              >
                {showSearch ? (
                  <TextInput
                    placeholder="Search city"
                    placeholderTextColor={"lightgray"}
                    className="pl-6 h-10 flex-1 text-base text-white"
                    style={{
                      fontFamily: theme.regular,
                    }}
                    onChangeText={handleTextDebounce}
                  />
                ) : null}

                <TouchableOpacity
                  style={{
                    backgroundColor: theme.bgWhite(0.3),
                  }}
                  className="rounded-full p-3 m-1"
                  onPress={toggleSearch}
                >
                  <MagnifyingGlassIcon size="25" color="white" />
                </TouchableOpacity>
              </View>
              {/* locations */}
              {locations.length > 0 && showSearch ? (
                <View className="absolute w-full bg-gray-300 top-16 rounded-2xl">
                  {locations.map((loc, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        className={`flex-row items-center border-0 p-3 px-4 mb-1 flex gap-2 `}
                        onPress={() => handleLocation(loc)}
                      >
                        <MapPinIcon size="20" color="gray" />
                        <Text
                          className="text-gray-700"
                          style={{
                            fontFamily: theme.regular,
                          }}
                        >
                          {loc?.name}, {loc?.region}, {loc?.country}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : null}
            </View>

            <View className="flex flex-row justify-center gap-2">
              <Button
                variant={"primary"}
                size="lg"
                textFont={"regular"}
                label="Click me a button"
              />
              <Button
                variant={"secondary"}
                size="lg"
                label="Click me a button"
              />
            </View>
            {/* forecast section */}
            <View className="mx-4 flex justify-around flex-1 mb-2">
              {/* location */}
              <Text
                className="text-white text-center text-2xl"
                style={{
                  fontFamily: theme.bold,
                }}
              >
                {location?.name},{" "}
                <Text
                  className="text-lg text-gray-300 "
                  style={{
                    fontFamily: theme.semiBold,
                  }}
                >
                  {location?.country}
                </Text>
              </Text>
              {/* weather image */}
              <View className="flex-row justify-center">
                <Image
                  source={weatherImages[current?.condition?.text]}
                  className="w-52 h-52"
                />
              </View>
              {/* temperature */}
              <View className="space-y-2">
                <Text
                  className="text-center text-white text-6xl ml-5"
                  style={{
                    fontFamily: theme.bold,
                  }}
                >
                  {current?.temp_c}
                  &#176;
                </Text>
                <Text
                  className="text-center text-white text-xl ml-5 tracking-widest"
                  style={{
                    fontFamily: theme.regular,
                  }}
                >
                  {current?.condition?.text}
                </Text>
              </View>

              {/* other stats */}
              <View className="flex-row justify-between mx-4">
                <Stats
                  image={require("../assets/icons/wind.png")}
                  stats={current?.wind_kph + " km/h"}
                />

                <Stats
                  image={require("../assets/icons/drop.png")}
                  stats={current?.humidity + " %"}
                />

                <Stats
                  image={require("../assets/icons/sun.png")}
                  stats={weather?.forecast?.forecastday[0]?.astro?.sunrise}
                />
              </View>

              {/* forcast section */}
              <View className="mb-2 space-y-3">
                <View className="flex-row items-center mx-5 space-x-2">
                  <CalendarDaysIcon size="22" color="white" />
                  <Text
                    className="text-white text-base"
                    style={{
                      fontFamily: theme.light,
                    }}
                  >
                    Daily forecast
                  </Text>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingHorizontal: 15,
                  }}
                >
                  {weather?.forecast?.forecastday?.map((day, index) => {
                    return <Forecast day={day} key={index} />;
                  })}
                </ScrollView>
              </View>
            </View>
          </SafeAreaView>
        )
      }
    </View>
  );
}
