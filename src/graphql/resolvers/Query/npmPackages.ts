import * as allPackages from '../../../data-sources/npmPacakges/allPackages.json';

export const npmPackages = (): Array<{ name: string }> => allPackages;
