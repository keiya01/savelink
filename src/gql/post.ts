import postsHandler  from "../handlers/posts_handler";
import {  } from "apollo-server-hapi";

// TODO: Implement created_at column.
// Date type must be defined by custom scalars. 
// reference: https://www.apollographql.com/docs/graphql-tools/scalars
 const typeDef = `
  type Post {
    id: ID
    uri: String
    comment: String
  }
`;

const p = new postsHandler();

const resolvers = {
  Query: {
    posts: p.findAll,
    post: p.findById,
  },
  Mutation: {
    createPost: p.create,
    updatePost: p.update
  }
}

const gql = {
  typeDef,
  resolvers
}

export default gql;
