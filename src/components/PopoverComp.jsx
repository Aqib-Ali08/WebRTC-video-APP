import { Popover, Typography } from "@mui/material";

export default function PopoverComp({ id, open, anchorEl, onClose, children }) {
  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      slotProps={{
        paper: {
          sx: {
            marginRight: 1.5,
            marginTop: 2.5,
          },
        },
      }}
    >
      {children ? children : <Typography sx={{ p: 2 }}>No content</Typography>}
    </Popover>
  );
}
