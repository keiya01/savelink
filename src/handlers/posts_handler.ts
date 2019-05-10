import Post, { PostModel } from "../models/post";
import AppHandler from "./app_handler";
import { UserInputError } from "apollo-server-hapi";
import { QueryResult } from "pg";
import { ERROR_TYPE } from "../constants/error";

export default class PostsHandler extends AppHandler {
  private validate(post: { uri?: string, comment?: string }) {
    const { uri, comment } = post;

    if (uri === "") {
      throw new UserInputError(`URI can not be empty`, {
        key: "uri",
        value: uri,
        type: ERROR_TYPE.Empty
      });
    }

    if (uri && !this.checkURI(uri)) {
      throw new UserInputError(`This value can not be used: ${uri}`, {
        key: "uri",
        value: uri,
        type: ERROR_TYPE.Format
      });
    }

    if (comment === "") {
      throw new UserInputError(`Comment can not be empty`, {
        key: "comment",
        value: comment,
        type: ERROR_TYPE.Empty
      });
    }
  }

  public findAll = async () => {
    const p = new Post();

    let postData: QueryResult | null = null;
    let err: Object | null = null;
    try {
      postData = await p.findAll(["*"], { type: "DESC", column: "created_at" });
    } catch ({ stack }) {
      err = p.checkErrorMessage(stack);
      console.error(stack);
    }

    let posts: PostModel[] | null = null;
    if (postData && postData.rows) {
      posts = postData.rows;
    }

    this.validateDatabaseError(err);

    return posts;
  }

  public findById = async (_, { id }) => {
    this.validateId(id);

    const p = new Post();

    let postData: QueryResult | null = null;
    let err: Object | null = null;
    try {
      postData = await p.findBy("id = $1", [id]);
    } catch ({ stack }) {
      err = p.checkErrorMessage(stack);
      console.error(stack);
    }

    let post: PostModel | null = null;
    if (postData && postData.rows[0]) {
      post = postData.rows[0];
    }

    this.validateDatabaseError(err);

    return post;
  }

  public create = async (_, { uri, comment, user_id }) => {
    this.validateId(user_id);
    this.validate({uri, comment});

    const p = new Post({ uri, comment, user_id, created_at: new Date });

    let err: Object | null = null;
    let postData: QueryResult | null = null;
    try {
      postData = await p.create(true);
    } catch ({ stack }) {
      err = p.checkErrorMessage(stack);
      console.error(stack);
    }

    this.validateDatabaseError(err);

    if(!postData || postData.rowCount === 0) {
      const tables = p.getTableData();
      const keys = Object.keys(tables);

      throw new UserInputError("Could not save data. Please check entered value", {
        keys,
        value: tables,
        type: ERROR_TYPE.Not_Found
      });
    }

    const post = postData.rows[0];

    return post;
  }

  public update = async (_, { id, uri, comment }) => {
    this.validateId(id);

    let updatingData: PostModel = this.setUpdateParameters({ uri, comment }, (table: Object) => {
      const columns = Object.keys(table);
      throw new UserInputError("Please enter a value in the form", {
        keys: columns,
        values: table,
        type: ERROR_TYPE.Empty
      });
    });

    this.validate(updatingData)

    const p = new Post(updatingData);

    let postData: QueryResult | null = null;
    let err: Object | null = null;
    try {
      postData = await p.update(id);
    } catch ({ stack }) {
      err = p.checkErrorMessage(stack);
      console.error(stack);
    }

    this.validateDatabaseError(err);

    if (postData && postData.rowCount === 0) {
      throw new UserInputError(`id ${id} not found`, {
        key: "id",
        value: id,
        type: ERROR_TYPE.Not_Found
      });
    }

    return {
      id,
      uri,
      comment
    }
  }

  public delete = async (_, { id }) => {
    this.validateId(id);

    const p = new Post();
    const postBeforeDeleted = p.findBy("id = $1", [id]);

    const { rowCount } = await p.delete(id);
    if (rowCount === 0) {
      throw new UserInputError(`id ${id} not found`, {
        key: "id",
        value: id,
        type: ERROR_TYPE.Not_Found
      });
    }

    return postBeforeDeleted;
  }
}
