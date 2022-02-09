import { npmPackages } from './npmPackages';
import { repositories, filterWithPackageJson } from './repositories';
import { PackageLockAdapter } from '../../../adapters/package.lock.adapter';
import { PackageJSONAdapter } from '../../../adapters/package.json.adapter';

export const reportsNodejs = async (obj, args, context, info) => {
  const repositoriesData = (await repositories()).filter(filterWithPackageJson);

  return npmPackages().map(({ name: packageName }) => {
    const data = repositoriesData.map((repo) => {
      const version = new PackageJSONAdapter({
        text: repo.packageJSON.text,
      }).getVersion(packageName);
      const versionParsed = version ? version.replace(/(\^|\@|~|v)/g, '') : '';

      const [major, minor, patch] = versionParsed.split('.');

      return {
        repository: repo.name,
        package: packageName,
        versionSize: version,
        versionMin: [major, minor].join('.'),
        versionMax: [major].join('.'),
        version: versionParsed,
        packageJSON: version,
        packageLock:
          repo.packageLockJSON &&
          new PackageLockAdapter({
            text: repo.packageLockJSON.text,
          }).getVersion(packageName),
      };
    });
    return {
      name: packageName,
      repositories: data.filter((it) => it.packageJSON || it.packageLock),
    };
  });
};
