import {
  fetchAllPacakgesVersionsWithCache,
  IRepository,
} from '../../../data-sources/github/fetchAllPacakgesVersions';

export const filterWithPackageJson = (repo: IRepository) =>
  repo.packageJSON && repo.packageJSON.text;

export const filterWithGemfileLock = (repo: IRepository) =>
  repo.gemfileLock && repo.gemfileLock.text;

export const repositories = async () => {
  const result = await fetchAllPacakgesVersionsWithCache({
    login: process.env.GITHUB_LOGIN,
    token: process.env.GITHUB_TOKEN,
  });

  const repositories = result.organization.repositories.nodes;

  return repositories;
};
