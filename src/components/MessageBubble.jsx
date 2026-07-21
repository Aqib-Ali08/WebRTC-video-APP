import {
  ChevronRight,
  DeleteForever,
  DeleteOutline,
  Done,
  DoneAll,
  MoreVert,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import PopoverComp from "./PopoverComp";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleDeleteMessage } from "../services";
// import EmojiPicker from "emoji-picker-react";
// import { useState } from "react";
// import AddReactionIcon from "@mui/icons-material/AddReaction";

export default function MessageBubble({
  msg,
  loggedInUserId,
  roomPageProps,
  messageId,
  // onReact,
}) {
  const queryClient = useQueryClient();
  const isMine = msg.sender._id === loggedInUserId;
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(null);
  const [isDeleted, setIsDeleted] = useState(false);
  // const [showReactionPicker, setShowReactionPicker] = useState(false);

  // const handleReactionClick = (_, emojiObject) => {
  //   setShowReactionPicker(false);

  //   // 🔥 send reaction back to parent via prop (socket/redux update)
  //   if (onReact) {
  //     onReact(msg.message_id, emojiObject.emoji);
  //   }
  // };

  // popover open function
  const handleOpen = (event) => setAnchorEl(event.currentTarget);

  // popover close function
  const handleClose = () => setAnchorEl(null);

  // popover open state
  const open = Boolean(anchorEl);

  // popover id
  const id = open ? "popover-a" : undefined;

  // popover action buttons
  const popoverActions = [
    { label: "Delete for Me", icon: <DeleteOutline /> },
    ...(isMine ? [{ label: "Delete for All", icon: <DeleteForever /> }] : []),
  ];

  const handleClickClose = () => {
    setDialogOpen(false);
    handleClose();
  };

  const handleDeleteForMe = () => {
    setDialogType("deleteForMe");
    setDialogOpen(true);
  };

  const handleDeleteForAll = () => {
    setDialogType("deleteForAll");
    setDialogOpen(true);
  };

  const deleteMsgMutation  = useMutation({
    mutationFn: () => handleDeleteMessage(messageId, dialogType),
    onSuccess: () => {
      // Remove from Query cache!
      queryClient.setQueryData(["conversation", msg.conversation], (old) => {
        if (!old) return old;
        const oldMessages = Array.isArray(old) ? old : old.messages || [];
        const updatedMessages = oldMessages.filter((m) => m.message_id !== messageId);
        return Array.isArray(old) ? updatedMessages : { ...old, messages: updatedMessages };
      });
    },
    onError: (err) => {
      console.error("Failed to delete:", err);
    },
  });

  return (
    <>
      <Box
        display="flex"
        justifyContent={isMine ? "flex-end" : "flex-start"}
        alignItems="flex-end"
        // gap={1}
      >
        <Paper
          sx={{
            px: 1.5,
            py: 1,
            maxWidth: "65%",
            borderRadius: 1,
            bgcolor: isMine ? "primary.main" : "background.paper",
            color: isMine ? "background.paper" : "text.primary",
            boxShadow: 2,
            position: "relative",
          }}
        >
          {/* Message text */}
          <Typography
            variant="body2"
            sx={{
              wordBreak: "break-word",
              whiteSpace: "pre-wrap",
              fontSize: "0.95rem",
              lineHeight: 1.4,
              pr: 10, // extra space for timestamp + tick
              fontStyle: isDeleted ? "italic" : "normal",
              color: isDeleted ? "text.secondary" : isMine ? "background.paper" : "text.primary",
            }}
          >
            {isDeleted ? "This message was deleted" : msg.content}
          </Typography>

          {/* Timestamp + Tick */}
          <Box
            sx={{
              position: "absolute",
              bottom: 6,
              right: 8,
              display: "flex",
              alignItems: "center",
              gap: 0.3,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.7rem",
                color: isMine ? "rgba(255,255,255,0.7)" : "text.secondary",
              }}
            >
              {new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>

            {isMine &&
              (msg.readBy?.includes(roomPageProps.userId) ? (
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
                    color: isMine ? "rgba(255,255,255,0.7)" : "text.secondary",
                    fontSize: "1rem",
                  }}
                />
              ))}
          </Box>

          {/* Reaction button */}
          {/* <Tooltip title="React">
          <IconButton
            size="small"
            sx={{
              position: "absolute",
              bottom: -18,
              left: -10,
              bgcolor: "background.paper",
              "&:hover": { bgcolor: "divider" },
              border: "1px solid #0e7490",
            }}
            onClick={() => setShowReactionPicker((prev) => !prev)}
          >
            <AddReactionIcon sx={{ fontSize: "16px" }} />
          </IconButton>
        </Tooltip> */}

          {/* Emoji Picker */}
          {/* {showReactionPicker && (
          <Box position="absolute" bottom={40} right={-10} zIndex={1000}>
            <EmojiPicker
              reactionsDefaultOpen={true} // 👈 show only reactions row
              reactions={["1f44d", "2764-fe0f", "1f602", "1f525", "1f62e"]}
              onReactionClick={handleReactionClick} // 👈 handle reaction
              allowExpandReactions={false} // 👈 prevent full picker
            />
          </Box>
        )} */}

          {/* Show reactions (if any) */}
          {/* {msg.reactions?.length > 0 && (
          <Box display="flex" gap={0.5} mt={0.5}>
            {msg.reactions.map((reaction, i) => (
              <Box
                key={i}
                fontSize="0.9rem"
                px={0.5}
                py={0.2}
                borderRadius={1}
                bgcolor="action.selected"
              >
                {reaction.emoji}
              </Box>
            ))}
          </Box>
        )} */}
        </Paper>
        <IconButton onClick={handleOpen}>
          <MoreVert fontSize="small" />
        </IconButton>
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
                onClick={() => {
                  if (item.label === "Delete for Me") {
                    handleDeleteForMe();
                  } else if (item.label === "Delete for All") {
                    handleDeleteForAll();
                  } else {
                    handleClose();
                  }
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </PopoverComp>
        <Dialog
          open={dialogOpen}
          onClose={handleClickClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          {/* {console.log("Dialog render with open:", dialogOpen)} */}
          <DialogTitle id="alert-dialog-title">Delete Message!!</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {dialogType === "deleteForMe"
                ? "Are you sure to delete the message for you?"
                : "Are you sure to delete the message for all?"}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button size="small" variant="outlined" onClick={handleClickClose}>
              Cancel
            </Button>
            <Button
              size="small"
              onClick={() => {
                deleteMsgMutation.mutate();
                handleClickClose();
                handleClose();
              }}
              variant="contained"
              autoFocus
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}
