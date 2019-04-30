import App from "./app";

export default class Post extends App {
  constructor(uri: string, comment: string) {
    super("Post", {uri, comment, created_at: new Date});
  }

}