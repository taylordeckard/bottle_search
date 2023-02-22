import { MongoClient } from "mongodb";

export class DB {
  public client: MongoClient;

  constructor() {
    const user = process.env.DB_USER;
    const password = process.env.DB_PASSWORD;
    const host = process.env.DB_HOST;
    const port = process.env.DB_PORT;
    const url = `mongodb://${user}:${password}@${host}:${port}?retryWrites=true&w=majority`;
    this.client = new MongoClient(url);
  }

  public connect() {
    return this.client.connect();
  }
}
