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
      const app = new App("Test", item.data);

      expect(app.getPrivateFunctionForTest().getFieldValue()).toEqual(item.result);
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
      const app = new App("Test", data);
      expect(app.getPrivateFunctionForTest().getEscapeKeys(Object.keys(data).length))
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
      result: "id = $1 text = $2 created_at = $3",
    },
    {
      description: "Get a template from data that is include undefined object",
      data: <TableDataProps>{
        id: "1",
        text: "check undefined",
      },
      result: "id = $1 text = $2",
    }
  ];

  tests.map(item => {
    test(item.description, () => {
      const app = new App("Test", item.data);
      
      expect(app.getPrivateFunctionForTest().getTemplateUpdatingSQL())
      .toEqual(item.result);
    });
  });
});
