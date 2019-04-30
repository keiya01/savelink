import Post from "../models/post";
import { ResponseData, Error } from "./app_handler";

export class PostsHandler {
  public create(req): ResponseData {
    const { uri, comment } = req.params;
    const m = new Post(uri, comment);
    m.create();

    const error: Error = {
      isError: false,
      messages: []
    }

    return {
      payload: {
        uri,
        comment,
      },
      error
    }
  }

}