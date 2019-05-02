import Post from "../models/post";
import AppHandler from "./app_handler";
import { UserInputError } from "apollo-server-hapi";

export default class PostsHandler extends AppHandler {
  public validate(uri?: string, comment?: string) {
    if (uri === "") {
      throw new UserInputError(`URI can not be empty`, {
        argument: "uri",
        cause: "empty"
      });
    }

    if (uri && !this.validateURI(uri)) {
      throw new UserInputError(`Can not use this value: ${uri}`, {
        argument: "uri",
        cause: "format"
      });
    }

    if (comment === "") {
      throw new UserInputError(`Comment can not be empty`, {
        argument: "comment",
        cause: "empty"
      });
    }
  }

  public findAll() {
    const p = new Post();
    const posts = p.findAll(["*"], { type: "DESC", column: "created_at" });

    return posts;
  }

  public findById(_, { id }) {
    if (id === "0") {
      throw new UserInputError(`Can not use this value: ${id}`, {
        argument: "id",
        cause: "zero"
      })
    }

    const p = new Post();
    const post = p.findBy("id = $1", [id]);

    return post;
  }

  public create = (_, { uri, comment }) => {
    this.validate(uri, comment);

    const p = new Post({ uri, comment, created_at: new Date });
    p.create();

    return {
      uri,
      comment
    }
  }

  public update = (_, { id, uri, comment }) => {
    let p = new Post();
    switch (true) {
      case !this.checkEmptyString(uri) && !this.checkEmptyString(comment):
        this.validate(uri, comment);
        p = new Post({ uri, comment });
        break;
      case !this.checkEmptyString(uri):
        this.validate(uri);
        p = new Post({ uri });
        break;
      case !this.checkEmptyString(comment):
        p = new Post({ comment });
        break;
      default: this.validate(uri, comment);
    }

    if (Object.keys(p.tableData).length === 0) {
      return {};
    }

    p.update(id);

    return {
      id,
      uri,
      comment
    }
  }
}
