import Image from "next/image";
import styles from "./page.module.scss";
import { gql } from "@apollo/client";
import client from "../apollo-client";
import ProductTable from "./table";
import Toolbar from "./toolbar";
import Search from "./search";
import Pager from "./pager";
import { AppQueryParams, zAppQueryParams } from './types';
import { SafeParseSuccess } from 'zod';

export interface AppStringQueryParams {
  fresh?: string;
  limit?: string;
  rangeStart?: string;
  rangeEnd?: string;
  search?: string;
  skip?: string;
  sortColumn?: string;
  sortDirection?: string;
  website?: string;
}

export const revalidate = 0;

async function fetchData(params: AppStringQueryParams = {}) {
  const defaults = {
    fresh: false,
    limit: 50,
    search: "",
    skip: 0,
    sortDirection: "asc",
    sortColumn: "price",
  }
  let parsed = zAppQueryParams.safeParse(params);
  let error = false;
  if (!parsed.success) {
    parsed.error.issues.forEach((iss) => {
      const key = iss.path[0] as keyof AppStringQueryParams;
      delete params[key];
      parsed = zAppQueryParams.safeParse(params);
      if (!parsed.success) {
        error = true;
      }
    });
  }
  if (error) {
    return { bottles: [], count: 0 };
  }

  const validated = (parsed as SafeParseSuccess<AppQueryParams>).data;
  type ValuesType<T> = T[keyof T];
  // Remove all undefined values from the validated parameters object
  // so defaults can be set
  Object.entries(validated).forEach(([key, val]) => {
    if (typeof val === 'undefined') {
      delete (validated as { [key: string]: ValuesType<AppQueryParams> })[key];
    }
  });

  const variables = Object.assign({}, defaults, validated);
  const {
    fresh,
    rangeStart,
    rangeEnd,
    search,
    website,
  } = variables;

  const result = {
    bottles: (
      await client.query({
        variables,
        query: gql`
          query getBottles(
            $fresh: Boolean
            $limit: Int
            $rangeStart: Float
            $rangeEnd: Float
            $search: String
            $skip: Int
            $sortDirection: SortDirection
            $sortColumn: String
            $website: [Website]
          ) {
            bottles(
              fresh: $fresh
              skip: $skip
              limit: $limit
              rangeStart: $rangeStart
              rangeEnd: $rangeEnd
              search: $search
              sortColumn: $sortColumn
              sortDirection: $sortDirection
              website: $website
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
      })
    )?.data?.bottles,
    count: (
      await client.query({
        variables: {
          fresh,
          rangeStart,
          rangeEnd,
          search,
          website,
        },
        query: gql`
          query countBottles(
            $fresh: Boolean
            $rangeStart: Float
            $rangeEnd: Float
            $search: String
            $website: [Website]
          ) {
            countBottles(
              fresh: $fresh
              rangeStart: $rangeStart
              rangeEnd: $rangeEnd
              search: $search
              website: $website
            )
          }
        `,
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
    website?: string,
  };
}) {
  const { bottles, count } = await fetchData({
    fresh: searchParams.fresh,
    limit: searchParams.limit,
    rangeStart: searchParams.rangeStart,
    rangeEnd: searchParams.rangeEnd,
    skip: searchParams.skip,
    search: searchParams.search,
    sortColumn: searchParams.sortColumn,
    sortDirection: searchParams.sortDirection,
    website: searchParams.website,
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
