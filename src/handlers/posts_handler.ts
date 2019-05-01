import Post from "../models/post";
import AppHandler from "./app_handler";

export default class PostsHandler extends AppHandler {
  public create(_, { uri, comment }) {
    const p = new Post(uri, comment);

    p.create();

    return {
      uri,
      comment,
    }
  }

  public findAll() {
    const p = new Post();
    const posts = p.findAll(["*"], {type: "DESC", column: "id"});

    return posts;
  }
}
