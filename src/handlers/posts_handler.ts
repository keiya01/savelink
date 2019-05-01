import Post from "../models/post";
import AppHandler from "./app_handler";

// TODO: Refer to this uri: https://blog.apollographql.com/full-stack-error-handling-with-graphql-apollo-5c12da407210
// describing error handling of GraphQL

export default class PostsHandler extends AppHandler {
  public create(_, { uri, comment }) {
    const p = new Post(uri, comment);

    p.create();

    return {
      uri,
      comment,
    }
  }

  public findAll() {
    const p = new Post();
    const posts = p.findAll(["*"], {type: "DESC", column: "id"});

    console.log(posts)

    return posts;
  }
}
