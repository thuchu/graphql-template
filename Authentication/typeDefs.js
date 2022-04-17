import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Query {
    users: [UserType]
    messageByUser(receiverId: Int!): [MessageType]
  }

  input UserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  input UserSigninInput {
    email: String!
    password: String!
  }

  type Token {
    token: String!
  }

  type Mutation {
    signupUser(newUser: UserInput!): UserType
    signinUser(userSignin: UserSigninInput!): Token
    createMessage(receiverId: Int!, message: String!): MessageType
  }

  scalar Date

  type MessageType {
    id: ID!
    text: String!
    receiverId: Int!
    senderId: Int
    createdAt: Date!
  }

  type UserType {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
  }

  type Subscription {
    messageAdded: MessageType
  }
`;

export default typeDefs;
