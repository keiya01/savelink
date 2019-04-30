import Post from "../models/post";
import { ResponseData } from "./app_handler";

export class PostsHandler {
  public create(req): ResponseData {
    const { uri, comment } = req.params;
    const m = new Post(uri, comment);
    m.create();

    return {
      payload: {
        uri,
        comment,
      },
      errors: [],
    }
  }

}