import AppHandler from "./app_handler";
import { UserInputError } from "apollo-server-core";
import User, { UserModel } from "../models/user";
import { ERROR_TYPE } from "../constants/error";
import { QueryResult } from "pg";

export default class UserHandler extends AppHandler {
  private validate(user: { email?: string, token_id?: string, username?: string }) {
    const { email, token_id, username } = user;

    this.validateEmptyGQL({ username, email, token_id });

    if (email && !this.checkEmail(email)) {
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
    this.validate({ email, username });

    const u = new User();

    const tableData = { username, email, created_at: new Date() };

    let err: Object | null = null;
    let userData: QueryResult | null = null;
    try {
      userData = await u.create(tableData, true);
    } catch ({ stack }) {
      err = u.checkErrorMessage(tableData, stack);
      console.error(stack);
    }

    this.validateDatabaseError(err);
    this.validateResponse(tableData, userData);

    let user: UserModel | null = null;
    if (userData) {
      user = userData.rows[0];
    }

    return user;
  }

  // TODO: Add token_id to parameter
  public login = async (_, { email }) => {
    this.validate({ email });

    const u = new User();

    const tableData = { email }

    let userData: QueryResult | null = null;
    let err: Object | null = null;
    try {
      // TODO: Add token_id to first argument of finrBy function
      userData = await u.findBy("email = $1", [email]);
    } catch ({ stack }) {
      err = u.checkErrorMessage(tableData, stack);
      console.error(stack);
    }

    this.validateDatabaseError(err);
    this.validateResponse(tableData, userData);

    let user: UserModel | null = null;
    if (userData) {
      user = userData.rows[0];
    }

    return user;
  }

  public findBy = async (_, { id }) => {
    this.validateId(id);

    const u = new User();

    const tableData = { id };

    let userData: QueryResult | null = null;
    let err: Object | null = null;
    try {
      userData = await u.findBy("id = $1", [id]);
    } catch ({ stack }) {
      err = u.checkErrorMessage(tableData, stack);
      console.error(stack);
    }

    this.validateDatabaseError(err);
    this.validateResponse(tableData, userData);

    let user: UserModel | null = null;
    if (userData) {
      user = userData.rows[0];
    }

    return user
  }

  // TODO: Add token_id to second parameter
  // Because use token_id to authenticate the user
  update = async (_, { id, username, email }) => {
    // id is require
    this.validateId(id);

    // Check parameters one by one and update items one by one
    let updateValue = this.setUpdateParameters({ id, email, username }, (table: Object) => {
      const columns = Object.keys(table);
      throw new UserInputError("Please enter a value in the form", {
        keys: columns,
        values: table,
        type: ERROR_TYPE.Empty
      });
    });

    this.validate(updateValue);

    const u = new User();

    let userData: QueryResult | null = null;
    let err: Object | null = null;
    try {
      userData = await u.update(updateValue, true);
    } catch ({ stack }) {
      err = u.checkErrorMessage(updateValue, stack);
      console.error(stack);
    }

    this.validateDatabaseError(err);
    this.validateResponse(updateValue, userData);

    let user: UserModel | null = null;
    if (userData) {
      user = userData.rows[0];
    }

    return user;
  }
}