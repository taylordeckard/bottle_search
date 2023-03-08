import { mongo } from "../db";
import { safeSearch } from "../utils";

export async function countBottles(
  parent: unknown,
  {
    fresh = false,
    search,
  }: {
    fresh?: boolean;
    search?: string;
  } = {}
) {
  await mongo.connect();
  const query: any = {};
  safeSearch(query, search);
  if (fresh) {
    query['fresh'] = fresh;
  }
  return mongo.client.db("bottles").collection("bottles").countDocuments(query);
}
