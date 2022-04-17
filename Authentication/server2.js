import { ApolloServer } from "apollo-server-express";
import typeDefs from "./typeDefs.js";
import resolvers from "./resolvers.js";
import jwt from "jsonwebtoken";
import { createServer } from "http";
import express from "express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { makeExecutableSchema } from "@graphql-tools/schema";

// create express and HTTP server
const app = express();
const httpServer = createServer(app);

// create websocket server
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});

const context = ({req}) => {
  const { authorization } = req.headers;
  if (authorization) {
    const { userId } = jwt.verify(authorization, process.env.JWT_SECRET);
    return { userId };
  }
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

// Save the returned server's info so we can shut down this server later
const serverCleanup = useServer({ schema }, wsServer);

// create apollo server
const apolloServer = new ApolloServer({
  schema,
  context,
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

await apolloServer.start();
apolloServer.applyMiddleware({ app, path: "/graphql" });

httpServer.listen(4000);
