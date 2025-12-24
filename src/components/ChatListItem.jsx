import { Block, ChevronRight, Delete, Done, DoneAll, MoreVert } from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import PopoverComp from "./PopoverComp";
import { useState } from "react";

export default function ChatListItem({
  item,
  myUserId,
  lastMessages,
  typingStatus,
  unreadCounts,
  usersStatus,
  onChatClick,
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  // popover open function
  const handleOpen = (event) => setAnchorEl(event.currentTarget);

  // popover close function
  const handleClose = () => setAnchorEl(null);

  // popover open state
  const open = Boolean(anchorEl);

  // popover id
  const id = open ? "popover-a" : undefined;

  const isDirect = item.type === "direct";
  const participants = item.participants?.[0];

  const convTyping = typingStatus?.[item.conversationId] || {};
  const isSomeoneTyping =
    convTyping && Object.values(convTyping).some((u) => u.typing === true);

  const lastMessage = lastMessages[item.conversationId] || item?.lastMessage;
  const isMine = lastMessage?.sender._id === myUserId;
  console.log("unreadCounts", unreadCounts);

  // time formatting
  let formattedPaymentTime = "";
  if (item.lastMessage?.createdAt) {
    const onlyTime = new Date(item.lastMessage.createdAt);
    if (!isNaN(onlyTime)) {
      formattedPaymentTime = onlyTime.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }
  }

  // popover action buttons
  const popoverActions = [
    {
      label: "Block Chat",
      icon: <Block />,
    },
    {
      label: "Delete Chat",
      icon: <Delete />,
    },
  ];

  return (
    <ListItem disablePadding sx={{ "&:hover .hoverIcon": { opacity: 1 } }}>
      <ListItemButton
        sx={{ px: 1 }}
        onClick={() => onChatClick(item.conversationId, participants)}
      >
        <ListItemAvatar>
          <Badge
            overlap="circular"
            variant="dot"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            color={
              usersStatus?.[participants?._id]?.online ? "success" : "default"
            }
            // color="success"
          >
            <Avatar
              src={isDirect ? participants?.profilePic : item.groupAvatar}
              sx={{ bgcolor: "#0e7490" }}
            >
              {(isDirect
                ? participants?.full_name?.[0]
                : item.groupName?.[0]) || ""}
            </Avatar>
          </Badge>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
                width: "100%",
              }}
            >
              <Typography variant="body1">
                {isDirect ? participants?.full_name : item.groupName}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {unreadCounts[item.conversationId] > 0 && (
                  <Badge
                    badgeContent={
                      unreadCounts[item.conversationId] > 99
                        ? "99+"
                        : unreadCounts[item.conversationId]
                    }
                    // color="error"
                    overlap="circular"
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    sx={{
                      "& .MuiBadge-badge": {
                        backgroundColor: "#faac15",
                        color: "white",
                      },
                      marginRight: 2,
                    }}
                  />
                )}
                {/* <IconButton
                  size="small"
                  className="hoverIcon"
                  sx={{
                    opacity: 0,
                    transition: "opacity 0.2s ease",
                  }}
                  aria-describedby={id}
                  onClick={(e) => {
                    e.stopPropagation(); // <-- prevents ListItem onClick
                    handleOpen(e);
                  }}
                >
                  <MoreVert sx={{ fontSize: "20px" }} />
                </IconButton> */}
              </Box>

              {/* popover */}
              <PopoverComp
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 1,
                    p: 2,
                  }}
                >
                  {popoverActions.map((item, i) => (
                    <Button
                      key={i}
                      startIcon={item.icon}
                      endIcon={<ChevronRight />}
                    >
                      {item.label}
                    </Button>
                  ))}
                </Box>
              </PopoverComp>
            </Box>
          }
          secondary={
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
                width: "100%",
              }}
            >
              {/* Left section: tick + message/typing */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  minWidth: 0, // important for ellipsis
                  gap: 0.5,
                  flex: 1,
                }}
              >
                {/* ✅ Show tick only if it's my outgoing message */}
                {lastMessage &&
                  lastMessage.sender._id === myUserId &&
                  !isSomeoneTyping && (
                    <Typography
                      component="span"
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        flexShrink: 0,
                      }}
                    >
                      {lastMessage.readBy?.includes(participants?._id) ? (
                        <DoneAll
                          fontSize="small"
                          sx={{
                            color: "#4fc3f7",
                            fontSize: "1rem",
                          }} // blue double tick if read
                        />
                      ) : (
                        <Done
                          fontSize="small"
                          sx={{
                            color: isMine ? "rgba(0, 0, 0, 0.7)" : "gray",
                            fontSize: "1rem",
                          }}
                        />
                      )}
                    </Typography>
                  )}

                {/* Message text OR typing indicator */}
                <Typography
                  variant="caption"
                  sx={{
                    flex: 1,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontStyle: isSomeoneTyping ? "italic" : "normal",
                    fontWeight: isSomeoneTyping
                      ? 800 // bold italic for typing
                      : lastMessage &&
                          lastMessage.sender._id !== myUserId &&
                          !lastMessage.readBy?.includes(myUserId)
                        ? 700 // bold for unread incoming
                        : 400, // normal otherwise
                  }}
                >
                  {isSomeoneTyping ? "Typing..." : lastMessage?.content}
                </Typography>
              </Box>

              {/* Right side: time */}
              <Typography
                variant="caption"
                sx={{
                  whiteSpace: "nowrap",
                  color: "text.secondary",
                }}
              >
                {formattedPaymentTime}
              </Typography>
            </Box>
          }
        />
      </ListItemButton>
    </ListItem>
  );
}
