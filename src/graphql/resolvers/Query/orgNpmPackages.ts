import * as util from 'util';
const exec = util.promisify(require('child_process').exec);

export const orgNpmPackages = async () => {
  const { stdout } = await exec('npm access ls-packages');
  return Object.keys(JSON.parse(stdout)).reduce((memo, name) => {
    return [...memo, { name, url: `https://www.npmjs.com/package/${name}` }];
  }, []);
};
