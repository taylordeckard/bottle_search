"use client";
import { Typography } from "@mui/material";

export default function Title({ className = "" }: { className?: string }) {
  return (
    <Typography
      className={className}
      variant="h3"
      ml="20px"
      pt="10px"
      mr="20px"
    >
      Find Whiskey
    </Typography>
  );
}
