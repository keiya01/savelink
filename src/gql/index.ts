import { gql } from "apollo-server-hapi";
import post from "./post";
import user from "./user";
import folder from "./folder";

export const typeDefs = gql`
  type Query {
    # post
    posts(page: Int!): [Post]
    post(id: ID!): Post
    postsForUser(user_id: ID!, page: Int!): [Post]
    # user
    user(id: ID): User
    # folder
    folders(user_id: ID, page: Int!): [Folder]
  }

  type Mutation {
    # post
    createPost(urls: [String]!, user_id: ID!, comment: String): Post
    updatePost(id: ID!, comment: String!): Post
    deletePost(id: ID!): Post
    # user
    createUser(username: String!, email: String!, token_id: String): User
    loginUser(email: String!, token_id: String): User
    updateUser(id: ID!, username: String!, email: String!): User
    # folder
    createFolder(name: String!, user_id: ID!): Folder
    saveFolder(post_id: ID, folder_id: ID): PostFolder
    changeFolder(post_folder_id: ID!, destination_folder_id: ID!): Boolean
    deleteFromFolder(post_folder_id: ID): Boolean
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
