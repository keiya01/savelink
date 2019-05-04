/* eslint-disable no-undef */

import App from "../app";

test("Change one object into one array containing two arrays", () => {
  const tableData = {
    id: 1,
    text: "Hello",
    created_at: new Date
  }
  const app = new App("Test", tableData);

  const { id, text, created_at } = tableData;
  expect(app.getPrivateFunctionForTest().getFieldValue()).toEqual([id, text, created_at])
});

describe("Get escape key such as $1 or $2 etc from table data", () => {
  type TableDataProps = {
    id?: string,
    text?: string,
    created_at?: Date
  }

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
  ]

  tests.map(testData => {
    const { description, data, result } = testData;
    test(description, () => {
      const app = new App("Test", data);
      expect(app.getPrivateFunctionForTest().getEscapeKeys(Object.keys(data).length))
        .toEqual(result);
    });
  });
});

test("Get a template for updating data for SQL", () => {
  const tableData = {
    id: 1,
    text: "Hello",
    created_at: new Date
  }
  const app = new App("Test", tableData);

  const field = Object.keys(tableData);
  expect(app.getPrivateFunctionForTest().getTemplateUpdatingSQL())
    .toEqual(`${field[0]} = $1 ${field[1]} = $2 ${field[2]} = $3`);
});
