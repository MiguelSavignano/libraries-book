import { get, pickBy } from 'lodash';

interface IPackageJSON {
  dependencies?: object;
}

export class PackageJSONAdapter {
  packageJSON: any;
  text?: string;
  constructor({ text = null, obj = null }: { text?: string; obj?: any }) {
    this.text = text;
    this.packageJSON = obj || this.parse();
  }

  static parse(text: string) {
    return JSON.parse(text);
  }

  parse() {
    return PackageJSONAdapter.parse(this.text);
  }

  getVersion(packageName: string): string {
    if (!this.packageJSON) return null;

    const version = get(this.packageJSON, `dependencies.${packageName}`);
    if (!version) return null;

    if (!/git/.test(version)) {
      return version;
    }

    return version.split('#')[1] || null;
  }

  getVersions(packageNames: string[]) {
    if (!this.packageJSON) return null;
    if (!this.packageJSON.dependencies) return null;

    return pickBy(this.packageJSON.dependencies, (_value: any, key: string) => {
      return packageNames.includes(key);
    });
  }
}
