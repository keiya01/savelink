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

  public getSQL(): [string, string[]] {
    const [fields, fieldValues] = this.parseQuery();

    const escapeKeys: string[] = [];
    for(let i = 1; i <= fields.length; i++) {
      const escapeKey = `$${i}`;
      escapeKeys.push(escapeKey);
    }

     const sql = `INSERT INTO ${this.tableName} (${fields.join()}) VALUES (${escapeKeys.join()});`;

     return [sql, fieldValues];
  }

  public create() {
    const [sql, fieldValues] = this.getSQL();

    const client = setDBClient();
    try{
      client.query(sql, fieldValues);
      return false;
    } catch(err) {
      console.error(err.stack);
      return true;
    }
  }
}