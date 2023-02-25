import { mongo } from "../db";

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
  if (search) {
    const safeSearch = search.replace(/[-/\\^$*+?.()|[\]{}]/g, "");
    query.title = { $regex: new RegExp(`.*${safeSearch}.*`), $options: "i" };
  }
  return mongo.client
    .db("bottles")
    .collection("bottles")
    .countDocuments(query);
}
