import Image from "next/image";
import styles from "./page.module.scss";
import { gql } from "@apollo/client";
import client from "../apollo-client";
import ProductTable from "./table";
import Toolbar from "./toolbar";
import Search from "./search";
import Pager from "./pager";

export interface AppStringQueryParams {
  fresh?: string;
  limit?: string;
  rangeStart?: string;
  rangeEnd?: string;
  search?: string;
  skip?: string;
  sortDir?: string;
  sortKey?: string;
}

export const revalidate = 0;

const UPPER_RANGE_LIMIT = 100000;

async function fetchData({
  fresh: freshStr = "false",
  limit: limitStr = "50",
  rangeStart: rangeStartStr,
  rangeEnd: rangeEndStr,
  search = "",
  skip: skipStr = "0",
  sortDir = "asc",
  sortKey = "price",
}: AppStringQueryParams = {}) {
  let limit = Number(limitStr);
  let skip = Number(skipStr);
  let rangeStart: number | undefined = Number(rangeStartStr);
  let rangeEnd: number | undefined = Number(rangeEndStr);
  let fresh = freshStr === "true" ? true : false;
  if (isNaN(limit) || limit > 100 || limit < 0) {
    limit = 50;
  }
  if (isNaN(skip) || skip < 0) {
    skip = 0;
  }
  if (isNaN(rangeStart) || rangeStart < 0) {
    rangeStart = undefined;
  }
  if (isNaN(rangeEnd) || rangeEnd > UPPER_RANGE_LIMIT) {
    rangeEnd = undefined;
  }
  const result = {
    bottles: (
      await client.query({
        query: gql`
          query getBottles(
            $fresh: Boolean
            $limit: Int
            $rangeStart: Float
            $rangeEnd: Float
            $search: String
            $skip: Int
            $sortDir: SortDir
            $sortKey: String
          ) {
            bottles(
              fresh: $fresh
              skip: $skip
              limit: $limit
              rangeStart: $rangeStart
              rangeEnd: $rangeEnd
              search: $search
              sortKey: $sortKey
              sortDir: $sortDir
            ) {
              _id
              title
              price
              link
              website
              fresh
            }
          }
        `,
        variables: {
          fresh,
          limit,
          rangeStart,
          rangeEnd,
          search,
          skip,
          sortDir,
          sortKey,
        },
      })
    )?.data?.bottles,
    count: (
      await client.query({
        query: gql`
          query countBottles(
            $fresh: Boolean
            $rangeStart: Float
            $rangeEnd: Float
            $search: String
          ) {
            countBottles(
              fresh: $fresh
              rangeStart: $rangeStart
              rangeEnd: $rangeEnd
              search: $search
            )
          }
        `,
        variables: {
          fresh,
          rangeStart,
          rangeEnd,
          search,
        },
      })
    ).data?.countBottles,
  };
  return result;
}

export default async function Home({
  searchParams,
}: {
  searchParams: {
    fresh?: string;
    limit?: string;
    rangeStart?: string;
    rangeEnd?: string;
    search?: string;
    skip?: string;
    sortColumn?: "title" | "price" | "website";
    sortDirection?: "asc" | "desc";
  };
}) {
  const { bottles, count } = await fetchData({
    fresh: searchParams.fresh,
    limit: searchParams.limit,
    rangeStart: searchParams.rangeStart,
    rangeEnd: searchParams.rangeEnd,
    skip: searchParams.skip,
    search: searchParams.search,
    sortKey: searchParams.sortColumn,
    sortDir: searchParams.sortDirection,
  });
  return (
    <main>
      <div className={styles.toolbar}>
        <Toolbar />
      </div>
      <div className={styles.tableContainer}>
        <ProductTable products={bottles} />
        <Pager total={count} />
      </div>
    </main>
  );
}
