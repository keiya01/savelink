/* eslint-disable no-undef */

import AppHandler from "../app_handler";
import { UserInputError } from "apollo-server-core";
import { ERROR_TYPE } from "../../constants/error";

describe("Validate the uri", () => {
  const tests = [
    {
      description: "Check the uri that have http",
      data: "http://test.com",
      result: true
    },
    {
      description: "Check the uri that have https",
      data: "https://test.co.jp",
      result: true
    },
    {
      description: "Check the uri that include www",
      data: "https://www.test.net",
      result: true,
    },
    {
      description: "Check for non existing uri",
      data: "https://m.me",
      result: false
    },
    {
      description: "Check for non existing uri",
      data: "http://a.b.c",
      result: false
    },
    {
      description: "Check the uri that don't include http",
      data: "test.com",
      result: false
    },
    {
      description: "Check the uri that don't include .com",
      data: "https://test",
      result: false
    },
    {
      description: "Check the uri of only one character",
      data: "h",
      result: false
    }
  ];

  tests.map(({ description, data, result }) => {
    test(description, () => {
      const appHandler = new AppHandler();
      expect(appHandler.checkURI(data)).toEqual(result);
    })
  });
});

describe("Validate the email", () => {
  const tests = [
    {
      description: "Check the normal email",
      data: "test@email.com",
      result: true,
    },
    {
      description: "Check the email that include some extentions",
      data: "test@email.co.jp",
      result: true
    },
    {
      description: "Check the email that include some dot",
      data: "a.b.c.d",
      result: false,
    },
    {
      description: "Check the email that don't include @",
      data: "testemail.com",
      result: false,
    },
    {
      description: "Check the email that don't include extention",
      data: "test@mail",
      result: false
    },
    {
      description: "Check the email that don't include extention and @",
      data: "test",
      result: false
    }
  ]

  tests.map(({ description, data, result }) => {
    test(description, () => {
      const appHandler = new AppHandler();
      expect(appHandler.checkEmail(data)).toEqual(result);
    });
  });
});

describe("Check whether or not parameter is empty", () => {
  const tests = [
    {
      description: "Check whether parameter is empty",
      data: {
        test: "test",
        hello: "hello"
      },
      result: false
    },
    {
      description: "Check whether parameter is undefined",
      data: undefined,
      result: true
    },
    {
      description: "Check whether parameter is null",
      data: null,
      result: true
    },
    {
      description: "Check whether parameter is string of empty",
      data: "",
      result: true
    },
    {
      description: "Check whether parameter is object of empty",
      data: {},
      result: false
    },
    {
      description: "Check whether parameter is array of empty",
      data: [],
      result: false
    },
  ];

  tests.map(({ description, data, result }) => {
    test(description, () => {
      const appHandler = new AppHandler();
      expect(appHandler.checkEmpty(data)).toEqual(result);
    });
  });
});

describe("Check whether or not string type parameter is empty", () => {
  const tests = [
    {
      description: "Check whether string type parameter is empty",
      data: "test",
      result: false
    },
    {
      description: "Check whether string type parameter is undefined",
      data: undefined,
      result: false
    },
    {
      description: "Check whether string type parameter is string of empty",
      data: "",
      result: true
    }
  ];

  tests.map(({ description, data, result }) => {
    test(description, () => {
      const appHandler = new AppHandler();
      expect(appHandler.checkEmptyString(data)).toEqual(result);
    });
  });
});

describe("Check that setUpdateParameters function set updateing postgreSQL data", () => {
  const tests = [
    {
      description: "Passing parameter",
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
      description: "Email is empty string",
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
      description: "Data object is only username",
      data: {
        username: "testname"
      },
      result: {
        username: "testname"
      },
      isError: false
    },
    {
      description: "Data object have user_id that is number type",
      data: {
        user_id: 5
      },
      result: {
        user_id: 5
      },
      isError: false
    },
    {
      description: "Data object have user_id that is 0",
      data: {
        user_id: 0
      },
      result: {
        user_id: 0
      },
      isError: false
    },
    {
      description: "There are five data in data object but data object including key that is empty string",
      data: {
        title: "title",
        body: "body",
        user_id: 2,
        uri: "https://test.com",
        theme: ""
      },
      result: {
        title: "title",
        body: "body",
        user_id: 2,
        uri: "https://test.com",
      },
      isError: false
    },
    {
      description: "There are five empty data in data object",
      data: {
        title: "",
        body: "",
        uri: "",
        theme: ""
      },
      result: new UserInputError("Please input value", {
        keys: ["title", "body", "uri", "theme"],
        values: {
          title: "",
          body: "",
          uri: "",
          theme: ""
        },
        type: ERROR_TYPE.Empty
      }),
      isError: true
    },
    {
      description: "Check empty data object",
      data: {},
      result: new UserInputError("Please input value", {
        keys: [],
        values: {},
        type: ERROR_TYPE.Empty
      }),
      isError: true
    }
  ];

  const noParameterErrorHandle = (table: Object) => {
    const columns = Object.keys(table);
    throw new UserInputError("Please input value", {
      keys: columns,
      values: table,
      type: ERROR_TYPE.Empty
    });
  }

  tests.map(({ description, data, result, isError }) => {
    const appHandler = new AppHandler();
    test(description, () => {
      if (isError && result instanceof UserInputError) {
        const getThrowError = () => {
          appHandler.setUpdateParameters({ ...data }, noParameterErrorHandle);
        }
        expect(getThrowError)
          .toThrowError(result);
      } else {
        expect(appHandler.setUpdateParameters({ ...data }, noParameterErrorHandle))
          .toEqual(result);
      }
    });
  });
})
