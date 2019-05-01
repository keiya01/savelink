import { gql } from "apollo-server-hapi";
import post from "./modules/post";

export const typeDefs = gql`
  ${post.typeDef}

  type Query {
    posts: [Post]
  }
`;

export const resolvers = {
  Query: {
    ...post.resolvers.Query
  }
}
