import AppHandler from "./app_handler";
import { UserInputError } from "apollo-server-core";
import User from "../models/user";

export default class UserHandler extends AppHandler {
  private validate(username?: string, email?: string, token_id?: string) {
    this.checkEmptyGQL({username, email, token_id});

    if(email && !this.validateEmail) {
      throw new UserInputError(`This email is invalid: ${email}`, {
        argument: "email",
        cause: "invalid",
      });
    }
  }

  /*
    TODO
    Temporarily set token_id to null.
    After building the server, set token_id to not null in postgreSQL.
  */
  public create = (_, {username, email}) => {
    this.validate(username, email);
    
    const u = new User({username, email, created_at: new Date()});
    u.create();

    return {
      username,
      email,
    }
  }
}