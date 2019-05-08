import Post, { PostModel } from "../models/post";
import AppHandler from "./app_handler";
import { UserInputError } from "apollo-server-hapi";
import { QueryResult } from "pg";

export default class PostsHandler extends AppHandler {
  private validate(uri?: string, comment?: string) {
    if (uri === "") {
      throw new UserInputError(`URI can not be empty`, {
        key: "uri",
        value: uri,
        type: "empty"
      });
    }

    if (uri && !this.validateURI(uri)) {
      throw new UserInputError(`This value can not be used: ${uri}`, {
        key: "uri",
        value: uri,
        type: "format"
      });
    }

    if (comment === "") {
      throw new UserInputError(`Comment can not be empty`, {
        key: "comment",
        value: comment,
        type: "empty"
      });
    }
  }

  public findAll = async () => {
    const p = new Post();

    let postData: QueryResult | null = null;
    let err: Object | null = null;
    try {
      postData = await p.findAll(["*"], { type: "DESC", column: "created_at" });
    } catch({stack}) {
      err = p.checkErrorMessage(stack);
      console.error(stack);
    }

    let posts: PostModel[] | null = null;
    if(postData && postData.rows) {
      posts = postData.rows;
    }

    this.checkDatabaseError(err);

    return posts;
  }

  public findById = async (_, { id }) => {
    if (id === "0" || id === "") {
      throw new UserInputError(`This value can not used: ${id}`, {
        key: "id",
        value: id,
        type: "syntax"
      });
    }

    const p = new Post();
    
    let postData: QueryResult | null = null;
    let err: Object | null = null;
    try {
      postData = await p.findBy("id = $1", [id]);
    } catch({stack}) {
      err = p.checkErrorMessage(stack);
      console.error(stack);
    }

    let post: PostModel | null = null;
    if(postData && postData.rows[0]) {
      post = postData.rows[0];
    }

    this.checkDatabaseError(err);

    return post;
  }

  public create = async (_, { uri, comment }) => {
    this.validate(uri, comment);

    const p = new Post({ uri, comment, created_at: new Date });

    let err: Object | null = null;
    try {
      await p.create();
    } catch({stack}) {
      err = p.checkErrorMessage(stack);
      console.error(stack);
    }

    this.checkDatabaseError(err);

    return {
      uri,
      comment
    }
  }

  public update = async (_, { id, uri, comment }) => {
    let canUpdate = false;
    if (uri || comment) {
      canUpdate = true;
    }

    let updatingData: PostModel = {};
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

    let postData: QueryResult | null = null;
    let err: Object | null = null;
    try {
      postData = await p.update(id);
    } catch({stack}) {
      err = p.checkErrorMessage(stack);
      console.error(stack);
    }

    this.checkDatabaseError(err);

    if (postData && postData.rowCount === 0) {
      throw new UserInputError(`id ${id} not found`, {
        key: "id",
        value: id,
        type: "not_found"
      });
    }

    return {
      id,
      uri,
      comment
    }
  }

  public delete = async (_, { id }) => {
    const p = new Post();
    const postBeforeDeleted = p.findBy("id = $1", [id]);

    const { rowCount } = await p.delete(id);
    if (rowCount === 0) {
      throw new UserInputError(`id ${id} not found`, {
        key: "id",
        value: id,
        type: "not_found"
      });
    }

    return postBeforeDeleted;
  }
}
