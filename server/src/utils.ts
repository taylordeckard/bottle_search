export function safeSearch(query: any, search?: string) {
  if (search) {
    const safeSearch = search.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    query.title = { $regex: new RegExp(`.*${safeSearch}.*`), $options: "i" };
  }
}
