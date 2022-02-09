import * as fs from "fs";

const ensureCacheDir = () => {
  fs.existsSync(".cache") || fs.mkdirSync(".cache");
};

const writeCacheFile = (name, result) => {
  ensureCacheDir();
  fs.writeFileSync(`.cache/${name}.json`, JSON.stringify(result, null, 2));
};

const readCacheFile = (name) =>
  JSON.parse(fs.readFileSync(`.cache/${name}.json`, { encoding: "utf-8" }));

export const withCache = async (
  name = "data.json",
  callback: () => Promise<any>
) => {
  if (fs.existsSync(`.cache/${name}.json`)) {
    return readCacheFile(name);
  }
  const result = await callback();
  writeCacheFile(name, result);
  return result;
};
