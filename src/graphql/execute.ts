import { server } from './server';
const { createTestClient } = require('apollo-server-testing');

const { query } = createTestClient(server);

export async function executeQuery(QUERY = '', variables = {}) {
  return query({ query: QUERY, variables });
}
