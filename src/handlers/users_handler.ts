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
  public create = async (_, {username, email}) => {
    this.validate(username, email);
    
    const u = new User({username, email, created_at: new Date()});

    let err: Object | null = null;
    try {
      await u.create();
    } catch({stack}) {
      err = u.checkErrorMessage(stack);
      console.error(stack);
    }

    if(err) {
      throw new UserInputError("Data could not save", err);
    }

    return {
      username,
      email,
    }
  }
}