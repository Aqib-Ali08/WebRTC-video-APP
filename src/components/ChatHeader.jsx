import { AddIcCall, ArrowBack, MoreVert, VideoCall } from "@mui/icons-material";
import { Avatar, Box, IconButton, Tooltip, Typography } from "@mui/material";

export default function ChatHeader({
  roomPageProps,
  usersStatus,
  id,
  handleOpen,
  onBack,
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
      <Box sx={{ display: "flex", alignItems: "center", overflow: "hidden", mr: 1 }}>
        {onBack && (
          <IconButton
            onClick={onBack}
            sx={{ display: { xs: "inline-flex", md: "none" }, mr: 1 }}
          >
            <ArrowBack />
          </IconButton>
        )}
        <Avatar
          src={roomPageProps.profilePic}
          alt={roomPageProps.fullName}
          sx={{ mr: 1, bgcolor: "primary.main", flexShrink: 0 }}
        />
        <Box sx={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: "1rem", sm: "1.25rem" },
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: { xs: "120px", sm: "200px", md: "none" },
            }}
          >
            {roomPageProps.fullName}
          </Typography>
          <Typography
            variant="body2"
            color={
              usersStatus?.[roomPageProps.userId]?.online ? "green" : "gray"
            }
            fontWeight={
              usersStatus?.[roomPageProps.userId]?.online ? "bold" : "normal"
            }
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: { xs: "120px", sm: "200px", md: "none" },
            }}
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

      <Box sx={{ display: "flex", flexShrink: 0 }}>
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
