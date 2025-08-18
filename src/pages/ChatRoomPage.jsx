import { useMemo, useEffect, useRef } from "react";
import {
  AddIcCall,
  AttachFile,
  ChevronLeft,
  EmojiEmotions,
  MoreVert,
  Send,
  VideoCall,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  Paper,
  Skeleton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUserId, handleGetUserChatHistory } from "../services";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ChatSidebarList from "./ChatSidebarList";

const loggedInUserId = getCurrentUserId();

const ChatRoomPage = () => {
  const navigate = useNavigate();

  const { chatId } = useParams();
  const messagesEndRef = useRef(null);

  const location = useLocation();
  const { fullName, profilePic } = location.state || {};
  // console.log("fullName, profilePic", fullName, profilePic);

  const { data, isPending } = useQuery({
    queryKey: ["conversation", chatId],
    queryFn: () => handleGetUserChatHistory(chatId),
    enabled: !!chatId,
    refetchOnWindowFocus: false,
  });

  // Sort messages by createdAt (oldest first)
  const sortedMessages = useMemo(() => {
    if (!data) return [];

    // If data is already an array
    if (Array.isArray(data)) {
      return [...data].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    }

    // If data is an object with messages property
    if (Array.isArray(data.messages)) {
      return [...data.messages].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    }

    return [];
  }, [data]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [sortedMessages]);

  return (
    <Box
      sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}
    >
      <ChatSidebarList />
      {chatId ? (
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          borderLeft={1}
          borderRight={1}
          borderColor="divider"
          height="100vh"
        >
          {/* Header */}
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
              <Tooltip title="Back">
                <IconButton onClick={() => navigate("/dashboard/messages")}>
                  <ChevronLeft />
                </IconButton>
              </Tooltip>
              <Avatar src={profilePic} alt={fullName} sx={{ mr: 1, bgcolor: "#0e7490" }} ></Avatar>
              <Typography variant="h6">{fullName}</Typography>
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
                <IconButton>
                  <MoreVert />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Messages area */}
          <Box
            flex={1}
            p={2}
            display="flex"
            flexDirection="column"
            gap={1}
            overflow="auto"
            bgcolor="#f5f5f5"
          >
            {isPending
              ? Array.from(new Array(6)).map((_, index) => {
                const alignLeft = index % 2 === 0;
                return (
                  <Box
                    key={index}
                    display="flex"
                    justifyContent={alignLeft ? "flex-start" : "flex-end"}
                  >
                    <Skeleton
                      variant="rounded"
                      width="30%"
                      height={40}
                      sx={{
                        borderRadius: 3,
                        bgcolor: alignLeft ? "#e0e0e0" : "#b2ebf2",
                      }}
                    />
                  </Box>
                );
              })
              : sortedMessages.map((msg) => {
                const isMine = msg.sender._id === loggedInUserId;
                return (
                  <Box
                    key={msg._id}
                    display="flex"
                    justifyContent={isMine ? "flex-start" : "flex-end"}
                    alignItems="flex-end"
                    gap={1}
                  >
                    <Paper
                      sx={{
                        p: 1,
                        maxWidth: "60%",
                        height: "50%",
                        bgcolor: isMine ? "#fff" : "#0e7490",
                        color: isMine ? "black" : "white",
                        borderRadius: 3,
                        boxShadow: 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            display: "flex",
                            pb: 1.5,
                            mb: 1.5,
                          }}
                        >
                          {msg.content}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            textAlign: "right",
                            color: "gray",
                          }}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Typography>
                      </Box>
                    </Paper>
                  </Box>
                );
              })}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input area */}
          <Box
            p={2}
            borderTop={1}
            borderColor="divider"
            display="flex"
            alignItems="center"
            gap={1}
            bgcolor="#fff"
          >
            <TextField
              fullWidth
              placeholder="Write something..."
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Add Emoji">
                      <IconButton>
                        <EmojiEmotions />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
            <Tooltip title="Add Attachment">
              <IconButton>
                <AttachFile />
              </IconButton>
            </Tooltip>
            <Tooltip title="Send Message">
              <IconButton color="primary">
                <Send />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      ) : (
        <Box
          flex={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h6" color="textSecondary">
            Select a chat to start messaging
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ChatRoomPage;
