'use client';
import { usePathname, useRouter } from 'next/navigation';
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
import { useQueryParams } from './useQueryParams';

export default function ProductTable({
  products,
}: {
  products: Product[],
}) {
  const { queryParams, setQueryParams } = useQueryParams();
  const pathname = usePathname();
  let sortColumn = queryParams.sortColumn ?? 'price';
  let sortDirection = queryParams.sortDirection ?? 'asc';
  const router = useRouter();
  const headers: { key: 'title' | 'price' | 'website'; label: string; }[] = [
    { key: 'title', label: 'Title' },
    { key: 'price', label: 'Price' },
    { key: 'website', label: 'Website' },
  ];
  function updateSort(col: 'title' | 'website' | 'price') {
    setQueryParams({
      sortColumn: col,
      sortDirection: sortDirection === 'asc' ? 'desc' : 'asc',
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
              sx={{ 
                '&:last-child td, &:last-child th': { border: 0 },
                '&:hover': { background: '#220330' }
              }}
            >
              <TableCell scope="row">
                <a href={product.link} target="__blank">{product.title}</a>
                { product.fresh ? (
                  <span style={{
                    marginLeft: '10px',
                    color: 'red',
                  }}>new</span>
                ) : '' }
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
