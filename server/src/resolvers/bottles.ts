import { mongo } from "../db";
import { safeSearch, addRangeToQuery } from "../utils";

export async function getBottles(
  parent: unknown,
  {
    fresh = false,
    limit = 20,
    rangeStart,
    rangeEnd,
    search,
    skip = 0,
    sortDir = "asc",
    sortKey = "price",
  }: {
    fresh?: boolean;
    limit?: number;
    rangeStart?: number;
    rangeEnd?: number;
    search?: string;
    skip?: number;
    sortDir?: "asc" | "desc";
    sortKey?: string;
  } = {}
) {
  await mongo.connect();
  const query: any = {};
  safeSearch(query, search);
  addRangeToQuery(query, rangeStart, rangeEnd);
  if (fresh) {
    query["fresh"] = fresh;
  }
  return mongo.client
    .db("bottles")
    .collection("bottles")
    .find(query)
    .sort(sortKey, sortDir === "asc" ? 1 : -1)
    .skip(skip)
    .limit(limit)
    .toArray();
}
