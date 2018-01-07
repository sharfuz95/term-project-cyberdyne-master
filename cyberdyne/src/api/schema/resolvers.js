import { mergeResolvers } from 'merge-graphql-schemas';
import { PubSub } from 'graphql-subscriptions';

import { GraphQLDate, GraphQLTime, GraphQLDateTime } from './scalars';
import userResolver from './resolvers/userResolver';
import walletResolver from './resolvers/walletResolver';
import betResolver from './resolvers/betResolver';

export const pubsub = new PubSub();

const scalarResolvers = {
  Date: GraphQLDate,
  Time: GraphQLTime,
  DateTime: GraphQLDateTime,
  // GraphQL Subscription type definition resolvers

  /*
  Mutation: {
    deleteUser: (parent, args, { models }) => models.User.destroy({ where: args }),
    createUser: async (parent, args, { models }) => {
      const user = args;
      user.password = 'idk';
      const userAdded = await models.User.create(user);
      pubsub.publish(USER_ADDED, {
        userAdded,
      });
      return userAdded;
    },
    register: async (parent, args, { models }) => {
      const user = _.pick(args, ['username', 'isAdmin']);
      const localAuth = _.pick(args, ['email', 'password']);
      const passwordPromise = bcrypt.hash(localAuth.password, 12);
      const createUserPromise = models.User.create(user);
      const [password, createdUser] = await Promise.all([passwordPromise, createUserPromise]);
      localAuth.password = password;
      return models.LocalAuth.create({
        ...localAuth,
        user_id: createdUser.id,
      });
    },
    login: async (parent, { email, password }, { models, SECRET }) =>
      tryLogin(email, password, models, SECRET),
    refreshTokens: (parent, { token, refreshToken }, { models, SECRET }) =>
      refreshTokens(token, refreshToken, models, SECRET),
  },
  },
  */
};

const resolvers = [scalarResolvers, userResolver, walletResolver, betResolver];

export default mergeResolvers(resolvers);
