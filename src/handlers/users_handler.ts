import AppHandler from "./app_handler";
import { UserInputError } from "apollo-server-core";
import User, { UserModel } from "../models/user";
import { ERROR_TYPE } from "../constants/error";
import { QueryResult } from "pg";

export default class UserHandler extends AppHandler {
  private validate(email?: string, token_id?: string, username?: string, ) {
    this.checkEmptyGQL({ username, email, token_id });

    if (email && !this.validateEmail(email)) {
      throw new UserInputError(`This email is invalid: ${email}`, {
        key: "email",
        value: email,
        type: ERROR_TYPE.Format,
      });
    }
  }

  /*
    TODO
    Temporarily set token_id to null.
    After building the server, set token_id to not null in postgreSQL.
  */
  public create = async (_, { username, email }) => {
    this.validate(email, undefined, username);

    const u = new User({ username, email, created_at: new Date() });

    let err: Object | null = null;
    try {
      await u.create();
    } catch ({ stack }) {
      err = u.checkErrorMessage(stack);
      console.error(stack);
    }

    this.checkDatabaseError(err);

    return {
      username,
      email,
    }
  }

  // TODO: Add token_id to parameter
  public login = async (_, { email }) => {
    this.validate(email);

    const u = new User({ email });

    let userData: QueryResult | null = null;
    let err: Object | null = null;
    try {
      // TODO: Add token_id to first argument of finrBy function
      userData = await u.findBy("email = $1", [email]);
    } catch ({ stack }) {
      err = u.checkErrorMessage(stack);
      console.error(stack);
    }

    this.checkDatabaseError(err);

    let user: UserModel | null = null;
    if(userData && userData.rows[0]) {
      user = userData.rows[0];
    }

    return user;
  }
}