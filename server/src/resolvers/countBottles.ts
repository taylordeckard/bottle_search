import { mongo } from "../db";
import { safeSearch } from "../utils";

export async function countBottles(
  parent: unknown,
  {
    search,
  }: {
    search?: string;
  } = {}
) {
  await mongo.connect();
  const query: any = {};
  safeSearch(query, search);
  return mongo.client.db("bottles").collection("bottles").countDocuments(query);
}
