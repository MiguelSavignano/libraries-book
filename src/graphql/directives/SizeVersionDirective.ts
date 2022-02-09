import { SchemaDirectiveVisitor } from 'apollo-server';
import { GraphQLField } from 'graphql';
import { defaultFieldResolver } from 'graphql';

export const versionSize = (version: string) => {
  return version
    .split('.')
    .map((n) => +n + 100000)
    .join('.');
};
const cleanVersion = (version: string) => version.replace(/(v|\~|\^)/g, '');

export class SizeVersionDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: GraphQLField<any, any>) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function (...args) {
      const result = await resolve.apply(this, args);
      return result && versionSize(cleanVersion(result));
    };
  }
}
