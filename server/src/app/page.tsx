import Image from "next/image";
import styles from "./page.module.scss";
import { gql } from "@apollo/client";
import client from "../apollo-client";
import ProductTable from './table';
import Toolbar from './toolbar';
import Search from './search';
import Pager from './pager';

export async function fetchData({
  limit: limitStr = '50',
  search = "",
  skip: skipStr = '0',
  sortDir = "asc",
  sortKey = "price",
}: {
  limit?: string;
  search?: string;
  skip?: string;
  sortDir?: string;
  sortKey?: string;
} = {}) {
  let limit = Number(limitStr);
  let skip = Number(skipStr);
  if (isNaN(limit) || limit > 100 || limit < 0) {
    limit = 50;
  }
  if (isNaN(skip) || skip < 0) {
    skip = 50;
  }
  return {
    bottles: (await client.query({
      query: gql`
      query getBottles(
        $skip: Int
        $limit: Int
        $search: String
        $sortKey: String
        $sortDir: SortDir
      ) {
        bottles(
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
        }
      }
      `,
      variables: {
        limit,
        search,
        skip,
        sortDir,
        sortKey,
      },
    }))?.data?.bottles,
    count: (await client.query({
      query: gql`
      query countBottles($search: String) {
        countBottles(search: $search)
      }
      `,
      variables: { search },
    })).data.countBottles,
  }
}

export default async function Home({ searchParams }: {
  searchParams: {
    skip: string;
    limit: string;
    search: string;
    sortColumn?: 'title' | 'price' | 'website';
    sortDirection?: 'asc' | 'desc';
  },
}) {
  const { bottles, count } = await fetchData({
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
        <Search />
      </div>
      <div className={styles.tableContainer}>
        <ProductTable products={bottles} />
        <Pager total={count} />
      </div>
    </main>
  );
}
