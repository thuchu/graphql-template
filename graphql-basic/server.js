import { ApolloServer, gql } from "apollo-server";
import crypto from "crypto";

const users = [
  {
    id: "abc",
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@example.com",
    password: "123456",
  },
  {
    id: "abc2",
    firstName: "Jane",
    lastName: "Doe",
    email: "janedoe@example.com",
    password: "123456",
  },
];

const Todos = [
  {
    title: "Learn GraphQL",
    by: "abc",
  },
  {
    title: "Learn React",
    by: "abc2",
  },
  {
    title: "Learn Node",
    by: "abc2",
  },
];

const typeDefs = gql`
  type Query {
    users: [UserType]
    user(id: ID!): UserType
  }

  input UserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  type Mutation {
    createUser(newUser: UserInput!): UserType
  }

  type UserType {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    todos: [Todo]
  }

  type Todo {
    title: String!
    by: ID!
  }
`;

const resolvers = {
  Query: {
    users: () => users,
    user: (parent, args, context) => {
      console.log(context);
      if (context.userLoggedIn === false) {
        throw new Error("You are not logged in");
      }
      return users.find((user) => user.id == args.id);
    },
  },
  UserType: {
    todos: (parent, args, context) => {
      // console.log(parent);
      return Todos.filter((todo) => todo.by == parent.id);
    },
  },
  Mutation: {
    createUser: (parent, { newUser }, context) => {
      console.log(newUser);
      const user = {
        id: crypto.randomUUID(),
        ...newUser,
      };
      users.push(user);
      return user;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: { userLoggedIn: true },
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
