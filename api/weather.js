import axios from "axios";
import { WEATHER_API } from "../constants/config";

const forecastEndpoint = (params) =>
  `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API}&q=${params.city}&days=${params.days}&aqi=no&alerts=no`;
const locationsEndpoint = (params) =>
  `https://api.weatherapi.com/v1/search.json?key=${WEATHER_API}&q=${params.city}`;

const apiCall = async (endpoint) => {
  const options = {
    method: "GET",
    url: endpoint,
  };

  try {
    const response = await axios(options);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const fetchWeatherForecast = async (params) => {
  return await apiCall(forecastEndpoint(params));
};

export const fetchLocations = async (params) => {
  return await apiCall(locationsEndpoint(params));
};
