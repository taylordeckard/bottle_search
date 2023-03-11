import { Website, zWebsites } from '../websites';
import { z, SafeParseReturnType } from 'zod';

const UPPER_RANGE_LIMIT = 100000;

type FixedSafeParseReturnType = SafeParseReturnType<any, AppQueryParams> & { data: AppQueryParams };

const numTransformer = (value?: string) => {
  const num = Number(value);
  return isNaN(num) ? undefined : num;
};

const boolTransformer = (value?: string) => {
  return value === "true" ? true : false;
};

const websiteTransformer = (value?: string): Website[] => {
  return value?.split(',') as Website[];
};

const rangeTransformer = (
  start: number,
  end: number,
  fallback?: number,
  value?: number,
) => {
  if (
    typeof value !== 'undefined'
    && (value < start || value > end)
  ) {
    return fallback;
  }
  return value;
};

export const zAppQueryParams = z.object({
  skip: z.string().transform(numTransformer).pipe(z.number())
    .transform(rangeTransformer.bind(
      null,
      0,
      Number.MAX_VALUE,
      50,
    )).optional(),
  limit: z.enum(['10', '25', '50', '100']).transform(numTransformer).pipe(z.number()).optional(),
  rangeStart: z.string().transform(numTransformer).pipe(z.number())
    .transform(rangeTransformer.bind(
      null,
      0,
      UPPER_RANGE_LIMIT,
      undefined,
    )).optional(),
  rangeEnd: z.string().transform(numTransformer).pipe(z.number())
    .transform(rangeTransformer.bind(
      null,
      0,
      UPPER_RANGE_LIMIT,
      undefined,
    )).optional(),
  sortColumn: z.enum([
    'title',
    'website',
    'price',
  ]).optional(),
  sortDirection: z.enum(['asc', 'desc']).optional(),
  search: z.string().optional(),
  fresh: z.string().transform(boolTransformer).pipe(z.boolean()).optional(),
  website: z.string().transform(websiteTransformer).pipe(z.array(zWebsites)).optional(),
}); 

export type AppQueryParams = z.TypeOf<typeof zAppQueryParams>;
