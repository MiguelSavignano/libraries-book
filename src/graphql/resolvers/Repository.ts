import { get } from 'lodash';
import { IRepository } from '../../data-sources/github/fetchAllPacakgesVersions';
import { PackageJSONAdapter } from '../../adapters/package.json.adapter';
import { PackageLockAdapter } from '../../adapters/package.lock.adapter';
import * as gemfile from 'gemfile';

export const Repository = {
  name(repository: IRepository, args, context) {
    return repository.name;
  },
  async packageJSON(repository: IRepository, args, context, info) {
    return JSON.parse(repository.packageJSON.text);
  },
  async packageJSONVersion(
    repository: IRepository,
    { packageName }: { packageName: string },
  ) {
    const adapter = new PackageJSONAdapter({
      text: repository.packageJSON.text,
    });
    return adapter.getVersion(packageName);
  },
  async packageLockVersion(
    repository: IRepository,
    { packageName }: { packageName: string },
  ) {
    const packageLockAdapter = new PackageLockAdapter({
      text: get(repository, 'packageLockJSON.text'),
    });
    return packageLockAdapter.getVersion(packageName);
  },
  async gemfileLockVersion(
    repository: IRepository,
    { gemName }: { gemName: string },
  ) {
    if (!repository.gemfileLock) return null;

    const gemfileLock = gemfile.interpret(repository.gemfileLock.text);

    return get(gemfileLock, `GEM.specs.${gemName}.version`);
  },
};
