import * as fs from 'fs';
import * as graphql from 'graphql';
import { ApolloServer, gql } from 'apollo-server';
import { resolvers } from './resolvers';
import { UpperCaseDirective } from './directives/UpperCaseDirective';
import { SizeVersionDirective } from './directives/SizeVersionDirective';
const schema = fs.readFileSync('./schema.graphql', { encoding: 'utf-8' });

export const server = new ApolloServer({
  typeDefs: gql(schema),
  resolvers,
  schemaDirectives: {
    upper: UpperCaseDirective,
    sizeVersion: SizeVersionDirective,
  },
});
