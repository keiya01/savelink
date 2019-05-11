import FoldersHandler from "../handlers/folders_handler";

const typeDefs = `
  type Folder {
    id: ID
    name: String
    user_id: ID
  }
`;

const f = new FoldersHandler();

const resolvers = {
  Query: {
    folders: f.findByUserId
  },
  Mutation: {
    createFolder: f.create
  }
}

export default {
  typeDefs,
  resolvers
}
