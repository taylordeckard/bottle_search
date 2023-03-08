import { mongo } from "../db";
import { addRangeToQuery, safeSearch } from "../utils";

export async function countBottles(
  parent: unknown,
  {
    fresh = false,
    rangeStart,
    rangeEnd,
    search,
  }: {
    fresh?: boolean;
    rangeStart?: number;
    rangeEnd?: number;
    search?: string;
  } = {}
) {
  await mongo.connect();
  const query: any = {};
  safeSearch(query, search);
  addRangeToQuery(query, rangeStart, rangeEnd);
  if (fresh) {
    query["fresh"] = fresh;
  }
  return mongo.client.db("bottles").collection("bottles").countDocuments(query);
}
