import AppHandler from "./app_handler";
import { UserInputError } from "apollo-server-core";

export default class UserHandler extends AppHandler {
  private validate(username?: string, email?: string, password?: string) {
    this.checkEmptyGQL({username, email, password});

    if(email && !this.validateEmail) {
      throw new UserInputError(`This email is invalid: ${email}`, {
        argument: "email",
        cause: "invalid",
      });
    }

    if(password && password.length < 6) {
      throw new UserInputError("The password must be min 6 lengths", {
        argument: "password",
        cause: "minLength"
      });
    }
  }
}