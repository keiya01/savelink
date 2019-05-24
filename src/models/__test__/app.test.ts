/* eslint-disable no-undef */

import App from "../app";

interface TableDataProps {
  id?: string,
  text?: string,
  created_at?: Date
}

describe("Change one map into one array containing two arrays", () => {
  const tests = [
    {
      description: "Change data map to array",
      data: <TableDataProps>{
        id: "1",
        text: "Hello",
        created_at: new Date()
      },
      result: ["1", "Hello", new Date()]
    },
    {
      description: "Change data map that is include undefined object to array",
      data: <TableDataProps>{
        id: "1",
        created_at: new Date(),
      },
      result: ["1", new Date()]
    }
  ];

  tests.map(item => {
    test(item.description, () => {
      const app = new App("Test");

      expect(app.getFieldValue(item.data)).toEqual(item.result);
    });
  });
});

describe("Get escape key such as $1 or $2 etc from table data", () => {
  const tests = [
    {
      description: "Get escape key from data property",
      data: <TableDataProps>{
        id: "1",
        text: "test",
        created_at: new Date
      },
      result: ["$1", "$2", "$3"],
    },
    {
      description: "Check whether this function checks for undefined values",
      data: <TableDataProps>{
        id: "1",
        text: "check undefined",
      },
      result: ["$1", "$2"],
    }
  ];

  tests.map(testData => {
    const { description, data, result } = testData;
    test(description, () => {
      const app = new App("Test");
      expect(app.getEscapeKeys(Object.keys(data).length))
        .toEqual(result);
    });
  });
});

describe("Get a template for updating data for SQL", () => {
  const tests = [
    {
      description: "Get a template from data",
      data: <TableDataProps>{
        id: "1",
        text: "test",
        created_at: new Date
      },
      result: "text = $1, created_at = $2",
    },
    {
      description: "Get a template from data that is include undefined object",
      data: <TableDataProps>{
        id: "1",
        text: "check undefined",
      },
      result: "text = $1",
    }
  ];

  tests.map(item => {
    test(item.description, () => {
      const app = new App("Test");

      expect(app.getTemplateUpdatingSQL(item.data))
        .toEqual(item.result);
    });
  });
});


describe("Check getReturningSyntax function that get RETURNING syntax for postgreSQL", () => {
  const tests = [
    {
      description: "Check whether function can get syntax that include 3 values",
      data: {
        tableData: {
          id: "1",
          username: "test",
          email: "test@mail.com"
        },
        isReturn: true
      },
      result: "RETURNING id,username,email",
    },
    {
      description: "Check whether function can get syntax that include 2 values",
      data: {
        tableData: {
          id: "1",
          email: "test@mail.com"
        },
        isReturn: true
      },
      result: "RETURNING id,email"
    },
    {
      description: "Check whether function can get syntax that include 1 values",
      data: {
        tableData: { id: "1" },
        isReturn: true
      },
      result: "RETURNING id"
    },
    {
      description: "Check whether function can get syntax that include 0 values",
      data: {
        tableData: {},
        isReturn: true
      },
      result: ""
    },
    {
      description: "Check whether empty string is returned when argument is false",
      data: {
        tableData: {},
        isReturn: false
      },
      result: ""
    },
  ];

  tests.map(({ description, data, result }) => {
    test(description, () => {
      const app = new App("Test");
      expect(app.getReturningSyntax(data.tableData, data.isReturn))
        .toEqual(result);
    });
  });
});