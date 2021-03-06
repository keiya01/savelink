import { UserInputError } from "apollo-server-core";
import { ERROR_TYPE } from "../constants/error";
import { QueryResult } from "pg";

export default class AppHandler {
  public checkURI(uri: string) {
    const isMatch = uri.match(/http(s)?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%+.~#?&//=]*)/g);
    if (isMatch === null) {
      return false;
    }

    return true;
  }

  public checkEmail(email: string) {
    const isMatch = email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (isMatch === null) {
      return false;
    }

    return true;
  }

  public checkEmpty(value?: any) {
    return !value || value === ""
  }

  public checkEmptyString(value?: string) {
    return value !== undefined ? value === "" : false;
  }

  public validateId(id: string | number) {
    if (id === 0 || id === "0" || id === "") {
      throw new UserInputError(`This value can not be used: ${id}`, {
        key: "id",
        value: id,
        type: ERROR_TYPE.Syntax
      });
    }
  }

  public validateEmptyGQL(columns: Object) {
    const keys = Object.keys(columns);

    keys.map(key => {
      const item = columns[key];
      if (this.checkEmptyString(item)) {
        throw new UserInputError(`${key} is can not empty`, {
          key,
          value: columns[key],
          type: ERROR_TYPE.Empty
        });
      }
    });
  }

  public validateDatabaseError(err: Object | null) {
    if (err) {
      throw new UserInputError("Data could not save", err);
    }
  }

  public validateResponse(requestData: Object, responseData: QueryResult | null) {
    if (!responseData || responseData.rowCount === 0) {
      const keys = Object.keys(requestData);
      throw new UserInputError("Could not find data. Please check entered value.", {
        keys,
        values: requestData,
        type: ERROR_TYPE.Not_Found
      });
    }
  }

  public setUpdateParameters = (table: Object, noParameterErrorHandle?: (table: Object) => void) => {
    // Check parameters one by one and update items one by one
    const columns = Object.keys(table);

    const updateParameters = columns.reduce((updateParameters, column) => {
      const value = table[column];
      if (typeof value === "number" || !this.checkEmptyString(value)) {
        return {
          ...updateParameters,
          [column]: table[column]
        }
      }

      return updateParameters;
    }, {});

    if (Object.keys(updateParameters).length === 0) {
      noParameterErrorHandle && noParameterErrorHandle(table);
    }

    return updateParameters
  }
}
