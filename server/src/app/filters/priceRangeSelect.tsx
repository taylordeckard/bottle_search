"use client";
import { Box, TextField } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useQueryParams } from "../useQueryParams";

export function PriceRangeSelect({
  onChange,
}: {
  onChange?: (value: { rangeStart?: number; rangeEnd?: number }) => void;
}) {
  const { queryParams } = useQueryParams();
  const [rangeStart, setRangeStart] = useState<number | undefined>(
    queryParams.rangeStart
  );
  const [rangeEnd, setRangeEnd] = useState<number | undefined>(
    queryParams.rangeEnd
  );

  useEffect(() => {
    onChange?.({ rangeStart, rangeEnd });
  }, [onChange, rangeStart, rangeEnd]);

  function handleChange(
    setter: typeof setRangeEnd | typeof setRangeStart,
    evt: ChangeEvent<HTMLInputElement>
  ) {
    setter(Number(evt.target.value));
  }

  function hasError() {
    if (
      typeof rangeStart !== "undefined" &&
      typeof rangeEnd !== "undefined" &&
      rangeStart >= rangeEnd
    ) {
      return true;
    }
    return false;
  }

  return (
    <Box
      component="form"
      sx={{
        margin: "auto",
        "& .MuiTextField-root": { m: 1, width: "40vw" },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        error={hasError()}
        id="price-range-start"
        label="Price Range Start"
        type="number"
        value={rangeStart}
        onChange={handleChange.bind(null, setRangeStart)}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        error={hasError()}
        id="price-range-end"
        label="Price Range end"
        type="number"
        value={rangeEnd}
        onChange={handleChange.bind(null, setRangeEnd)}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </Box>
  );
}
