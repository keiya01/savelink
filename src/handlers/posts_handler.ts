import Post from "../models/post";
import AppHandler, { Error } from "./app_handler";

export class PostsHandler extends AppHandler {
  public create(_, { uri, comment }) {
    const p = new Post(uri, comment);

    let error: Error = {
      isError: false,
      messages: []
    };
    if (p.create()) {
      error = this.newError(["保存できませんでした"])
    }

    return {
      uri,
      comment,
      error
    }
  }
  public findAll() {
    const p = new Post();
    const posts = p.findAll(["*"], {type: "DESC", column: "id"});

    return posts
  }
}