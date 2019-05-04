import Post, { PostModelProps } from "../models/post";
import AppHandler from "./app_handler";
import { UserInputError } from "apollo-server-hapi";

export default class PostsHandler extends AppHandler {
  private validate(uri?: string, comment?: string) {
    if (uri === "") {
      throw new UserInputError(`URI can not be empty`, {
        argument: "uri",
        cause: "empty"
      });
    }

    if (uri && !this.validateURI(uri)) {
      throw new UserInputError(`This value can not be used: ${uri}`, {
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

  private validateID(id: string) {
    const p = new Post();
    let canFind = false;
    p.findBy("id = $1", [id]).then(post => {
      if (!post) {
        canFind = false;
      }
      canFind = true;
    });
    return canFind;
  }

  public findAll() {
    const p = new Post();
    const posts = p.findAll(["*"], { type: "DESC", column: "created_at" });

    return posts;
  }

  public findById(_, { id }) {
    if (id === "0") {
      throw new UserInputError(`This value can not used: ${id}`, {
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
    if (!this.validateID(id)) {
      throw new UserInputError(`id ${id} not found`, {
        argument: "id",
        cause: "not_found"
      });
    }

    let canUpdate = false;
    if (uri || comment) {
      canUpdate = true;
    }

    let updatingData: PostModelProps = {};
    switch (true) {
      case !this.checkEmptyString(uri) && !this.checkEmptyString(comment):
        this.validate(uri, comment);
        updatingData = { uri, comment };
        break;
      case !this.checkEmptyString(uri):
        this.validate(uri);
        updatingData = { uri };
        break;
      case !this.checkEmptyString(comment):
        updatingData = { comment };
        break;
      default: this.validate(uri, comment);
    }

    if (!canUpdate) {
      return {};
    }

    const p = new Post(updatingData);
    p.update(id);

    return {
      id,
      uri,
      comment
    }
  }

  public delete = (_, { id }) => {
    if (!this.validateID(id)) {
      throw new UserInputError(`id ${id} not found`, {
        argument: "id",
        cause: "not_found"
      });
    }

    const p = new Post();
    const postBeforeDeleted = p.findBy("id = $1", [id]);

    p.delete(id);

    return postBeforeDeleted;
  }
}
