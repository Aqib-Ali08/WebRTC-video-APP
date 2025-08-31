import { Done, DoneAll } from "@mui/icons-material";
import { Box, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import AddReactionIcon from "@mui/icons-material/AddReaction";

export default function MessageBubble({
  msg,
  loggedInUserId,
  roomPageProps,
  onReact,
}) {
  const isMine = msg.sender._id === loggedInUserId;
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const handleReactionClick = (_, emojiObject) => {
    setShowReactionPicker(false);

    // 🔥 send reaction back to parent via prop (socket/redux update)
    if (onReact) {
      onReact(msg.message_id, emojiObject.emoji);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent={isMine ? "flex-end" : "flex-start"}
      alignItems="flex-end"
      gap={1}
    >
      <Paper
        sx={{
          px: 1.5,
          py: 1,
          maxWidth: "65%",
          borderRadius: 1,
          bgcolor: isMine ? "#0e7490" : "#ffffff",
          color: isMine ? "white" : "black",
          boxShadow: 1,
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
          }}
        >
          {msg.content}
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
              color: isMine ? "rgba(255,255,255,0.7)" : "gray",
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
                  color: isMine ? "rgba(255,255,255,0.7)" : "gray",
                  fontSize: "1rem",
                }}
              />
            ))}
        </Box>

        {/* Reaction button */}
        <Tooltip title="React">
          <IconButton
            size="small"
            sx={{
              position: "absolute",
              bottom: -18,
              left: -10,
              bgcolor: "white",
              "&:hover": { bgcolor: "#eee" },
              border: "1px solid #0e7490",
            }}
            onClick={() => setShowReactionPicker((prev) => !prev)}
          >
            <AddReactionIcon sx={{ fontSize: "16px" }} />
          </IconButton>
        </Tooltip>

        {/* Emoji Picker */}
        {showReactionPicker && (
          <Box position="absolute" bottom={40} right={-10} zIndex={1000}>
            <EmojiPicker
              reactionsDefaultOpen={true} // 👈 show only reactions row
              reactions={["1f44d", "2764-fe0f", "1f602", "1f525", "1f62e"]}
              onReactionClick={handleReactionClick} // 👈 handle reaction
              allowExpandReactions={false} // 👈 prevent full picker
            />
          </Box>
        )}

        {/* Show reactions (if any) */}
        {msg.reactions?.length > 0 && (
          <Box display="flex" gap={0.5} mt={0.5}>
            {msg.reactions.map((reaction, i) => (
              <Box
                key={i}
                fontSize="0.9rem"
                px={0.5}
                py={0.2}
                borderRadius={1}
                bgcolor="rgba(0,0,0,0.1)"
              >
                {reaction.emoji}
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
}
