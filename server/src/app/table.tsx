'use client';
import { usePathname, useRouter, useSearchParams  } from 'next/navigation';
import { startTransition, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { Product } from '../types';


export default function ProductTable({
  products,
}: {
  products: Product[],
}) {
  const queryParams = useSearchParams();
  const pathname = usePathname();
  let sortColumn = queryParams.get('sortColumn') ?? 'price';
  if (!['title', 'price', 'website'].includes(sortColumn)) {
    sortColumn = 'price';
  }
  let sortDirection: 'asc' | 'desc';
  let sortDirectionStr: string = queryParams.get('sortDirection') ?? 'asc';
  if (!['asc', 'desc'].includes(sortDirectionStr)) {
    sortDirection = 'asc';
  } else {
    sortDirection = sortDirectionStr as 'asc' | 'desc';
  }
  const router = useRouter();
  const headers = [
    { key: 'title', label: 'Title' },
    { key: 'price', label: 'Price' },
    { key: 'website', label: 'Website' },
  ];
  function updateSort(col: string) {
    startTransition(() => {
      const params = new URLSearchParams(queryParams);
      params.set('sortColumn', col);
      params.set('sortDirection', sortDirection === 'asc' ? 'desc' : 'asc');
      router.replace(`${pathname}?${params.toString()}`)
    });
  }
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="product table">
        <TableHead>
          <TableRow>
          { headers.map((row, idx) => (
                <TableCell
                  align={ idx === 0 ? undefined : 'right' }
                  key={row.key}
                  sortDirection={ sortColumn === row.key ? 'asc' : 'desc' }
                >
                  <TableSortLabel
                    active={ sortColumn === row.key }
                    direction={ sortColumn === row.key ? sortDirection : 'asc' }
                    onClick={updateSort.bind(null, row.key)}
                  >
                    {row.label}
                  </TableSortLabel>
                </TableCell>
            ))
          }
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow
              key={product._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <a href={product.link} target="__blank">{product.title}</a>
              </TableCell>
              <TableCell align="right">${product.price}</TableCell>
              <TableCell align="right">{product.website}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
