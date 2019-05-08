import UserHandler from "../handlers/users_handler";

const typeDefs = `
  User {
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
    create: u.create
  }
}

export default {
  typeDefs,
  resolvers
}
