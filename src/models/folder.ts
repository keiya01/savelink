import App from "./app";

export interface FolderModel {
  id?: number | string,
  name?: string,
  user_id?: number | string,
  created_at?: Date,
}

export default class Folder extends App<FolderModel> {
  constructor() {
    super("folders");
  }
}