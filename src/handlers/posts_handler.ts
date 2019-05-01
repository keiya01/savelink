import Post from "../models/post";
import AppHandler from "./app_handler";
import { UserInputError } from "apollo-server-hapi";

export default class PostsHandler extends AppHandler {
  public create = (_, { uri, comment }) => {
    const correctURI = this.validateURI(uri) && this.validateEmpty(uri);
    if(!correctURI) {
      throw new UserInputError(`Can not use this value: ${uri}`, {
        argument: "uri"
      });
    }

    const p = new Post(uri, comment);
    const post = p.create();

    if(!post) {
      throw new UserInputError("Could not save data");
    }

    return {
      ...post
    }
  }

  public findAll() {
    const p = new Post();
    const posts = p.findAll(["*"], {type: "DESC", column: "id"});

    return posts;
  }
}
