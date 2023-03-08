import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition, useCallback } from "react";

export interface AppQueryParams {
  skip?: number;
  limit?: number;
  sortColumn?: "title" | "website" | "price";
  sortDirection?: "asc" | "desc";
  search?: string;
  fresh?: boolean;
}

export function useQueryParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryParams: AppQueryParams = {};
  searchParams.forEach((value, key) => {
    if (
      [
        "fresh",
        "limit",
        "search",
        "skip",
        "sortColumn",
        "sortDirection",
      ].includes(key)
    ) {
      let knownKey = key as keyof AppQueryParams;
      if (
        key === "sortColumn" &&
        ["title", "website", "price"].includes(value)
      ) {
        const knownValue = value as "title" | "website" | "price";
        queryParams.sortColumn = knownValue;
      } else if (key === "sortDirection" && ["asc", "desc"].includes(value)) {
        const knownValue = value as "asc" | "desc";
        queryParams.sortDirection = knownValue;
      } else if (["skip", "limit"].includes(key)) {
        knownKey = knownKey as "skip" | "limit";
        const num = Number(value);
        queryParams[knownKey] = isNaN(num) ? undefined : num;
      } else if (key === "fresh") {
        knownKey = knownKey as "fresh";
        queryParams[knownKey] = value === 'true' ? true : false;
      } else {
        knownKey = knownKey as "search";
        queryParams[knownKey] = value;
      }
    }
  });

  return {
    queryParams,
    setQueryParams: (paramsToSet: AppQueryParams) => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams);
        Object.entries(paramsToSet).forEach(([key, value]) => {
          params.set(key, value);
        });
        router.replace(`${pathname}?${params.toString()}`);
      });
    },
  };
}
