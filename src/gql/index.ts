import { gql } from "apollo-server-hapi";
import post from "./post";
import user from "./user";

export const typeDefs = gql`
  type Query {
    posts: [Post]
    post(id: ID): Post
    user(id: ID): User
  }

  type Mutation {
    createPost(uri: String!, comment: String): Post
    updatePost(id: ID!, uri: String!, comment: String!): Post
    deletePost(id: ID!): Post
    createUser(username: String!, email: String!, token_id: String): User
    loginUser(email: String!, token_id: String): User
    updateUser(id: ID!, username: String!, email: String!): User
  }
  
  ${post.typeDef}
  ${user.typeDefs}
`;

export const resolvers = {
  Query: {
    ...post.resolvers.Query,
    ...user.resolvers.Query
  },
  Mutation: {
    ...post.resolvers.Mutation,
    ...user.resolvers.Mutation
  },
}
