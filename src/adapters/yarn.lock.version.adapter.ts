import * as parseYarnLock from '@yarnpkg/lockfile';

export class YarnLockAdapter {
  private REGEXP = /^(.+)\@(.+)$/;
  yarnLockFile: any;

  constructor({ text = null, obj = null }: { text?: string; obj?: any }) {
    this.yarnLockFile = obj || this.parse(text);
  }

  private parse(yarnLockText: string) {
    return parseYarnLock.parse(yarnLockText);
  }

  public getVersion(packageName: string): string[] {
    const doc = this.yarnLockFile;
    if (doc.type !== 'success') {
      return null;
    }

    const dependencies = Object.keys(doc.object);

    const versionHash = dependencies.reduce((acc, dep) => {
      const [full, depName, depVersion] = dep.match(this.REGEXP);

      if (depName === packageName) {
        acc[depVersion] = doc.object[dep].version;
      }

      return acc;
    }, {});

    const versionUsed = [];

    const versions = dependencies
      .map((dep) => {
        const requiredVersion =
          doc.object[dep].dependencies &&
          doc.object[dep].dependencies[packageName];

        if (!requiredVersion) {
          return null;
        }

        const version = versionHash[requiredVersion];

        versionUsed.push(version);

        return {
          host: dep,
          version,
        };
      })
      .filter((x) => x);

    const versionsUnusedInDeps = Object.values(versionHash).filter(
      (v) => !versionUsed.includes(v),
    );
    const allVersions = [
      ...versions,
      ...versionsUnusedInDeps.map((version) => ({
        host: '<root>',
        version,
      })),
    ];

    return allVersions.map(({ host, version }) => `${version} for ${host}`);
  }
}
