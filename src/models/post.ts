import App from "./app";

export interface PostModelProps {
  id?: string,
  uri?: string,
  comment?: string,
  created_at?: Date
}
export default class Post extends App {
  constructor(post?: PostModelProps) {
    if (!post) {
      super("post", {});
      return;
    }
    super("post", post);
  }

}