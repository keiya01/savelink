import { gql } from "apollo-server-hapi";
import post from "./post";

export const typeDefs = gql`
  type Query {
    posts: [Post]
    post(id: ID): Post
  }

  type Mutation {
    createPost(uri: String!, comment: String): Post
    updatePost(id: ID!, uri: String, comment: String): Post
    deletePost(id: ID!): Post
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
