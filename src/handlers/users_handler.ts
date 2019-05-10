import AppHandler from "./app_handler";
import { UserInputError } from "apollo-server-core";
import User, { UserModel } from "../models/user";
import { ERROR_TYPE } from "../constants/error";
import { QueryResult } from "pg";

export default class UserHandler extends AppHandler {
  private validate(user: { email?: string, token_id?: string, username?: string }) {
    const { email, token_id, username } = user;

    this.checkEmptyGQL({ username, email, token_id });

    if (email && !this.validateEmail(email)) {
      throw new UserInputError(`This email is invalid: ${email}`, {
        key: "email",
        value: email,
        type: ERROR_TYPE.Format,
      });
    }
  }

  private setUpdateParameters = (email: string, username: string) => {
    // Check parameters one by one and update items one by one
    let updateParameters: Object = {};
    if (!this.checkEmptyString(email)) {
      updateParameters = {
        ...updateParameters,
        email
      }
    }
    if (!this.checkEmptyString(username)) {
      updateParameters = {
        ...updateParameters,
        username
      }
    }
    if (Object.keys(updateParameters).length === 0) {
      throw new UserInputError("Please input value", {
        keys: ["email", "username"],
        values: { email, username },
        type: ERROR_TYPE.Empty
      });
    }

    return updateParameters
  }

  public getPrivateFunctionForTest = () => {
    return {
      setUpdateParameters: this.setUpdateParameters
    }
  }

  /*
    TODO
    Temporarily set token_id to null.
    After building the server, set token_id to not null in postgreSQL.
  */
  public create = async (_, { username, email }) => {
    this.validate({ email, username });

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
    this.validate({ email });

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
    if (userData && userData.rows[0]) {
      user = userData.rows[0];
    }

    return user;
  }

  public findBy = async (_, { id }) => {
    this.checkEmptyGQL({ id });

    const u = new User({ id });

    let userData: QueryResult | null = null;
    let err: Object | null = null;
    try {
      userData = await u.findBy("id = $1", [id]);
    } catch ({ stack }) {
      err = u.checkErrorMessage(stack);
      console.error(stack);
    }

    this.checkDatabaseError(err);

    let user: UserModel | null = null;
    if (userData && userData.rows[0]) {
      user = userData.rows[0];
    }

    return user
  }

  // TODO: Add token_id to second parameter
  // Because use token_id to authenticate the user
  update = async (_, { id, username, email }) => {
    // id is require
    this.checkEmptyGQL({ id });

    // Check parameters one by one and update items one by one
    let updateValue = this.setUpdateParameters(email, username);

    this.validate(updateValue);

    const u = new User(updateValue);

    let userData: QueryResult | null = null;
    let err: Object | null = null;
    try {
      userData = await u.update(id, true);
    } catch ({ stack }) {
      err = u.checkErrorMessage(stack);
      console.error(stack);
    }

    this.checkDatabaseError(err);

    if (!userData || userData.rowCount === 0) {
      // TODO: Add token_id to values that is second argument for UserInputError
      throw new UserInputError(`id ${id} can not update. Please check input value`, {
        keys: ["id", "email", "username", "token_id"],
        values: { id, email, username }
      })
    }

    const updatedUser = userData.rows[0];

    return updatedUser;
  }
}