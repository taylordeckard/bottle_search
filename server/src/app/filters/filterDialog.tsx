"use client";
import {
  AppBar,
  Button,
  Container,
  Dialog,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
  Slide,
  Switch,
  Toolbar,
  Typography,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { TransitionProps } from "@mui/material/transitions";
import { useEffect, useState, forwardRef, ReactElement, Ref } from "react";
import { PriceRangeSelect } from "./priceRangeSelect";
import { useQueryParams } from "../useQueryParams";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement;
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export function FilterDialog({
  openProp,
  onClose,
}: {
  openProp: boolean;
  onClose?: () => void;
}) {
  const { queryParams, clearQueryParams, setQueryParams } = useQueryParams();
  const [open, setOpen] = useState(openProp);
  const [newOn, setNewOn] = useState(queryParams.fresh);
  const [rangeStart, setRangeStart] = useState(queryParams.rangeStart);
  const [rangeEnd, setRangeEnd] = useState(queryParams.rangeEnd);

  useEffect(() => {
    setOpen(openProp);
  }, [openProp]);

  const resetState = () => {
    setNewOn(queryParams.fresh);
  };

  const handleClose = () => {
    resetState();
    setOpen(false);
    onClose?.();
  };

  const handleClear = () => {
    clearQueryParams();
    setOpen(false);
    onClose?.();
  };

  const handleSave = () => {
    setQueryParams({
      rangeStart,
      rangeEnd,
      fresh: newOn,
      skip: 0,
    });
    setOpen(false);
    onClose?.();
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Filters
          </Typography>
          <Button autoFocus color="warning" onClick={handleClear}>
            Clear
          </Button>
          <Button autoFocus color="inherit" onClick={handleSave}>
            Save
          </Button>
        </Toolbar>
      </AppBar>
      <Container
        sx={{
          maxWidth: "unset !important",
          marginTop: "20px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <FormGroup>
          <PriceRangeSelect
            onChange={(value) => {
              setRangeStart(value.rangeStart);
              setRangeEnd(value.rangeEnd);
            }}
          />
          <FormControlLabel
            sx={{
              marginTop: "20px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
            control={
              <Switch
                checked={newOn}
                onChange={(evt) => setNewOn(evt.target.checked)}
              />
            }
            label="New"
          />
        </FormGroup>
      </Container>
    </Dialog>
  );
}
