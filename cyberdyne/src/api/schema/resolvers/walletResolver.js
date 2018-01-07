/* eslint-disable max-len */

import { requiresAdmin } from '../../auth/permissions';

const uuidv4 = require('uuid/v4');

export default {
  Wallet: {
    // Todo: Add fields to schema for reverse relationships and their resolvers here. Ie relashionships to bets, etc.
    userId: ({ userId }, args, { models }) =>
      models.User.findOne({
        where: {
          id: userId,
        },
      }),
  },
  Query: {
    myWallet: async (parent, args, { models, user }) =>
      models.Wallet.findOne({
        where: {
          realUserId: user.id,
        },
      }),
    allWallets: (parent, args, { models }) => models.Wallet.findAll(),
    getUserWallet: (parent, args, { models }) =>
      models.Wallet.findOne({
        where: {
          realUserId: args.userId,
        },
      }),
  },
  Mutation: {
    createWallet: async (parent, args, { models, user }) => {
      const newWallet = args;
      newWallet.user_id = user.id;
      newWallet.name = uuidv4();
      const wallet = await models.Wallet.create(newWallet);
      return wallet;
    },
    credit: async (parent, args, { models, user }) => {
      const prior = await models.Wallet.findOne({
        where: {
          realUserId: user.id,
        },
      });
      const priorBalance = prior.balance;
      const newBalance = priorBalance + args.credit;
      const updatedWallet = await models.Wallet.update(
        { balance: newBalance },
        {
          where: {
            realUserId: user.id,
          },
        },
      );
      return prior;
    },
    debit: async (parent, args, { models, user }) => {
      const prior = await models.Wallet.findOne({
        where: {
          realUserId: user.id,
        },
      });
      const priorBalance = prior.balance;
      const newBalance = priorBalance - args.debit;
      const updatedWallet = await models.Wallet.update(
        { balance: newBalance },
        {
          where: {
            realUserId: user.id,
          },
        },
      );
      return prior;
    },
  },
};
