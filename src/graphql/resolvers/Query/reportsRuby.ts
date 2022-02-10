import { repositories, filterWithGemfileLock } from './repositories';
import * as gemfile from 'gemfile';
import { get } from 'lodash';

const allGems: Array<{
  name: string;
}> = require('../../../data-sources/gemSource/allGems.json');

const allGems = [...allGems];

export const reportsRuby = async (obj, args, context, info) => {
  const repositoriesData = (await repositories()).filter(filterWithGemfileLock);

  return allGems.map(({ name }) => {
    const data = repositoriesData.map((repo) => {
      const gemfileLock = gemfile.interpret(repo.gemfileLock.text);
      const version = get(gemfileLock, `GEM.specs.${name}.version`);

      return {
        repository: repo.name,
        gem: name,
        gemfileLock: version,
        versionSize: version,
      };
    });
    return {
      name: name,
      repositories: data.filter((it) => it.gemfileLock),
    };
  });
};
