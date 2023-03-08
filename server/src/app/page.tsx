import Image from "next/image";
import styles from "./page.module.scss";
import { gql } from "@apollo/client";
import client from "../apollo-client";
import ProductTable from "./table";
import Toolbar from "./toolbar";
import Search from "./search";
import Pager from "./pager";

export const revalidate = 0;

async function fetchData({
  fresh: freshStr = 'false',
  limit: limitStr = "50",
  search = "",
  skip: skipStr = "0",
  sortDir = "asc",
  sortKey = "price",
}: {
  fresh?: string;
  limit?: string;
  search?: string;
  skip?: string;
  sortDir?: string;
  sortKey?: string;
} = {}) {
  let limit = Number(limitStr);
  let skip = Number(skipStr);
  let fresh = freshStr === 'true' ? true : false;
  if (isNaN(limit) || limit > 100 || limit < 0) {
    limit = 50;
  }
  if (isNaN(skip) || skip < 0) {
    skip = 50;
  }
  const result = {
    bottles: (
      await client.query({
        query: gql`
          query getBottles(
            $fresh: Boolean
            $limit: Int
            $search: String
            $skip: Int
            $sortDir: SortDir
            $sortKey: String
          ) {
            bottles(
              fresh: $fresh
              skip: $skip
              limit: $limit
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
          query countBottles($fresh: Boolean, $search: String) {
            countBottles(fresh: $fresh, search: $search)
          }
        `,
        variables: { fresh, search },
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
    search?: string;
    skip?: string;
    sortColumn?: "title" | "price" | "website";
    sortDirection?: "asc" | "desc";
  };
}) {
  const { bottles, count } = await fetchData({
    fresh: searchParams.fresh,
    limit: searchParams.limit,
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
