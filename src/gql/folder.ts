import FoldersHandler from "../handlers/folders_handler";

const typeDefs = `
  type Folder {
    id: ID
    name: String
    user_id: ID
  }

  type PostFolder {
    id: ID
    uri: String
    comment: String
    post_id: ID
    folder_id: ID
  }
`;

const f = new FoldersHandler();

const resolvers = {
  Query: {
    folders: f.findByUserId,
  },
  Mutation: {
    createFolder: f.create,
    saveFolder: f.save,
    changeFolder: f.changeFolder
  }
}

export default {
  typeDefs,
  resolvers
}
