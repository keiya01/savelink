import { gql } from "apollo-server-hapi";
import post from "./post";
import user from "./user";
import folder from "./folder";

export const typeDefs = gql`
  type Query {
    # post
    posts: [Post]
    post(id: ID): Post
    # user
    user(id: ID): User
  }

  type Mutation {
    # post
    createPost(uri: String!, user_id: ID!, comment: String): Post
    updatePost(id: ID!, uri: String!, comment: String!): Post
    deletePost(id: ID!): Post
    # user
    createUser(username: String!, email: String!, token_id: String): User
    loginUser(email: String!, token_id: String): User
    updateUser(id: ID!, username: String!, email: String!): User
    # folder
    createFolder(name: String!, user_id: ID!): Folder
  }
  
  ${post.typeDef}
  ${user.typeDefs}
  ${folder.typeDefs}
`;

export const resolvers = {
  Query: {
    ...post.resolvers.Query,
    ...user.resolvers.Query,
    ...folder.resolvers.Query
  },
  Mutation: {
    ...post.resolvers.Mutation,
    ...user.resolvers.Mutation,
    ...folder.resolvers.Mutation
  },
}
