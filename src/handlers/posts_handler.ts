import Post from "../models/post";
import AppHandler from "./app_handler";
import { UserInputError } from "apollo-server-hapi";

export default class PostsHandler extends AppHandler {
  public validate(uri, comment) {
    if(!this.validateEmpty(uri)) {
      throw new UserInputError(`URI can not be empty`, {
        argument: "uri",
        cause: "empty"
      });
    }

    if(!this.validateURI(uri)) {
        throw new UserInputError(`Can not use this value: ${uri}`, {
          argument: "uri",
          cause: "format"
        });
    }

    if(comment !== null && comment.length === 0) {
      throw new UserInputError(`Comment can not be empty`, {
        argument: "comment",
        cause: "empty"
      });
    }
  }

  public create = (_, { uri, comment }) => {
    this.validate(uri, comment);

    const p = new Post(uri, comment);
    p.create();

    return {
      uri,
      comment
    }
  }

  public findAll() {
    const p = new Post();
    const posts = p.findAll(["*"], {type: "DESC", column: "id"});

    return posts;
  }

  public findById(_, {id}) {
    if(id === 0) {
      throw new UserInputError(`Can not use this value: ${id}`, {
        argument: "id",
        cause: "zero"
      })
    }

    const p = new Post();
    const post = p.findBy("id = $1", [id]);

    return post;
  }
}
