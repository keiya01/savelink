import postsHandler  from "../handlers/posts_handler";

// TODO: Implement created_at column.
// Date type must be defined by custom scalars. 
// reference: https://www.apollographql.com/docs/graphql-tools/scalars
 const typeDef = `
  type Post {
    id: ID
    urls: [PostUrls]
    comment: String
    user_id: ID
  }

  type PostUrls {
    id: ID
    url: String
    post_id: ID
  }
`;

const p = new postsHandler();

const resolvers = {
  Query: {
    posts: p.findAll,
    post: p.findById,
    postsForUser: p.findByUserId
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
