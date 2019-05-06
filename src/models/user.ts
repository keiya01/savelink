import App from "./app";

export default class User extends App {
  constructor(user?: {id?: string, name?: string, email?: string, password?: string}) {
    if(!user) {
      super("accounts", {});
      return;
    }

    super("accounts", user);
  }
}