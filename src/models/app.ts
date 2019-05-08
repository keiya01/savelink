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

  public getPrivateFunctionForTest = () => {
    return {
      getFieldValue: () => this.getFieldValue(),
      getEscapeKeys: (totalFields: number) => this.getEscapeKeys(totalFields),
      getTemplateUpdatingSQL: () => this.getTemplateUpdatingSQL()
    }
  }

  private getFieldValue() {
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

  private getEscapeKeys(totalFields: number) {
    const escapeKeys: string[] = [];
    for (let i = 1; i <= totalFields; i++) {
      const escapeKey = `$${i}`;
      escapeKeys.push(escapeKey);
    }

    return escapeKeys;
  }

  private getTemplateUpdatingSQL() {
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

      return `${sql} ${column} = ${escapeKey}`;
    }, "");
  }

  private checkErrorMessage(errorMessage: string) {
    const keys = Object.keys(this.tableData);
    const errors = [
      "unique"
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
      key: null,
      type: "db_error"
    };
  }

  public async findAll(columns: string[], _order?: { type: "ASC" | "DESC", column: string }) {
    let order = _order;
    if (!order) {
      order = {
        type: "DESC",
        column: 'id'
      };
    }

    const sql = `SELECT ${columns.join()} FROM ${this.tableName} ORDER BY ${order.column} ${order.type};`;

    const client = setDBClient();

    const data = await client.query(sql).catch((err) => console.error(err.stack));

    if (!data) {
      return [];
    }

    return data.rows;
  }

  public async findBy(where: string, values: any[]) {
    const sql = `SELECT * FROM ${this.tableName} WHERE ${where}`;

    const client = setDBClient();

    const data = await client.query(sql, values).catch(err => console.error(err));

    if (!data) {
      return null;
    }

    return data.rows[0];
  }

  public create = async () => {
    const fields = Object.keys(this.tableData);
    const fieldValues = this.getFieldValue();

    const escapeKeys = this.getEscapeKeys(fields.length);

    const sql = `INSERT INTO ${this.tableName} (${fields.join()}) VALUES (${escapeKeys.join()});`;

    const client = setDBClient();

    let error: Object | null = null;
    try {
      await client.query(sql, fieldValues)
    } catch (err) {
      error = this.checkErrorMessage(err.stack);
      console.error(err.stack);
    }

    return error;
  }

  public update(id: string) {
    const updateValue = this.getTemplateUpdatingSQL();
    const fieldData = this.getFieldValue();

    // If containing id to tableData it occur error because this.getTemplateUpdatingSQL process id.
    fieldData.push(id);

    const sql = `UPDATE ${this.tableName} SET ${updateValue} WHERE id = $${fieldData.length}`;

    const client = setDBClient();
    return client.query(sql, fieldData);
  }

  public delete(id: string) {
    const sql = `DELETE FROM ${this.tableName} WHERE id = $1`;

    const client = setDBClient();
    return client.query(sql, [id]);
  }
}