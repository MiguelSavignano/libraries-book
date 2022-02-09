import { get, pickBy, identity } from 'lodash';

interface IPackageLock {
  dependencies: object;
}

export class PackageLockAdapter {
  packageLock: any;
  constructor({
    text = null,
    obj = null,
  }: {
    text?: string;
    obj?: IPackageLock;
  }) {
    this.packageLock = obj || this.parse(text);
  }

  private parse(text: string) {
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  public getVersion(packageName: string): string {
    if (!this.packageLock) return null;

    const rootVersion = get(
      this.packageLock,
      `dependencies.${packageName}.version`,
      null,
    );

    if (!rootVersion) {
      return rootVersion;
    }

    let isRootVersionUsed = false;

    const versions = Object.keys(this.packageLock.dependencies)
      .map((dep) => {
        const isRequired = get(
          this.packageLock,
          `dependencies.${dep}.requires.${packageName}`,
          null,
        );

        if (!isRequired) {
          return null;
        }

        const innerVersion = get(
          this.packageLock,
          `dependencies.${dep}.dependencies.${packageName}.version`,
          null,
        );

        if (!innerVersion) {
          isRootVersionUsed = true;
        }

        return {
          host: dep,
          version: innerVersion || rootVersion,
        };
      })
      .filter((item) => item);

    if (!isRootVersionUsed) {
      versions.push({
        host: '<root>',
        version: rootVersion,
      });
    }

    return versions
      .map(({ host, version }) => `${version} for ${host}`)
      .join(',');
  }
}
