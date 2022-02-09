require('dotenv').config();
import * as gemfile from 'gemfile';
import * as fs from 'fs-extra';
import { fetchAllPacakgesVersionsWithCache } from '../data-sources/github/fetchAllPacakgesVersions';

async function run() {
  const {
    organization: {
      repositories: { nodes },
    },
  } = await fetchAllPacakgesVersionsWithCache({
    login: process.env.GITHUB_LOGIN,
    token: process.env.GITHUB_TOKEN,
  });
  const repositories = nodes.map((repo) => {
    if (repo.packageJSON) {
      repo.packageJSON = JSON.parse(repo.packageJSON.text);
    }
    if (repo.packageLockJSON) {
      repo.packageLockJSON = JSON.parse(repo.packageLockJSON.text);
    }
    if (repo.gemfileLock) {
      repo.gemfileLock = gemfile.interpret(repo.gemfileLock.text);
    }
    return repo;
  });

  fs.outputFileSync(
    '.cache/allPackages.json',
    JSON.stringify(repositories, null, 2),
  );
}

run();
