import { setDBClient } from "../database";

export default class App {
  public tableName: string;
  public tableData: Object;

  public constructor(tableName: string, tableData: Object) {
    this.tableName = tableName;
    this.tableData = tableData;
  }

  public parseQuery() {
    const fields = Object.keys(this.tableData);

    const query = fields.reduce((query, field) => {
      return [
        fields,
        [
          ...query[1],
          this.tableData[field]
        ]
      ]
    }, [fields, []]);

    return query;
  }

  public getEscapeKeys(totalFields: number) {
    const escapeKeys: string[] = [];
    for (let i = 1; i <= totalFields; i++) {
      const escapeKey = `$${i}`;
      escapeKeys.push(escapeKey);
    }

    return escapeKeys.join();
  }

  public getInsertSQL(): [string, string[]] {
    const [fields, fieldValues] = this.parseQuery();

    const escapeKeys = this.getEscapeKeys(fields.length);

    const sql = `INSERT INTO ${this.tableName} (${fields.join()}) VALUES (${escapeKeys});`;

    return [sql, fieldValues];
  }

  public create() {
    const [sql, fieldValues] = this.getInsertSQL();
    
    const client = setDBClient();
    client.query(sql, fieldValues).catch(err => console.error(err.stack));
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
}