import App from "./app";

export default class Post extends App {
  constructor(id?: number, uri?: string, comment?: string) {
    super("Post", {id, uri, comment, created_at: new Date});
  }

}