export interface Error {
    isError: boolean;
    messages: string[];
}
export interface ResponseData {
  payload: Object;
  error: Error;
}

export default class AppHandler {
  public validateURI(uri: string) {
    const isMatch = uri.match(/http(s)?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%+.~#?&//=]*)/g);
    if(isMatch === null) {
      return false;
    }

    return true;
  }

  public validateEmpty(value) {
    if(!value) {
      return false;
    }

    return true;
  }
}
