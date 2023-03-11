import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition, useCallback, useState } from "react";
import { Website } from '../websites';
import { AppQueryParams, zAppQueryParams } from './types'
import { SafeParseSuccess } from 'zod';

export function useQueryParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const setQueryParams = (
    paramsToSet: AppQueryParams,
  ) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      Object.entries(paramsToSet).forEach(([key, value]) => {
        if (typeof value !== 'undefined') {
          if (key === 'website') {
            params.set(key, (value as Website[]).join(','));
          } else {
            params.set(key, value as string);
          }
        }
      });
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const searchParamsObj = Object.fromEntries(searchParams.entries());

  let validated = zAppQueryParams.safeParse(searchParamsObj);

  if (!validated.success) {
    // If there were any validation errors, remove the bad keys and parse again
    validated.error.issues.forEach((iss) => {
      const key = iss.path[0] as keyof AppQueryParams;
      delete searchParamsObj[key];
      validated = zAppQueryParams.safeParse(searchParamsObj);
    });
  }

  const queryParams: AppQueryParams = (validated as SafeParseSuccess<AppQueryParams>).data ?? {};

  return {
    queryParams,
    setQueryParams,
    clearQueryParams: () => {
      startTransition(() => {
        router.replace(`${pathname}`);
      });
    },
  };
}
