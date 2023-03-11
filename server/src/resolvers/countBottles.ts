import { mongo } from "../db";
import { addRangeToQuery, addWebsite, safeSearch } from "../utils";
import { Website } from '../websites';

export async function countBottles(
  parent: unknown,
  {
    fresh = false,
    rangeStart,
    rangeEnd,
    search,
    website,
  }: {
    fresh?: boolean;
    rangeStart?: number;
    rangeEnd?: number;
    search?: string;
    website?: Website[],
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
  return mongo.client.db("bottles").collection("bottles").countDocuments(query);
}
