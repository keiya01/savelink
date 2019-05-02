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
  expect(app.getFieldData()).toEqual([id, text, created_at])
});

test("Get escape key such as $1 or $2 etc from table data", () => {
  const tableData = {
    id: 1,
    text: "Hello",
    created_at: new Date
  }
  const app = new App("Test", tableData);

  expect(app.getEscapeKeys(Object.keys(tableData).length))
    .toEqual(["$1", "$2", "$3"]);
});

test("Get a template for updating data for SQL", () => {
  const tableData = {
    id: 1,
    text: "Hello",
    created_at: new Date
  }
  const app = new App("Test", tableData);

  const field = Object.keys(tableData);
  expect(app.getTemplateUpdatingSQL())
    .toEqual(`${field[0]} = $1 ${field[1]} = $2 ${field[2]} = $3`);
});
