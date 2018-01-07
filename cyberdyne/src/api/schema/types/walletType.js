export default `
  type Wallet {
    id: Int!
    userId: Int!
    realUserId: Int!
    balance: Int!
    deletedAt: DateTime
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Query {
    # admin queries
    allWallets: [Wallet]!
    getUserWallet: Wallet

    # public queries
    myWallet: Wallet!
  }

  type Mutation {
    createWallet: Wallet!
    credit(credit: Int!): Wallet!
    debit(debit: Int!): Wallet!
  }
`;
