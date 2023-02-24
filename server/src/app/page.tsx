import Image from "next/image";
import styles from "./page.module.scss";
import { gql } from "@apollo/client";
import client from "../apollo-client";
import ProductTable from './table';
import Toolbar from './toolbar';
import Search from './search';

export async function fetchData({
  limit = 20,
  search = "",
  skip = 0,
  sortDir = "asc",
  sortKey = "price",
}: {
  limit?: number;
  search?: string;
  skip?: number;
  sortDir?: string;
  sortKey?: string;
} = {}) {
  return (
    await client.query({
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
    })
  )?.data?.bottles;
}

export default async function Home({ searchParams }: {
  searchParams: {
    search: string;
    sortColumn?: 'title' | 'price' | 'website';
    sortDirection?: 'asc' | 'desc';
  },
}) {
  const products = await fetchData({
    limit: 50,
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
        <ProductTable products={products} />
      </div>
    </main>
  );
}
