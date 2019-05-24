import { setDBClient } from "../database";

export interface Order {
  type: "ASC" | "DESC";
  column: string;
}

export default class App {
  private tableName: string;

  public constructor(tableName: string) {
    this.tableName = tableName;
  }

  public getTableData<T>(tableData: T) {
    return tableData;
  }

  public getFieldValue = <T>(tableData: T) => {
    return Object.values(tableData);

  }

  public getEscapeKeys = (totalFields: number) => {
    const escapeKeys: string[] = [];
    for (let i = 1; i <= totalFields; i++) {
      const escapeKey = `$${i}`;
      escapeKeys.push(escapeKey);
    }

    return escapeKeys;
  }

  public getTemplateUpdatingSQL = <T>(tableData: T) => {
    const fields = Object.keys(tableData).slice(1);
    const escapeKeys = this.getEscapeKeys(fields.length);

    return fields.reduce((sql, column, index) => {
      const escapeKey = escapeKeys[index];

      if (sql === "") {
        return `${column} = ${escapeKey}`;
      }

      return `${sql}, ${column} = ${escapeKey}`;
    }, "");
  }

  public getReturningSyntax = <T>(tableData: T, isReturn?: boolean) => {
    const DBColumn = Object.keys(tableData);
    if (DBColumn.length === 0) {
      return "";
    }

    let returningClause = "";
    if (isReturn) {
      returningClause = `RETURNING ${DBColumn.join()}`
    }

    return returningClause;
  }

  public checkErrorMessage = <T>(tableData: T, errorMessage: string) => {
    const keys = Object.keys(tableData);
    const errors = [
      "unique",
      "violates"
    ];

    for (let i = 0; i < errors.length; i++) {
      const error = errors[i];
      if (errorMessage.includes(error)) {
        const errorKey = keys.reduce((errorKey, key) => {
          if (errorMessage.includes(key)) {
            return key;
          }

          if (errorKey !== "") {
            return errorKey;
          }

          return "";
        }, "");

        return {
          key: errorKey,
          value: tableData[errorKey],
          type: error
        };
      }
    }

    return {
      keys,
      values: tableData,
      type: "db_error"
    };
  }

  public exec = (sql: string, values?: any[]) => {
    const client = setDBClient();

    return client.query(sql, values);
  }

  public findAll = (_order?: Order, limit?: number, offset?: number) => {
    let order = _order;
    if (!order) {
      order = {
        type: "ASC",
        column: 'id'
      };
    }

    let limitClause = "";
    if (limit) {
      limitClause = `LIMIT ${limit}`;
    }

    let offsetClause = "";
    if (offset) {
      offsetClause = `OFFSET ${offset}`;
    }

    const sql = `
      SELECT * FROM ${this.tableName} 
      ORDER BY ${order.column} ${order.type} 
      ${limitClause} 
      ${offsetClause};
    `;

    return this.exec(sql);
  }

  public findBy = (where: string, values: any[], _order?: Order, limit?: number, offset?: number) => {
    let order = _order;
    if (!order) {
      order = {
        type: "ASC",
        column: 'id'
      };
    }

    let limitClause = "";
    if (limit) {
      limitClause = `LIMIT ${limit}`;
    }

    let offsetClause = "";
    if (offset) {
      offsetClause = `OFFSET ${offset}`;
    }

    const sql = `
      SELECT * FROM ${this.tableName} 
      WHERE ${where} 
      ORDER BY ${order.column} ${order.type} 
      ${limitClause} 
      ${offsetClause};
    `;

    return this.exec(sql, values);
  }

  public create = <T>(tableData: T, isReturn?: boolean) => {
    const fields = Object.keys(tableData);
    const fieldValues = this.getFieldValue(tableData);

    const escapeKeys = this.getEscapeKeys(fields.length);

    let returningSyntax = "";
    if (isReturn) {
      returningSyntax = `RETURNING ${fields.join()}`
    }

    const sql = `INSERT INTO ${this.tableName} (${fields.join()}) VALUES (${escapeKeys.join()}) ${returningSyntax};`;

    return this.exec(sql, fieldValues);
  }

  public update = <T>(tableData: T, isReturn?: boolean) => {
    const updateValue = this.getTemplateUpdatingSQL(tableData);
    const fieldData = this.getFieldValue(tableData);

    let returningClause = this.getReturningSyntax(isReturn);

    const sql = `UPDATE ${this.tableName} SET ${updateValue} WHERE id = $${fieldData.length} ${returningClause};`;

    // id must be placed last in array
    const values = [
      ...fieldData.slice(1),
      fieldData[0],
    ];

    return this.exec(sql, values);
  }

  public delete(id: string) {
    const sql = `DELETE FROM ${this.tableName} WHERE id = $1;`;

    return this.exec(sql, [id]);
  }
}