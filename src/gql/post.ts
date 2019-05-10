import postsHandler  from "../handlers/posts_handler";

// TODO: Implement created_at column.
// Date type must be defined by custom scalars. 
// reference: https://www.apollographql.com/docs/graphql-tools/scalars
 const typeDef = `
  type Post {
    id: ID
    uri: String
    comment: String
    user_id: ID
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
    updatePost: p.update,
    deletePost: p.delete,
  }
}

export default {
  typeDef,
  resolvers
}
