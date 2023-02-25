"use client";
import TablePagination from '@mui/material/TablePagination';
import { useQueryParams } from './useQueryParams';


export default function Pagination({
  total,
}: {
  total: number;
}) {
  const { queryParams, setQueryParams } = useQueryParams();
  const { limit = 50, skip = 0 } = queryParams;
  const totalPages = Math.ceil(total / limit);
  const page =  skip / limit;
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setQueryParams({
      skip: newPage * limit,
    })
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setQueryParams({
      limit: Number(event.target.value),
    })
  };

  return (
    <TablePagination
      component="div"
      count={total}
      page={page}
      onPageChange={handleChangePage}
      rowsPerPage={limit}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  );
}
