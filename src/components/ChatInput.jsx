import { AttachFile, EmojiEmotions, Send } from "@mui/icons-material";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import EmojiPicker from "emoji-picker-react";

export default function ChatInput({
  typeQuery,
  handleTyping,
  handleSendMessage,
  showEmojiPicker,
  setShowEmojiPicker,
  handleEmojiClick,
  disabled = false,
}) {
  return (
    <Box
      p={2}
      borderTop={1}
      borderColor="divider"
      display="flex"
      alignItems="center"
      gap={1}
      bgcolor="#fff"
      position="relative"
    >
      <TextField
        value={typeQuery}
        disabled={disabled}
        autoFocus
        onChange={handleTyping}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
          }
        }}
        fullWidth
        multiline
        minRows={1}
        maxRows={6}
        placeholder="Write something..."
        variant="outlined"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title="Add Emoji">
                <IconButton
                  onClick={() => setShowEmojiPicker((prev) => !prev)}
                  disabled={disabled}
                >
                  <EmojiEmotions />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
        }}
      />
      <Tooltip title="Add Attachment">
        <IconButton disabled={disabled}>
          <AttachFile />
        </IconButton>
      </Tooltip>
      <Tooltip title="Send Message">
        <IconButton
          color="primary"
          onClick={handleSendMessage}
          disabled={disabled}
        >
          <Send />
        </IconButton>
      </Tooltip>

      {showEmojiPicker && (
        <Box
          position="absolute"
          bottom={80}
          right={{ xs: 10, sm: 60 }}
          zIndex={1000}
          sx={{
            width: { xs: "calc(100% - 20px)", sm: "auto" },
            maxWidth: "350px",
            "& > .EmojiPickerReact": {
              width: "100% !important",
            },
          }}
        >
          <EmojiPicker onEmojiClick={handleEmojiClick} disabled={disabled} />
        </Box>
      )}
    </Box>
  );
}
