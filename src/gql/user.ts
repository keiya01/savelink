import UserHandler from "../handlers/users_handler";

const typeDefs = `
  type User {
    id: String
    username: String
    email: String
    token_id: String
  }
`;

const u = new UserHandler();

const resolvers = {
  Query: {},
  Mutation: {
    createUser: u.create,
    loginUser: u.login
  }
}

export default {
  typeDefs,
  resolvers
}
