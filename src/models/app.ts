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
      getFieldData: () => this.getFieldData(),
      getEscapeKeys: (totalFields: number) => this.getEscapeKeys(totalFields),
      getTemplateUpdatingSQL: () => this.getTemplateUpdatingSQL()
    }
  }

  private getFieldData() {
    const fields = Object.keys(this.tableData);
    const fieldData = fields.reduce((query: any[], field) => {
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

      if(sql === "") {
        return `${column} = ${escapeKey}`;
      }

      return `${sql} ${column} = ${escapeKey}`;
    }, "");
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

    if(!data) {
      return [];
    }

    return data.rows;
  }

  public async findBy(where: string, values: any[]) {
    const sql = `SELECT * FROM ${this.tableName} WHERE ${where}`;

    const client = setDBClient();
    
    const data = await client.query(sql, values).catch(err => console.error(err));

    if(!data) {
      return null;
    }

    return data.rows[0];
  }

  public create() {
    const fields = Object.keys(this.tableData);
    const fieldValues = this.getFieldData();

    const escapeKeys = this.getEscapeKeys(fields.length);

    const sql = `INSERT INTO ${this.tableName} (${fields.join()}) VALUES (${escapeKeys.join()});`;
    
    const client = setDBClient();
    client.query(sql, fieldValues).catch(err => console.error(err.stack));
  }

  public update(id: string) {
    const updateValue = this.getTemplateUpdatingSQL();
    const fieldData = this.getFieldData();
    fieldData.push(id);

    const sql = `UPDATE ${this.tableName} SET ${updateValue} WHERE id = $${fieldData.length}`;

    const client = setDBClient();
    client.query(sql, fieldData).catch(err => console.error(err));
  }
}