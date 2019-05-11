import App from "./app";

export interface UserModel {
  id?: string;
  username?: string;
  email?: string;
  token_id?: string;
  created_at?:Date; 
}

export default class User extends App {
  constructor(user?: UserModel) {
    if(!user) {
      super("users", {});
      return;
    }

    super("users", user);
  }
}