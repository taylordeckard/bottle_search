import { Website } from './websites';

export function safeSearch(query: any, search?: string) {
  if (search) {
    const safeSearch = search.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    query.title = { $regex: new RegExp(`.*${safeSearch}.*`), $options: "i" };
  }
}

const UPPER_RANGE_LIMIT = 100000;

function isInvalidNumber(num?: number) {
  return !num || isNaN(num as number);
}

export function addRangeToQuery(
  query: any,
  rangeStart?: number,
  rangeEnd?: number
) {
  let start = rangeStart;
  let end = rangeEnd;
  if (isInvalidNumber(rangeStart) || (rangeStart as number) < 0) {
    start = 0;
  }
  if (isInvalidNumber(rangeEnd) || (rangeEnd as number) > UPPER_RANGE_LIMIT) {
    end = UPPER_RANGE_LIMIT;
  }
  if (start !== 0 || end !== UPPER_RANGE_LIMIT) {
    query["price"] = { $gte: start, $lt: end };
  }
}

export function addWebsite (query: any, value?: Website[]) {
  if (value) {
    query['website'] = { $in: value };
  }
}
