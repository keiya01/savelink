'use strict';
import { ApolloServer, gql } from "apollo-server-hapi";
const Hapi = require('hapi');

export const start = async () => {
  const typeDefs = gql`
    type Post {
      id: int
      uri: string
      comment: string
    }

    type Query {
      posts: [Post]

    }
  `;

  const resolvers = {
    Query: {
      posts: () => []
    }
  }

  const server = new ApolloServer({
    typeDefs,
    resolvers
  });

  const app = new Hapi.server({
    port: 3000,
  });

  await server.applyMiddleware({
    app
  });

  await server.installSubscriptionHandlers(app.listener);

  try{
    await app.start();
  } catch(err) {
    console.error(err);
  }

  console.log('Server running on %ss', app.info.uri);
}
