"use client";
import { usePathname, useRouter } from 'next/navigation';
import { startTransition, useCallback } from 'react';
import { styled, alpha  } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { useQueryParams } from './useQueryParams';

const SearchWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  alignSelf: 'flex-end',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 'auto',
  marginRight: '20px',
  minWidth: '200px',
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

export default function Search () {
  const router = useRouter();
  const pathname = usePathname();
  const { queryParams, setQueryParams } = useQueryParams();
  function debounce (func: Function) {
    let timer: ReturnType<typeof setTimeout> | null;
	return function (...args: any) {
	  if (timer) clearTimeout(timer);
	  timer = setTimeout(() => {
		timer = null;
		func.apply(null, args);
	  }, 500);
	};
  }
  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    setQueryParams({
      search: event.target.value,
    });
  }
  const debouncedSearch = useCallback(debounce(handleSearch), []);
  return (
    <SearchWrapper>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search…"
        inputProps={{ 'aria-label': 'search' }}
        onChange={debouncedSearch}
      />
    </SearchWrapper>
  )
}
