import postsHandler  from "../../handlers/posts_handler";



const typeDef = `
  type Post {
    id: int
    uri: string
    comment: string
  }
`;

const p = new postsHandler();

const resolvers = {
  Query: {
    posts: () => p.findAll()
  },
  Mutation: {

  }
}

const gql = {
  typeDef,
  resolvers
}

export default gql;
