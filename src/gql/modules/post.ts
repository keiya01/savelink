import postsHandler  from "../../handlers/posts_handler";

const typeDef = `
  type Post {
    id: Int
    uri: String
    comment: String
  }
`;

const p = new postsHandler();

const resolvers = {
  Query: {
    posts: () => p.findAll(),
    post: p.findById,
  },
  Mutation: {
    createPost: p.create
  }
}

const gql = {
  typeDef,
  resolvers
}

export default gql;
