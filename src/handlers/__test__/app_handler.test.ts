/* eslint-disable no-undef */

import AppHandler from "../app_handler";

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
      expect(appHandler.validateURI(data)).toEqual(result);
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
      expect(appHandler.validateEmail(data)).toEqual(result);
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

  tests.map(({description, data, result}) => {
    test(description, () => {
      const appHandler = new AppHandler();
      expect(appHandler.checkEmptyString(data)).toEqual(result);
    });
  });
});
