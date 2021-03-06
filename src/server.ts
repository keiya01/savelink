import { ApolloServer } from "apollo-server-hapi";
import { typeDefs, resolvers } from "./gql";
const Hapi = require('hapi');

export const start = async () => {

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

  console.log('Server running on %s', app.info.uri);
}
