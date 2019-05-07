/* eslint-disable no-undef */

import AppHandler from "../app_handler";

describe("Validate uri", () => {
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
      description: "Check the uri Check the uri that don't include .com",
      data: "https://test",
      result: false
    }
  ];

  tests.map(({description, data, result}) => {
    test(description, () => {
      const appHandler = new AppHandler();
      expect(appHandler.validateURI(data)).toEqual(result);
    })
  });
});