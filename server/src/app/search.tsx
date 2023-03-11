"use client";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEventHandler, startTransition, useCallback, useEffect, useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { useQueryParams } from "./useQueryParams";

const SearchWrapper = styled("div")(({ theme }) => ({
  position: "relative",
  alignSelf: "flex-end",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: "auto",
  marginRight: "20px",
  minWidth: "200px",
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export default function Search({ className = "" }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { queryParams, setQueryParams } = useQueryParams();
  const [search, setSearch] = useState(queryParams.search ?? '');
  function debounceSearch(
    func: (val: string) => void,
  ): ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> {
    let timer: ReturnType<typeof setTimeout> | null;
    return function (event: React.ChangeEvent<HTMLInputElement>) {
      let value = event.target.value;
      setSearch(value);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func.apply(null, [value]);
      }, 500);
    };
  }
  function handleSearch(val: string) {
    setQueryParams({
      search: val,
    });
  }

  useEffect(() => {
    setSearch(queryParams.search ?? '');
  }, [queryParams.search]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(debounceSearch(handleSearch), []);
  return (
    <SearchWrapper className={className}>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search…"
        inputProps={{
          "aria-label": "search",
        }}
        onChange={debouncedSearch}
        value={search}
      />
    </SearchWrapper>
  );
}
