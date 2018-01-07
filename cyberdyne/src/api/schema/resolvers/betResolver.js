export default {
  Bet: {
    // Todo: Add fields to schema for reverse relationships and their resolvers here
    user: ({ id }, args, { models }) => models.User.findById(id.userId),
  },
  Query: {
    getBets: (parent, args, { models }) => models.Bet.findAll(),
    getSingleBet: async (parent, args, { models }) => {
      const bet = await models.Bet.findOne({
        where: {
          id: args.id,
        },
      });
      return bet;
    },
    getUserBets: async (parent, args, { models, user }) => {
      const theUser = await models.Bet.findAll({
        where: {
          user_id: user.id,
        },
      });

      return theUser;
    },
  },
  Mutation: {
    addBet: async (parent, args, { models, user }) => {
      const newBet = args;
      newBet.user_id = user.id;
      newBet.wager = args.wager;
      newBet.week = args.week;
      newBet.teamBet = args.teamBet;
      newBet.isWin = args.isWin;
      const bet = await models.Bet.create(newBet);
      return bet;
    },
    removeBet: async (parent, args, { models }) => {
      await models.Bet.destroy({
        where: {
          id: args.id,
        },
      });
    },
    setWin: async (parent, args, { models }) => {
      const bet = await models.Bet.update(
        { isWin: args.isWin },
        {
          where: {
            id: args.id,
          },
        },
      );
      const test = await models.Bet.findOne({
        where: {
          id: args.id,
        },
      });
      return test;
    },
  },
};
