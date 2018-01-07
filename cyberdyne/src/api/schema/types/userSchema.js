export default `
  type User {
    id: Int!
    name: String!
    email: String!
    displayName: String
    location: String
    bio: String
    isAdmin: Boolean
    isActive: Boolean
    deletedAt: DateTime
    createdAt: DateTime
    updatedAt: DateTime
  }

  input UserRegisterInput {
    name: String!
    email: String!
    password: String!
    isAdmin: Boolean
    isActive: Boolean
  }

  type AuthPayload {
    token: String!
    refreshToken: String!
  }

  type Query {
    # Return the user
    me: User

    # Return list of all Users
    allUsers: [User!]!
    getUser(id: Int, email: String, limit: Int, offset: Int): User
  }

  type Subscription {
    userAdded: User!
  }

  type Mutation {
    register(user: UserRegisterInput!): User
    login(email: String!, password: String!): AuthPayload!
    createUser(username: String!): User
    refreshTokens(token: String!, refreshToken: String!): AuthPayload!
    setBio(bio: String!): User
  }
`;
