"use client"
import {
  FormControl,
  InputLabel,
  ListItemText,
  Checkbox,
  MenuItem,
  Select,
} from '@mui/material'
import { useEffect, useState } from 'react';

export function PriceRangeSelect() {
  const priceRanges = [
    { key: 0, label: "$0 - $50" },
    { key: 1, label: "$51 - $100" },
    { key: 2, label: "$101 - $200" },
    { key: 3, label: "$201 - $500" },
    { key: 4, label: "$501 - $1000" },
    { key: 5, label: "$1001 - $2000" },
    { key: 6, label: "$2001 - $5000" },
    { key: 7, label: "$5001 - $10000" },
    { key: 8, label: "$10000+" },
  ]

  return (
    <FormControl fullWidth>
      <InputLabel id="price-range">Price Range</InputLabel>
      <Select
        labelId="price-range-select-label"
        id="price-range-select"
        label="Price Range"
        multiple
        value={[]}
      >
        {priceRanges.map((pr) => (
          <MenuItem key={pr.key} value={pr.key}>
            <Checkbox />
            <ListItemText primary={pr.label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
