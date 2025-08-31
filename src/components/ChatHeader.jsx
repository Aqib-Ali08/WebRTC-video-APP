import { AddIcCall, MoreVert, VideoCall } from "@mui/icons-material";
import { Avatar, Box, IconButton, Tooltip, Typography } from "@mui/material";

export default function ChatHeader({
  roomPageProps,
  usersStatus,
  id,
  handleOpen,
}) {
  return (
    <Box
      p={1}
      borderBottom={1}
      borderColor="divider"
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Avatar
          src={roomPageProps.profilePic}
          alt={roomPageProps.fullName}
          sx={{ mr: 1, bgcolor: "#0e7490" }}
        />
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="h6">{roomPageProps.fullName}</Typography>
          <Typography
            variant="body2"
            color={
              usersStatus?.[roomPageProps.userId]?.online ? "green" : "gray"
            }
            fontWeight={
              usersStatus?.[roomPageProps.userId]?.online ? "bold" : "normal"
            }
          >
            {usersStatus?.[roomPageProps.userId]?.online
              ? "Online"
              : usersStatus?.[roomPageProps.userId]?.lastSeen
                ? `Last seen: ${new Date(
                    usersStatus[roomPageProps.userId].lastSeen
                  ).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true
                  }).replace(/am|pm/, (match) => match.toUpperCase())}`
                : ""}
          </Typography>
        </Box>
      </Box>

      <Box>
        <Tooltip title="Audio Call">
          <IconButton>
            <AddIcCall />
          </IconButton>
        </Tooltip>
        <Tooltip title="Video Call">
          <IconButton>
            <VideoCall />
          </IconButton>
        </Tooltip>
        <Tooltip title="More">
          <IconButton aria-describedby={id} onClick={handleOpen}>
            <MoreVert />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
