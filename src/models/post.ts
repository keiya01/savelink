import App from "./app";
import { QueryResult } from "pg";

export interface PostUrls {
  id?: string | number;
  url?: string;
  post_id?: string | number;
}

export interface PostModel extends Object {
  id?: string | number;
  urls?: PostUrls[];
  comment?: string;
  user_id?: string;
  created_at?: Date;
}
export default class Post extends App<PostModel> {
  constructor() {
    super("posts");
  }

  getInsertSQLOptions = (post: PostModel, urls: string[]) => {
    const { id, created_at } = post;

    if (!id || !created_at) {
      throw new Error(`Can not save post_urls because include invalid value: id = ${id} created_at = ${created_at}`);
    }

    type SQLValues = string | Date | number;
    return urls.reduce((sqlParameters: [string[], SQLValues[]], url): [string[], SQLValues[]] => {
      const escapeKeyLength = sqlParameters[0].length;
      const firstKey = escapeKeyLength === 0 ? 1 : (escapeKeyLength * 3) + 1;
      const escapeKeys = [
        ...sqlParameters[0],
        `($${firstKey}, $${firstKey + 1}, $${firstKey + 2})`
      ];

      const sqlValues = [
        ...sqlParameters[1],
        url,
        id,
        created_at
      ];

      return [
        escapeKeys,
        sqlValues
      ];
    }, [[], []]);
  }

  getInsertUrls = (post: PostModel, urls: string[]) => {
    if (urls.length === 0) {
      throw new Error("Can not empty urls");
    }

    const [escapeKey, values] = this.getInsertSQLOptions(post, urls);

    const sql = `
      WITH urls AS (
        INSERT INTO post_urls (
          url,
          post_id,
          created_at
        ) 
        VALUES ${escapeKey.join()}
        RETURNING *
      )
      SELECT * from post, urls;
    `;

    return {
      sql,
      values
    };
  }

  createPost = async (tableData: PostModel, urls: string[]) => {
    let postData: QueryResult | null = null;
    try {
      postData = await this.create(tableData, true);
    } catch ({ stack }) {
      throw new Error(stack);
    }

    if (!postData || postData.rowCount === 0) {
      throw new Error("Could not save data");
    }

    const post: PostModel = postData.rows[0];
    const { sql, values } = this.getInsertUrls(post, urls);

    this.exec(sql, values);
  }

}
