import { graphql } from '@octokit/graphql';
import { get } from 'lodash';

export async function graphqlPaginate(
  query = '',
  variables = {},
  { nodesPath },
  data = null,
) {
  const result: any = await graphql(query, variables);
  const previousNodes = data ? get(data, nodesPath).nodes : [];
  if (!data) {
    data = result;
  }

  data.organization.repositories.nodes = [
    ...previousNodes,
    ...get(result, nodesPath).nodes,
  ];

  console.log('Call page total', get(data, nodesPath).nodes.length);
  if (get(result, nodesPath).pageInfo.hasNextPage) {
    await graphqlPaginate(
      query,
      {
        ...variables,
        cursor: get(result, nodesPath).pageInfo.endCursor,
      },
      { nodesPath },
      data,
    );
  }

  return data;
}
