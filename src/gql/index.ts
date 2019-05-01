import { gql } from "apollo-server-hapi";
import post from "./modules/post";

export const typeDefs = gql`
  type Query {
    posts: [Post]
  }

  type Mutation {
    createPost(uri: String!, comment: String): Post
  }
  
  ${post.typeDef}
`;

export const resolvers = {
  Query: {
    ...post.resolvers.Query
  },
  Mutation: {
    ...post.resolvers.Mutation
  }
}