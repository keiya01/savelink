import App from "./app";

export interface FolderModel {
  id?: number | string,
  name?: string,
  user_id?: number | string,
  created_at?: Date,
}

export default class Folder extends App {
  constructor(folder?: FolderModel) {
    super("folders", folder ? folder : {});
  }
}