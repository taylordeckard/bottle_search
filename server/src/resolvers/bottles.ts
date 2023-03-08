import { mongo } from "../db";
import { safeSearch } from "../utils";

export async function getBottles(
  parent: unknown,
  {
    fresh = false,
    limit = 20,
    search,
    skip = 0,
    sortDir = "asc",
    sortKey = "price",
  }: {
    fresh?: boolean;
    limit?: number;
    search?: string;
    skip?: number;
    sortDir?: "asc" | "desc";
    sortKey?: string;
  } = {}
) {
  await mongo.connect();
  const query: any = {};
  safeSearch(query, search);
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
