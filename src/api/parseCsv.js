import { API } from "./config.js";
import { postJson } from "./utils.js";

export const parseCsv = async (csvText) => {
  return postJson(API.parseCsv, { csvText });
};
