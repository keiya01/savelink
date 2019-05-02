import App from "./app";

export default class Post extends App {
  constructor(post?: {uri?: string, comment?: string, created_at?: Date }) {
    if(!post) {
      super("Post", {});
      return;
    }
    super("Post", post);
  }

}