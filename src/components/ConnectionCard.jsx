import React from "react";
import { Box, Avatar, Typography, Button, Paper } from "@mui/material";

const ConnectionCard = ({ id, name, image, type = "request", onAction }) => {
  const renderButtons = () => {
    switch (type) {
      case "request":
        return (
          <>
            <Button
              variant="contained"
              size="small"
              sx={actionBtnStyles("primary")}
              onClick={() => {onAction(id, "accept")}}
            >
              Accept
            </Button>
            <Button
              variant="outlined"
              size="small"
              sx={actionBtnStyles("secondary")}
              onClick={() => onAction(id, "delete")}
            >
              Delete
            </Button>
          </>
        );
      case "add":
        return (
          <Button
            variant="contained"
            size="small"
            sx={actionBtnStyles("primary")}
            onClick={() => onAction(id, "add")}
          >
            Add Friend
          </Button>
        );
      case "manage":
        return (
          <>
            <Button
              variant="outlined"
              size="small"
              sx={actionBtnStyles("secondary")}
              onClick={() => onAction(id, "delete")}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              sx={actionBtnStyles("error")}
              onClick={() => onAction(id,"block")}
            >
              Block
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 1,
        px: 3,
        py: 2,
        width: "100%",
        maxWidth: 800,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar
          src={image}
          alt={name}
          sx={{ width: 48, height: 48, bgcolor: "#d1d9ff" }}
        />
        <Typography variant="subtitle1" fontWeight={600}>
          {name}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 1.5 }}>{renderButtons()}</Box>
    </Paper>
  );
};

const actionBtnStyles = (variant) => ({
  textTransform: "none",
  borderRadius: 1,
  fontWeight: 500,
  px: 2.5,
  ...(variant === "primary" && {
    background: "linear-gradient(to right, #6a5af9, #8e73ff)",
    color: "#fff",
    "&:hover": {
      background: "linear-gradient(to right, #5b4de1, #7d64e6)",
    },
  }),
  ...(variant === "secondary" && {
    borderColor: "#c4baff",
    color: "#6a5af9",
    "&:hover": {
      borderColor: "#a79dff",
      backgroundColor: "#f6f4ff",
    },
  }),
  ...(variant === "error" && {
    backgroundColor: "#ff5252",
    "&:hover": {
      backgroundColor: "#e64949",
    },
  }),
});

export default ConnectionCard;
