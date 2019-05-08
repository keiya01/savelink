import App from "./app";

export default class User extends App {
  constructor(user?: {id?: string, username?: string, email?: string, token_id?: string, created_at?: Date}) {
    if(!user) {
      super("accounts", {});
      return;
    }

    super("accounts", user);
  }
}