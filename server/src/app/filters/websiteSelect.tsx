"use client"
import { useEffect, useState } from 'react';
import {
  Theme,
  useTheme,
  OutlinedInput,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useQueryParams } from '../useQueryParams';
import { websites, Website } from '../../websites';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: string, website: string[], theme: Theme) {
  return {
    fontWeight:
      website.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export function WebsiteSelect({
  onChange,
}: {
  onChange?: (value: Website[]) => void;
}) {
  const theme = useTheme();
  const { queryParams } = useQueryParams();
  const [selection, setSelection] = useState<Website[]>(queryParams.website ?? []);

  useEffect(() => {
    onChange?.(selection)
  }, [selection])

  const handleChange = (event: SelectChangeEvent<typeof selection>) => {
    const {
      target: { value },
    } = event;
    setSelection(
      // On autofill we get a stringified value.
      typeof value === 'string' ? (value.split(',') as Website[]) : value,
    );
  };

  return (
    <div style={{ margin: 'auto' }}>
      <FormControl sx={{ m: 1, width: 'calc(80vw + 16px)' }}>
        <InputLabel id="website-select-input-label">Website</InputLabel>
        <Select
          labelId="website-select-label"
          id="website-select"
          multiple
          value={selection}
          onChange={handleChange}
          input={<OutlinedInput label="Website" />}
          MenuProps={MenuProps}
        >
          {websites.map((w) => (
            <MenuItem
              key={w}
              value={w}
              style={getStyles(w, selection, theme)}
            >
              {w}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
