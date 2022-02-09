import { Octokit } from '@octokit/rest';
import { graphqlPaginate } from '../plugins/paginate';
import { withCache } from '../plugins/withCache';

interface IFileContent {
  text: string;
  isTruncated: boolean;
  oid: string;
}
export interface IRepository {
  name: string;
  packageJSON?: IFileContent;
  packageLockJSON?: IFileContent;
  yarnLock?: IFileContent;
  gemfileLock?: IFileContent;
}

interface IFetchAllPacakgesVersions {
  organization: {
    repositories: {
      nodes: Array<IRepository>;
    };
  };
}

const QUERY = `
query fetchAllPacakgesVersions($login: String!, $cursor: String) {
  organization(login: $login) {
    repositories(first: 50, after: $cursor) {
      pageInfo {
        endCursor
        hasNextPage
      }
      nodes {
        name
        packageJSON: object(expression: "master:package.json") {
          ... on Blob {
            oid
            text
          }
        }
        yarnLock: object(expression: "master:yarn.lock") {
          ... on Blob {
            oid
            isTruncated
            text
          }
        }
        gemfileLock: object(expression: "master:Gemfile.lock") {
          ... on Blob {
            oid
            isTruncated
            text
          }
        }
      }
    }
  }
}
`;

interface IGithubOptions {
  login: string;
  token: string;
}

export async function fetchAllPacakgesVersions({
  login,
  token,
}: IGithubOptions): Promise<IFetchAllPacakgesVersions> {
  const headers = { authorization: `token ${token}` };
  const data = await graphqlPaginate(
    QUERY,
    { login, headers },
    { nodesPath: 'organization.repositories' },
  );

  return data;
}

const fetchFileContent = async ({ octokit, owner, repo, file_sha }) => {
  try {
    const {
      data: { content },
    } = await octokit.request(`GET /repos/:owner/:repo/git/blobs/:file_sha`, {
      owner,
      repo,
      file_sha,
    });
    return Buffer.from(content, 'base64').toString('utf-8');
  } catch (e) {
    console.log({ owner, repo, file_sha });
    throw e;
  }
};

export async function completeTruncateFiles(
  data: IFetchAllPacakgesVersions,
  options: IGithubOptions,
): Promise<IFetchAllPacakgesVersions> {
  const octokit = new Octokit({
    auth: options.token,
  });
  const repoNodes = data.organization.repositories.nodes;

  data.organization.repositories.nodes = await Promise.all(
    repoNodes.map(async (repoNode) => {
      const key = 'packageLockJSON';
      if (repoNode[key] && repoNode[key].isTruncated) {
        console.log('isTruncated', repoNode.name);
        const fileContent = await fetchFileContent({
          octokit,
          owner: options.login,
          repo: repoNode.name,
          file_sha: repoNode[key].oid,
        });
        repoNode[key].text = fileContent;
      }
      return repoNode;
    }),
  );

  return data;
}

export async function fetchAllPacakgesVersionsWithCache(
  options: IGithubOptions,
): Promise<IFetchAllPacakgesVersions> {
  const data = await withCache('Githubv4FetchAllPacakgesVersions', () =>
    fetchAllPacakgesVersions(options),
  );

  return withCache('fetchAllPacakgesVersions', () =>
    completeTruncateFiles(data, options),
  );
}
