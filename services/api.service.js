import axios from "axios";
import {
  getKeyValue,
  LATITUDE_LONGITUDE_DICTIONARY,
  TOKEN_DICTIONARY,
} from "./storage.service.js";

const getIcon = (icon) => {
  switch (icon.slice(0, -1)) {
    case "01":
      return "☀️";
    case "02":
      return "🌤️";
    case "03":
      return "☁️";
    case "04":
      return "☁️";
    case "09":
      return "🌧️";
    case "10":
      return "🌦️";
    case "11":
      return "🌩️";
    case "13":
      return "❄️";
    case "50":
      return "🌫️";
  }
};

const getWeather = async () => {
  const lat = await getKeyValue(LATITUDE_LONGITUDE_DICTIONARY.lat);
  const lon = await getKeyValue(LATITUDE_LONGITUDE_DICTIONARY.lon);
  const token =
    process.env.TOKEN ?? (await getKeyValue(TOKEN_DICTIONARY.token));

  if (!lat || !lon) {
    throw new Error("Не задан город, задайте его через команду -s [CITY]");
  }

  if (!token) {
    throw new Error(
      "Не задан ключ API, задайте его через команду -t [API_KEY]"
    );
  }

  const { data } = await axios.get(
    "https://api.openweathermap.org/data/2.5/weather",
    {
      params: {
        lat: lat,
        lon: lon,
        appid: token,
        lang: "ru",
        units: "metric",
      },
    }
  );
  return data;
};

const getGeocoding = async (city) => {
  const token =
    process.env.TOKEN ?? (await getKeyValue(TOKEN_DICTIONARY.token));
  if (!token) {
    throw new Error(
      "Не задан ключ API, задайте его через команду -t [API_KEY]"
    );
  }
  const { data } = await axios.get(
    "https://api.openweathermap.org/geo/1.0/direct",
    {
      params: {
        q: city,
        appid: token,
      },
    }
  );
  return data;
};

export { getGeocoding, getWeather, getIcon };
