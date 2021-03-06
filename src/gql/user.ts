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
  Query: {
    user: u.findBy
  },
  Mutation: {
    createUser: u.create,
    loginUser: u.login,
    updateUser: u.update
  }
}

export default {
  typeDefs,
  resolvers
}
