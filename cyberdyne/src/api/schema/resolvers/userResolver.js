import bcrypt from 'bcrypt';
// import _ from 'lodash';

// import { requiresAuth } from '../../auth/permissions';
import { refreshTokens, tryLogin } from '../../auth';
import { pubsub } from '../resolvers';

const USER_ADDED = 'USER_ADDED';
const uuidv4 = require('uuid/v4');

export default {
  User: {
    // Todo: Add fields to schema for reverse relationships and their resolvers here
  },
  Query: {
    // allUsers: requiresAuth.createResolver((parent, args, { models }) => models.User.findAll()),
    allUsers: (parent, args, { models }) => models.User.findAll(),
    me: (parent, args, { models, user }) => {
      if (user) {
        // they are logged in
        return models.User.findOne({
          where: {
            id: user.id,
          },
        });
      }
      // not logged in user
      return null;
    },
    /* // for authenticated requests
    getUser: requiresAuth.createResolver((parent, { user }, { models }) =>
      models.User.findOne({
        where: {
          id: user.id,
        },
      }),
    ),
    */
    getUser: (parent, { user }, { models }) =>
      models.User.findOne({
        where: {
          id: user.id,
        },
      }),
  },
  Mutation: {
    createUser: async (parent, args, { models }) => {
      const user = args;
      user.password = 'idkmybffjill';
      const userAdded = await models.User.create(user);
      pubsub.publish(USER_ADDED, {
        userAdded,
      });
      return user;
    },
    register: async (parent, args, { models }) => {
      const user = args.user;
      user.password = await bcrypt.hash(user.password, 12);

      const retUser = await models.User.create(user);

      const newWallet = args;
      newWallet.realUserId = retUser.id;
      newWallet.name = uuidv4();
      await models.Wallet.create(newWallet);

      return retUser; // models.User.create(user);
    },
    login: async (parent, { email, password }, { models, SECRET }) =>
      tryLogin(email, password, models, SECRET),
    refreshTokens: (parent, { token, refreshToken }, { models, SECRET }) =>
      refreshTokens(token, refreshToken, models, SECRET),
    setBio: async (parent, args, { models, user }) => {
      const updatedUser = await models.User.update(
        { bio: args.bio },
        {
          where: {
            id: user.id,
          },
        },
      );
      return updatedUser;
    },
  },
  Subscription: {
    userAdded: {
      subscribe: () => pubsub.asyncIterator(USER_ADDED),
    },
  },
};
