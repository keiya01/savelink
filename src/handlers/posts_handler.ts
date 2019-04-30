import Post from "../models/post";
import AppHandler, { ResponseData, Error } from "./app_handler";

export class PostsHandler extends AppHandler {
  public create(req): ResponseData {
    const { uri, comment } = req.params;
    const post = new Post(uri, comment);
    const isError = post.create();

    const errorMessages: string[] = [];
    if(isError) {
      errorMessages.push("保存できませんでした");
    }

    const error: Error = {
      isError,
      messages: errorMessages
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