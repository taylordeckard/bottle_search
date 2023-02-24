import { mongo } from "../db";

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
  if (search) {
    const safeSearch = search.replace(/[-/\\^$*+?.()|[\]{}]/g, "");
    query.title = { $regex: new RegExp(`.*${safeSearch}.*`), $options: "i" };
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
