import { homedir } from "os";
import { promises } from "fs";
import {
  join,
  basename,
  dirname,
  extname,
  relative,
  isAbsolute,
  resolve,
  sep,
} from "path";

const filePath = join(homedir(), "weather-data.json");

const TOKEN_DICTIONARY = {
  token: "token",
  city: "city",
};

const LATITUDE_LONGITUDE_DICTIONARY = {
  lat: "lat",
  lon: "lon",
};

const saveKeyValue = async (key, value) => {
  //   console.log(basename(filePath));
  //   console.log(dirname(filePath));
  //   console.log(extname(filePath));
  //   console.log(relative(filePath, dirname(filePath)));
  //   console.log(isAbsolute(filePath));
  //   console.log(resolve(".."));
  //   console.log(sep);
  let data = {};

  if (await isExist(filePath)) {
    const file = await promises.readFile(filePath);
    data = JSON.parse(file);
  }

  data[key] = value;
  await promises.writeFile(filePath, JSON.stringify(data));
};

const getKeyValue = async (key) => {
  if (await isExist(filePath)) {
    const file = await promises.readFile(filePath);
    const data = JSON.parse(file);
    return data[key];
  }
  return undefined;
};

const isExist = async (path) => {
  try {
    await promises.stat(path);
    return true;
  } catch (e) {
    return false;
  }
};

export {
  saveKeyValue,
  getKeyValue,
  TOKEN_DICTIONARY,
  LATITUDE_LONGITUDE_DICTIONARY,
};
