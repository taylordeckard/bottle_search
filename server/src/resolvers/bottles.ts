import { mongo } from "../db";
import { safeSearch } from "../utils";

export async function getBottles(
  parent: unknown,
  {
    skip = 0,
    limit = 20,
    search,
    sortKey = "price",
    sortDir = "asc",
  }: {
    skip?: number;
    limit?: number;
    search?: string;
    sortKey?: string;
    sortDir?: "asc" | "desc";
  } = {}
) {
  await mongo.connect();
  const query: any = {};
  safeSearch(query, search);
  return mongo.client
    .db("bottles")
    .collection("bottles")
    .find(query)
    .sort(sortKey, sortDir === "asc" ? 1 : -1)
    .skip(skip)
    .limit(limit)
    .toArray();
}
