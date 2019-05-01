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
    posts: () => p.findAll()
  }
}

const gql = {
  typeDef,
  resolvers
}

export default gql;
