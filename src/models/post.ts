import App from "./app";

export interface PostModel {
  id?: string,
  uri?: string,
  comment?: string,
  user_id?: string,
  created_at?: Date
}
export default class Post extends App {
  constructor(post?: PostModel) {
    if (!post) {
      super("posts", {});
      return;
    }
    super("posts", post);
  }

}