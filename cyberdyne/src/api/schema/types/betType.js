export default `
  type Bet {
    id: Int!
    user: User
    wager: Float!
    week: String!
    teamBet: String!
    isWin: Int!
  }

  type Query {
    getBets: [Bet]!
    getSingleBet(id: Int!): Bet
    getUserBets: [Bet]!

  }

   type Mutation {
    addBet(wager: Float!, week: String!, teamBet: String!, isWin: Int!): Bet
    setWin(isWin: Int!, id: Int!): Bet
    removeBet(id: Int!): [Bet]
   }
`;
