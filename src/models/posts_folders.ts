import App from "./app";

export interface PostsFoldersModel {
  id?: string | number;
  post_id?: string | number;
  folder_id?: string | number;
  created_at?: Date;
}

export default class PostsFolders extends App {
  constructor() {
    super("posts_folders");
  }

  public saveToFolder = (tableData: PostsFoldersModel) => {
    const fields = Object.keys(tableData);
    const escapeKeys = this.getEscapeKeys(fields.length);
    const values = Object.values(tableData);

    const sql = `
      WITH saved_post AS (
        INSERT INTO posts_folders (${fields.join()}) VALUES (${escapeKeys.join()})
        RETURNING id, post_id, folder_id, created_at AS saved_at
      )
      SELECT * FROM saved_post, posts
      WHERE saved_post.post_id = posts.id; 
    `;

    return this.exec(sql, values);
  }
}