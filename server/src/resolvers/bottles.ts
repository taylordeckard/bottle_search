import { mongo } from "../db";
import { safeSearch, addRangeToQuery, addWebsite } from "../utils";
import { Website } from '../websites';

export async function getBottles(
  parent: unknown,
  {
    fresh = false,
    limit = 20,
    rangeStart,
    rangeEnd,
    search,
    skip = 0,
    sortDirection = "asc",
    sortColumn = "price",
    website,
  }: {
    fresh?: boolean;
    limit?: number;
    rangeStart?: number;
    rangeEnd?: number;
    search?: string;
    skip?: number;
    sortDirection?: "asc" | "desc";
    sortColumn?: string;
    website?: Website[];
  } = {}
) {
  await mongo.connect();
  const query: any = {};
  safeSearch(query, search);
  addRangeToQuery(query, rangeStart, rangeEnd);
  addWebsite(query, website);
  if (fresh) {
    query["fresh"] = fresh;
  }
  return mongo.client
    .db("bottles")
    .collection("bottles")
    .find(query)
    .sort(sortColumn, sortDirection === "asc" ? 1 : -1)
    .skip(skip)
    .limit(limit)
    .toArray();
}
