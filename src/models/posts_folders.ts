import App from "./app";

export interface PostsFoldersModel {
  id?: string | number;
  post_id?: string | number;
  folder_id?: string | number;
  created_at?: Date;
}

export default class PostsFolders extends App {
  constructor(postsFolders?: PostsFoldersModel) {
    if(!postsFolders) {
      super("posts_folders", {});
      return;
    }
    super("posts_folders", postsFolders);
  }
}