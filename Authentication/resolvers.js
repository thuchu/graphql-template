import pc from "@prisma/client";
import bcrypt from "bcryptjs";
import { AuthenticationError, ForbiddenError } from "apollo-server-express";
import jwt from "jsonwebtoken";
import { PubSub } from "graphql-subscriptions";

const prisma = new pc.PrismaClient();
const pubsub = new PubSub();
const MESSAGE_ADDED = "MESSAGE_ADDED";

console.log(process.env.JWT_SECRET);

const resolvers = {
  Query: {
    users: async (_, argsm, { userId }) => {
      console.log('userId',userId);
      if (!userId) {
        throw new ForbiddenError("You must be logged in");
      }
      const users = await prisma.user.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          id: {
            not: userId,
          },
        },
      });
      return users;
    },
    messageByUser: async (_, args, { userId }) => {
      if (!userId) {
        throw new ForbiddenError("You must be logged in");
      }
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { receiverId: args.receiverId, senderId: userId },
            { receiverId: userId, senderId: args.receiverId },
          ],
        },
        orderBy: {
          createdAt: "asc",
        },
      });
      return messages;
    },
  },
  Mutation: {
    signupUser: async (_, { newUser }) => {
      const user = await prisma.user.findUnique({
        where: { email: newUser.email },
      });

      console.log('user', user);

      if (user) {
        throw new AuthenticationError("User already exists");
      }

      const hashedPassword = await bcrypt.hash(newUser.password, 10);
      const createdUser = await prisma.user.create({
        data: {
          ...newUser,
          password: hashedPassword,
        },
      });
      return createdUser;
    },
    signinUser: async (_, { userSignin }) => {
      const user = await prisma.user.findUnique({
        where: { email: userSignin.email },
      });

      if (!user) {
        throw new AuthenticationError("User not found");
      }

      const isValidPassword = await bcrypt.compare(
        userSignin.password,
        user.password
      );

      if (!isValidPassword) {
        throw new AuthenticationError("Invalid password");
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

      return { token };
    },
    createMessage: async (_, { receiverId, message }, { userId }) => {
      if (!userId) {
        throw new ForbiddenError("You must be logged in");
      }

      console.log(receiverId, message, userId);

      const createdMessage = await prisma.message.create({
        data: {
          receiverId,
          text: message,
          senderId: userId,
        },
      });
      pubsub.publish(MESSAGE_ADDED, { messageAdded: createdMessage });
      return createdMessage;
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: () => pubsub.asyncIterator(MESSAGE_ADDED),
    },
  },
};

export default resolvers;
