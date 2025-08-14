import { Add, Check } from "@mui/icons-material";
import { Box, Avatar, Typography, Button, Paper } from "@mui/material";

const ConnectionCard = ({
  id,
  name,
  image,
  type = "request",
  onAction,
  loadingAdd = false,
  loadingAccept = false,
  loadingDelete = false,
  loadingBlock = false,
  loadingDisconnect = false,
  sentRequest = false,
  isBlocked = false,
}) => {
  const renderButtons = () => {
    switch (type) {
      case "request":
        return (
          <>
            <Button
              variant="outlined"
              size="small"
              sx={actionBtnStyles("secondary")}
              onClick={() => onAction(id, "reject")}
              disabled={loadingDelete}
            >
              {loadingDelete ? "Rejecting..." : "Reject"}
            </Button>
            <Button
              variant="contained"
              size="small"
              sx={actionBtnStyles("primary")}
              onClick={() => {
                onAction(id, "accept");
              }}
              disabled={loadingAccept}
            >
              {loadingAccept ? "Accepting..." : "Accept"}
            </Button>
          </>
        );
      case "add":
        return (
          <Button
            variant="contained"
            size="small"
            sx={actionBtnStyles(sentRequest ? "sent" : "primary")}
            onClick={() => onAction(id, "add")}
            startIcon={sentRequest ? <Check /> : <Add />}
            disabled={sentRequest || loadingAdd}
          >
            {loadingAdd
              ? "Sending..."
              : sentRequest
                ? "Request Sent"
                : "Add Friend"}
          </Button>
        );
      case "manage":
        return (
          <>
            <Button
              variant="outlined"
              size="small"
              sx={actionBtnStyles("outlined")}
              onClick={() => onAction(id, "remove")}
              disabled={loadingDisconnect}
            >
              {loadingDisconnect ? "Removing..." : "Remove"}
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              sx={actionBtnStyles("error")}
              onClick={() => onAction(id, isBlocked ? "UNBLOCK" : "BLOCK")}
              disabled={loadingBlock}
            >
              {loadingBlock
                ? isBlocked
                  ? "Unblocking..."
                  : "Blocking..."
                : isBlocked
                  ? "Unblock"
                  : "Block"}
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
        py: 1.5,
        width: "100%",
        maxWidth: 1000,
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
          sx={{
            width: 40,
            height: 40,
            // bgcolor: "#d1d9ff"
            bgcolor: "#0e7490",
          }}
        />
        <Typography sx={{ fontSize: "16px" }} fontWeight={600}>
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
  ...(variant === "sent" && {
    color: "green !important",
  }),

  ...(variant === "outlined" && {
    // background: "linear-gradient(to right, #6a5af9, #8e73ff)",
    color: "#0e7490",
    "&:hover": {
      // background: "linear-gradient(to right, #5b4de1, #7d64e6)",
    },
    "&.Mui-disabled": {
      background: "#ccc",
      color: "green",
    },
  }),
  // ...(variant === "secondary" && {
  //   borderColor: "#c4baff",
  //   color: "#6a5af9",
  //   "&:hover": {
  //     borderColor: "#a79dff",
  //     backgroundColor: "#f6f4ff",
  //   },
  // }),
  ...(variant === "error" ||
    (variant === "secondary" && {
      backgroundColor: "#ff5252",
      color: "white",
      borderColor: "#ff5252",
      "&:hover": {
        backgroundColor: "#e64949",
        borderColor: "#e64949",
      },
    })),
});

export default ConnectionCard;
