import { Client } from "pg";

export const setDBClient = () => {
  const client = new Client({
    user: 'keiya',
    host: 'localhost',
    database: 'savelink',
    password: process.env.PGPASSWORD,
    port: 5432,
  });

  client.connect();

  return client;
}
