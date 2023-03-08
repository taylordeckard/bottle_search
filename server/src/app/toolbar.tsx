"use client"
import { useState } from 'react';
import { IconButton  } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Title from "./title";
import { FilterDialog } from './filters';
import Search from './search';
import styles from "./toolbar.module.scss";

export default function Toolbar() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  return (
    <>
      <Title  className={styles.title}/>
      <Search className={styles.search}/>
      <div style={{ marginTop: '20px', marginRight: '20px' }}>
        <IconButton onClick={() => setFiltersOpen(true)}>
          <FilterAltIcon />
        </IconButton>
      </div>
      <FilterDialog
        openProp={filtersOpen}
        onClose={() => setFiltersOpen(false)} />
    </>
  );
}
