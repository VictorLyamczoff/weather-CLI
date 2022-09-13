#!/usr/bin/env node
import { getArgs } from "./helpers/args.js";
import { getGeocoding, getWeather, getIcon } from "./services/api.service.js";
import {
  printError,
  printSuccess,
  printHelp,
  printWeather,
} from "./services/log.service.js";
import {
  saveKeyValue,
  TOKEN_DICTIONARY,
  LATITUDE_LONGITUDE_DICTIONARY,
} from "./services/storage.service.js";

const saveToken = async (token) => {
  if (!token.length) {
    printError("Не передан токен");
    return;
  }
  try {
    await saveKeyValue(TOKEN_DICTIONARY.token, token);
    printSuccess("Токен сохранён");
  } catch (e) {
    printError(e.message);
  }
};

const saveCity = async (city) => {
  if (!city.length) {
    printError("Не передан город");
    return;
  }
  try {
    const data = await getGeocoding(city);
    if (!data[0]) {
      throw new Error("Неверно указан город");
    } else {
      await saveKeyValue(TOKEN_DICTIONARY.city, data[0].local_names.en);
      await saveKeyValue(LATITUDE_LONGITUDE_DICTIONARY.lat, data[0].lat);
      await saveKeyValue(LATITUDE_LONGITUDE_DICTIONARY.lon, data[0].lon);
      printSuccess(`Город ${data[0].local_names.ru} сохранен`);
    }
  } catch (e) {
    printError(e.message);
  }
};

const getForecast = async () => {
  try {
    const weather = await getWeather();
    printWeather(weather, getIcon(weather.weather[0].icon));
    // const geoCod = await getGeocoding(process.env.CITY);
    // console.log(geoCod[0].lat);
  } catch (e) {
    if (e?.response?.status == 404) {
      printError("Неверно указан город");
    } else if (e?.response?.status == 401) {
      printError("Неверно указан токен");
    } else {
      printError(e.message);
    }
  }
};

const initCLI = () => {
  const args = getArgs(process.argv);
  if (args.h) {
    printHelp();
    return;
  }
  if (args.s) {
    return saveCity(args.s);
    return;
  }
  if (args.t) {
    return saveToken(args.t);
    return;
  }
  getForecast();
};

initCLI();
