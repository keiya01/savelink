import Post, { PostModel } from "../models/post";
import AppHandler from "./app_handler";
import { UserInputError } from "apollo-server-hapi";
import { QueryResult } from "pg";
import { ERROR_TYPE } from "../constants/error";

export default class PostsHandler extends AppHandler {
  private validate(post: { urls?: string[], comment?: string }) {
    const { urls, comment } = post;

    if (!urls || urls.length === 0) {
        throw new UserInputError(`URI can not be empty`, {
          key: "urls",
          value: urls,
          type: ERROR_TYPE.Empty
        });
    }

    urls.map(url => {
      if (!this.checkURI(url)) {
        throw new UserInputError(`This value can not be used: ${url}`, {
          key: "url",
          value: url,
          type: ERROR_TYPE.Format
        });
      }
    })

    if (comment === "") {
      throw new UserInputError(`Comment can not be empty`, {
        key: "comment",
        value: comment,
        type: ERROR_TYPE.Empty
      });
    }
  }

  public findAll = async (_, {page}) => {
    const p = new Post();

    let postData: QueryResult | null = null;
    let err: Object | null = null;
    try {
      const limit = page !== 0 ? page * 20 : 20;
      const offset = page > 1 ? (page - 1) * 20 : 0;
      postData = await p.findAll({ type: "DESC", column: "created_at" }, limit, offset);
    } catch ({ stack }) {
      err = p.checkErrorMessage({page}, stack);
      console.error(stack);
    }

    this.validateDatabaseError(err);
    this.validateResponse({page}, postData);
    
    let posts: PostModel[] | null = null;
    if (postData) {
      posts = postData.rows;
    }

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
      err = p.checkErrorMessage({id}, stack);
      console.error(stack);
    }

    this.validateDatabaseError(err);
    this.validateResponse({id}, postData);
    
    let post: PostModel | null = null;
    if (postData) {
      post = postData.rows[0];
    }

    return post;
  }

  public findByUserId = async (_, {user_id, page}) => {
    this.validateId(user_id);

    const p = new Post();

    const tableData = {user_id};

    let postData: QueryResult | null = null;
    let err: Object | null = null;
    try {
      const limit = page !== 0 ? page * 20 : 20;
      const offset = page > 1 ? (page - 1) * 20 : 0;
      postData = await p.findBy("user_id = $1", [user_id], {type: "DESC", column: "created_at"}, limit, offset);
    } catch({stack}) {
      err = p.checkErrorMessage({...tableData, page}, stack);
      console.error(stack);
    }

    this.validateDatabaseError(err);
    this.validateResponse({...tableData, page}, postData);

    let posts: PostModel[] | null = null;
    if(postData) {
      posts = postData.rows;
    }

    return posts;
  }

  public create = async (_, { urls, comment, user_id }) => {
    this.validateId(user_id);
    this.validate({urls, comment});

    const p = new Post();

    const tableData = { comment, user_id, created_at: new Date };

    let err: Object | null = null;
    let postData: QueryResult | null = null;
    try {
      postData = await p.createPost(tableData, urls);
    } catch ({ stack }) {
      err = p.checkErrorMessage(tableData, stack);
      console.error(stack);
    }

    this.validateDatabaseError(err);
    this.validateResponse(tableData, postData);

    let post: PostModel | null = null;
    if (postData) {
      post = postData.rows[0];
    }

    return post;
  }

  public update = async (_, { id, comment }) => {
    this.validateId(id);

    const updateParameter = this.setUpdateParameters({ comment }, (table: Object) => {
      const columns = Object.keys(table);
      throw new UserInputError("Please enter a value in the form", {
        keys: columns,
        values: table,
        type: ERROR_TYPE.Empty
      });
    });

    this.validate(updateParameter);

    const updatingData = {
      id,
      ...updateParameter
    }

    const p = new Post();

    let postData: QueryResult | null = null;
    let err: Object | null = null;
    try {
      postData = await p.update(updatingData, true);
    } catch ({ stack }) {
      err = p.checkErrorMessage(updatingData, stack);
      console.error(stack);
    }

    this.validateDatabaseError(err);
    this.validateResponse(updatingData, postData);

    let post: PostModel | null = null;
    if (postData) {
      post = postData.rows[0];
    }

    return post;
  }

  public delete = async (_, { id }) => {
    this.validateId(id);

    const p = new Post();

    let err: Object | null = null;
    try {
      await p.delete(id);
    } catch({stack}) {
      err = p.checkErrorMessage({id}, stack);
      console.error(stack);
    }

    this.validateDatabaseError(err);

    return null;
  }
}
