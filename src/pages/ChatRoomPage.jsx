import {
  AddIcCall,
  AttachFile,
  Done,
  DoneAll,
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
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUserId, handleGetUserChatHistory } from "../services";
import SocketEvents from "../constants/socketEvent";
import { useSocket } from "../context/socketContext";
import { debounce } from "lodash";
import { setLastMessage, updateLastMessageStatus } from "../redux/slices/chatSlice";

const loggedInUserId = getCurrentUserId();

const ChatRoomPage = ({ roomPageProps, selectedC_IdRef }) => {
  const socket = useSocket();
  const chatId = selectedC_IdRef?.current || null;
  const [typeQuery, setTypeQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const dispatch = useDispatch();
  const usersStatus = useSelector((state) => state.chat.usersStatus);
  useEffect(() => {
    console.log("usersStatus", usersStatus);
  }, [usersStatus]);

  const typingStatus = useSelector((state) => state.chat.typingStatus);

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

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (sortedMessages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [sortedMessages]);

  const handleSendMessage = () => {
    if (!typeQuery.trim()) return;


    setTypeQuery("");

    socket?.emit(SocketEvents.CLIENT_CHAT_SEND, {
      conversationId: chatId,
      text: typeQuery,
    });
  };

  const allMessages = useMemo(() => {
    const combined = [
      ...sortedMessages,
      ...messages.filter((m) => m.conversation === selectedC_IdRef.current),
    ];
    return combined.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, [sortedMessages, messages, selectedC_IdRef.current]);

  useEffect(() => {
    if (allMessages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [allMessages]);

  const typingTimeoutRef = useRef(null);

  // debounce
  const emitTyping = useMemo(
    () =>
      debounce((conversationId) => {
        if (socket && conversationId) {
          socket.emit(SocketEvents.CLIENT_CHAT_TYPING, {
            conversationId,
          });
        }
      }, 300),
    [socket]
  );

  const handleTyping = (e) => {
    setTypeQuery(e.target.value);
    if (!socket && !chatId) return;

    // debounced
    emitTyping(chatId);

    // Reset "stop typing" timer
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit(SocketEvents.CLIENT_CHAT_STOP_TYPING, {
        conversationId: chatId,
      });
    }, 2000);
  };

  const handleServerMessageReceive = (data) => {
    const newMessage = data.recieved_message
    // If user is currently viewing this chat → mark as read
    console.log("New message received:", newMessage);
    dispatch(setLastMessage({
      conversationId: chatId, message: newMessage
    }));
    if (newMessage.conversation === chatId) {
      setMessages((prev) => [...prev, newMessage]);

      socket.emit(SocketEvents.CLIENT_CHAT_READ, {
        conversationId: chatId,
        messageId: newMessage.message_id,
      });
    }
  }

  const handleServerChatMessageStatus = (data) => {
    // only update if this conversation is open
    const { conversationId, messageId, status, userId } = data;
    if (conversationId === chatId) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.message_id === messageId
            ? { ...msg, status, readBy: [...(msg.readBy || []), userId] }
            : msg
        )
      );
    }
    dispatch(updateLastMessageStatus(data));
  }


  useEffect(() => {
    socket.on(SocketEvents.SERVER_CHAT_RECEIVE, (data) => {
      handleServerMessageReceive(data);
    });
    socket.on(SocketEvents.SERVER_CHAT_MESSAGE_STATUS, (data) => {
      handleServerChatMessageStatus(data);
    });
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      emitTyping.cancel?.(); // cancel debounced
      if (socket && chatId) {
        socket.emit(SocketEvents.CLIENT_CHAT_STOP_TYPING, {
          conversationId: chatId,
        });
      }
      socket.off(SocketEvents.SERVER_CHAT_RECEIVE);
      socket.off(SocketEvents.SERVER_CHAT_MESSAGE_STATUS);

    };
  }, [socket, chatId, emitTyping]);

  const seenMessagesRef = useRef(new Set());

  useEffect(() => {
    if (!chatId || allMessages.length === 0) return;

    allMessages.forEach((msg) => {
      if (
        msg.sender._id !== loggedInUserId &&
        !(msg.readBy || []).includes(loggedInUserId) &&
        !seenMessagesRef.current.has(msg.message_id) // ✅ don’t re-emit
      ) {
        socket.emit(SocketEvents.CLIENT_CHAT_READ, {
          conversationId: chatId,
          messageId: msg.message_id,
        });
        seenMessagesRef.current.add(msg.message_id);
      }
    });
  }, [chatId, allMessages, socket]);


  const convTyping = typingStatus?.[chatId] || {};
  const isSomeoneTyping =
    convTyping && Object.values(convTyping).some((u) => u.typing === true);

  return (
    <Box
      sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}
    >
      {chatId ? (
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          borderLeft={1}
          borderRight={1}
          borderColor="divider"
          height="100vh"
          width="70vw"
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
              <Avatar
                src={roomPageProps.profilePic}
                alt={roomPageProps.fullName}
                sx={{ mr: 1, bgcolor: "#0e7490" }}
              ></Avatar>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h6">{roomPageProps.fullName}</Typography>
                <Typography
                  variant="body2"
                  color={
                    usersStatus?.[roomPageProps.userId]?.online === true
                      ? "green"
                      : "gray"
                  }
                  fontWeight={
                    usersStatus?.[roomPageProps.userId]?.online === true &&
                    "bold"
                  }
                >
                  {usersStatus?.[roomPageProps.userId]?.online
                    ? "Online"
                    : usersStatus?.[roomPageProps.userId]?.lastSeen
                      ? `Last seen: ${new Date(
                        usersStatus[roomPageProps.userId].lastSeen
                      ).toLocaleString([], {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}`
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
              : allMessages.map((msg) => {
                const isMine = msg.sender._id === loggedInUserId;
                return (
                  <Box
                    key={msg.message_id}
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
                          pr: 7, // extra space for timestamp + tick
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

                        {isMine && (
                          msg.readBy?.includes(roomPageProps.userId) ? (
                            <DoneAll
                              fontSize="small"
                              sx={{ color: "#4fc3f7", fontSize: "1rem" }} // blue double tick if read
                            />
                          ) : (
                            <Done
                              fontSize="small"
                              sx={{ color: isMine ? "rgba(255,255,255,0.7)" : "gray", fontSize: "1rem" }}
                            />
                          )
                        )}
                      </Box>
                    </Paper>
                  </Box>
                );
              })}
            <div ref={messagesEndRef} />
          </Box>

          {/* Typing Indicator (just above input) */}
          {isSomeoneTyping && (
            <Box
              px={2}
              py={1}
              bgcolor="transparent"
              display="flex"
              justifyContent="flex-start"
            >
              <Typography variant="body2" color="textSecondary">
                Typing...
              </Typography>
            </Box>
          )}
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
              value={typeQuery}
              autoFocus
              onChange={handleTyping}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault(); // prevent newline
                  handleSendMessage(); // send
                }
              }}
              fullWidth
              multiline   // allow new lines
              minRows={1}
              maxRows={6}
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
              <IconButton color="primary" onClick={handleSendMessage}>
                <Send />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      ) : (
        <Box
          flex={1}
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          marginLeft="20rem"
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
