/* eslint-disable no-undef */

import App from "../app";

test("Change one object into one array containing two arrays", () => {
  const tableData = {
    id: 1,
    text: "Hello",
    created_at: new Date
  }
  const app = new App("Test", tableData);
  
  const {id, text, created_at} = tableData;
  expect(app.parseQuery()).toEqual([
    Object.keys(tableData),
    [id, text, created_at]
  ])
});

test("Change an array containing field and request data into a SQL function", () => {
  const tableName = "Test";
  const tableData = {
    id: 1,
    text: "Hello",
    created_at: new Date
  };

  const app = new App(tableName, tableData);

  const {id, text, created_at} = tableData;
  const sql = `INSERT INTO ${tableName} (${Object.keys(tableData)}) VALUES ($1,$2,$3);`;
  expect(app.getSQL()).toEqual([sql, [id, text, created_at]]);
});
