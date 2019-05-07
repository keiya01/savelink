import { UserInputError } from "apollo-server-core";

export interface Error {
    isError: boolean;
    messages: string[];
}

export default class AppHandler {
  public validateURI(uri: string) {
    const isMatch = uri.match(/http(s)?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%+.~#?&//=]*)/g);
    if(isMatch === null) {
      return false;
    }

    return true;
  }

  public validateEmail(email: string) {
    const isMatch =  email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if(isMatch === null) {
      return false;
    }

    return true;
  }

  public checkEmpty(value?: any) {
    return !value || value === ""
  }

  public checkEmptyString(value?: string) {
    return value && value === "";
  }

  public checkEmptyGQL(columns: Object) {
    const keys = Object.keys(columns);

    keys.map(key => {
      const item = columns[key];
      if(this.checkEmptyString(item)) {
        throw new UserInputError(`${key} is can not empty`, {
          argument: key,
          cause: "empty"
        });
      }
    });
  }
}
