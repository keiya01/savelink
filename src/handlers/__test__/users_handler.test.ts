/* eslint-disable no-undef*/

import UserHandler from "../users_handler";
import { ERROR_TYPE } from "../../constants/error";
import { UserInputError } from "apollo-server-core";

const u = new UserHandler();

describe("Check that setUpdateParameters function set updateing postgreSQL data", () => {
  const tests = [
    {
      description: "Check passing parameter",
      data: {
        email: "test@mail.com",
        username: "testname"
      },
      result: {
        email: "test@mail.com",
        username: "testname"
      },
      isError: false
    },
    {
      description: "Check empty email",
      data: {
        email: "",
        username: "testname"
      },
      result: {
        username: "testname"
      },
      isError: false
    },
    {
      description: "Check empty username",
      data: {
        email: "test@mail.com",
        username: ""
      },
      result: {
        email: "test@mail.com"
      },
      isError: false
    },
    {
      description: "Check empty email and username",
      data: {
        email: "",
        username: ""
      },
      result: new UserInputError("Please input value", {
        key: "",
        value: "",
        type: ERROR_TYPE.Empty
      }),
      isError: true
    }
  ];

  tests.map(({ description, data, result, isError }) => {
    test(description, () => {
      if (isError && result instanceof UserInputError) {
        const getThrowError = () => {
          u.getPrivateFunctionForTest().setUpdateParameters(data.email, data.username);
        }
        expect(getThrowError)
          .toThrowError(result);
      } else {
        expect(u.getPrivateFunctionForTest().setUpdateParameters(data.email, data.username))
          .toEqual(result);
      }
    });
  });
})
