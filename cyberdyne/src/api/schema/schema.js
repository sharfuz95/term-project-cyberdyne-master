/**
 * Exports a string literal containing the GraphQL schema definition using the GraphQL DSL.
 * This temporary version removes all object types except user and removes user's associated
 * object types in field definition, in order to test the login, createUser, and register
 * workflow
 */
import { mergeTypes } from 'merge-graphql-schemas';
import userType from './types/userSchema';
import walletType from './types/walletType';
import betType from './types/betType';

const typeDefs = `

scalar DateTime
scalar Date
scalar Time

schema {
  query: Query
  mutation: Mutation
  subscription: Subscription
}

`;

const types = [typeDefs, userType, walletType, betType];

export default mergeTypes(types);
