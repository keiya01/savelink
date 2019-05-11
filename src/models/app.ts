import { setDBClient } from "../database";

export default class App {
  private tableName: string;
  private tableData: Object;

  public constructor(tableName: string, tableData: Object) {
    this.tableName = tableName;
    this.tableData = tableData;
  }

  public getTableData() {
    return this.tableData;
  }

  private getFieldValue = () => {
    const fields = Object.keys(this.tableData);
    const fieldData = fields.reduce((query: any[], field) => {
      if (!this.tableData[field]) {
        return query;
      }

      return [
        ...query,
        this.tableData[field]
      ]
    }, []);

    return fieldData;
  }

  private getEscapeKeys = (totalFields: number) => {
    const escapeKeys: string[] = [];
    for (let i = 1; i <= totalFields; i++) {
      const escapeKey = `$${i}`;
      escapeKeys.push(escapeKey);
    }

    return escapeKeys;
  }

  private getTemplateUpdatingSQL = () => {
    const fields = Object.keys(this.tableData);
    const escapeKeys = this.getEscapeKeys(fields.length);

    return fields.reduce((sql, column, index) => {
      const escapeKey = escapeKeys[index];

      if (!this.tableData[column]) {
        return sql;
      }

      if (sql === "") {
        return `${column} = ${escapeKey}`;
      }

      return `${sql}, ${column} = ${escapeKey}`;
    }, "");
  }

  private getReturningSyntax = (isReturn?: boolean) => {
    const DBColumn = Object.keys(this.tableData);
    if (DBColumn.length === 0) {
      return "";
    }
    
    let returningClause = "";
    if (isReturn) {
      returningClause = `RETURNING ${DBColumn.join()}`
    }

    return returningClause;
  }

  public getPrivateFunctionForTest = () => {
    return {
      getFieldValue: this.getFieldValue,
      getEscapeKeys: this.getEscapeKeys,
      getTemplateUpdatingSQL: this.getTemplateUpdatingSQL,
      getReturningSyntax: this.getReturningSyntax
    }
  }

  public checkErrorMessage = (errorMessage: string) => {
    const tableData = this.tableData;
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
          value: this.tableData[errorKey],
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

  public findAll = (columns: string[], _order?: { type: "ASC" | "DESC", column: string }) => {
    let order = _order;
    if (!order) {
      order = {
        type: "DESC",
        column: 'id'
      };
    }

    const sql = `SELECT ${columns.join()} FROM ${this.tableName} ORDER BY ${order.column} ${order.type};`;

    const client = setDBClient();

    return client.query(sql);
  }

  public findBy = (where: string, values: any[]) => {
    const sql = `SELECT * FROM ${this.tableName} WHERE ${where}`;

    const client = setDBClient();

    return client.query(sql, values);
  }

  public create = (isReturn?: boolean) => {
    const fields = Object.keys(this.tableData);
    const fieldValues = this.getFieldValue();

    const escapeKeys = this.getEscapeKeys(fields.length);

    let returningSyntax = "";
    if(isReturn) {
      returningSyntax = `RETURNING ${fields.join()}`
    }

    const sql = `INSERT INTO ${this.tableName} (${fields.join()}) VALUES (${escapeKeys.join()}) ${returningSyntax};`;

    const client = setDBClient();

    return client.query(sql, fieldValues);
  }

  public update = (id: string, isReturn?: boolean) => {
    const updateValue = this.getTemplateUpdatingSQL();
    const fieldData = this.getFieldValue();

    // If containing id to tableData it occur error because this.getTemplateUpdatingSQL process id.
    fieldData.push(id);

    let returningClause = this.getReturningSyntax(isReturn);

    const sql = `UPDATE ${this.tableName} SET ${updateValue} WHERE id = $${fieldData.length} ${returningClause}`;

    const client = setDBClient();
    return client.query(sql, fieldData);
  }

  public delete(id: string) {
    const sql = `DELETE FROM ${this.tableName} WHERE id = $1`;

    const client = setDBClient();
    return client.query(sql, [id]);
  }
}