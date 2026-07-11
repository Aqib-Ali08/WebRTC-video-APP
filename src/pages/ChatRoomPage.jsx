import {
  Block,
  ChevronRight,
  Delete,
  // Search,
  Visibility,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentUserId,
  handleBlockChat,
  handleDeleteChat,
  handleGetUserBlockStatus,
  handleGetUserChatHistory,
} from "../services";
import SocketEvents from "../constants/socketEvent";
import { useSocket } from "../context/socketContext";
import { debounce } from "lodash";
import {
  clearUnread,
  incrementUnread,
  setLastMessage,
  updateLastMessageStatus,
  setActiveChatId,
  clearActiveChatId,
} from "../redux/slices/chatSlice";
import PopoverComp from "../components/PopoverComp";
import ChatHeader from "../components/ChatHeader";
import ChatInput from "../components/ChatInput";
import MessageList from "../components/MessageList";
import Lottie from "lottie-react";
import emptyChat from "../../src/assets/consultation-hover-conversation.json";

const ChatRoomPage = ({
  roomPageProps,
  selectedC_IdRef,
  updateSidebarOrder,
  onBack,
}) => {
  const queryClient = useQueryClient();
  const loggedInUserId = getCurrentUserId();
  const socket = useSocket();
  const dispatch = useDispatch();
  const chatId = selectedC_IdRef?.current || null;
  const [typeQuery, setTypeQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const usersStatus = useSelector((state) => state.chat.usersStatus);
  const typingStatus = useSelector((state) => state.chat.typingStatus);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(null);

  const handleClickClose = () => {
    setDialogOpen(false);
  };

  // emoji picker function
  const handleEmojiClick = (emojiData) => {
    setTypeQuery((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  // popover open function
  const handleOpen = (event) => setAnchorEl(event.currentTarget);

  // popover close function
  const handleClose = () => setAnchorEl(null);

  // popover open state
  const open = Boolean(anchorEl);

  // popover id
  const id = open ? "popover-a" : undefined;

  // fetch chat history using tanstack query
  const { data, isPending } = useQuery({
    queryKey: ["conversation", chatId],
    queryFn: () => handleGetUserChatHistory(chatId),
    enabled: !!chatId,
    refetchOnWindowFocus: false,
  });

  const { data: blockedData, refetch } = useQuery({
    queryKey: ["userBlock", chatId],
    queryFn: () => handleGetUserBlockStatus(chatId),
    enabled: !!chatId,
    refetchOnWindowFocus: false,
  });

  // message ref
  const messagesEndRef = useRef(null);

  // typing indictor ref
  const typingTimeoutRef = useRef(null);

  // seen message ref
  const seenMessagesRef = useRef(new Set());

  // send message function
  const handleSendMessage = () => {
    if (!typeQuery.trim()) return;
    setTypeQuery("");
    socket?.emit(SocketEvents.CLIENT_CHAT_SEND, {
      conversationId: chatId,
      text: typeQuery,
    });
  };

  // combine messages from server and local state, remove duplicates and sort by date
  const allMessages = useMemo(() => {
    const history = Array.isArray(data) ? data : data?.messages || [];
    const combined = [
      ...history,
      ...messages.filter((m) => m.conversation === chatId),
    ];

    return Object.values(
      Object.fromEntries(combined.map((m) => [m.message_id, m]))
    ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, [data, messages, chatId]);

  // debounce to avoid multiple emits
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

  // typing function
  const handleTyping = (e) => {
    setTypeQuery(e.target.value);
    if (!socket && !chatId) return;
    emitTyping(chatId); // debounced

    // Reset "stop typing" timer
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit(SocketEvents.CLIENT_CHAT_STOP_TYPING, {
        conversationId: chatId,
      });
    }, 1000);
  };

  // handle incoming messages from server
  const handleServerMessageReceive = (data) => {
    const newMessage = data.recieved_message;
    const conversationId = newMessage.conversation;
    console.log("New message received:", newMessage);
    const isOwnMessage = newMessage.sender._id === loggedInUserId;
    const isCurrentChatOpen = conversationId === chatId;
    console.log("isCurrentChatOpen", isCurrentChatOpen, chatId, conversationId);
    // Always update last message in the store
    dispatch(
      setLastMessage({
        conversationId,
        message: newMessage,
        isOwnMessage,
      })
    );

    // If user is currently in this chat → append message and mark as read
    if (isCurrentChatOpen) {
      setMessages((prev) => [...prev, newMessage]);

      socket.emit(SocketEvents.CLIENT_CHAT_READ, {
        conversationId,
        messageId: newMessage.message_id,
      });
    }

    // 🔹 Increment unread count if:
    //   - it's not my own message
    //   - the chat is NOT currently open
    if (!isOwnMessage && !isCurrentChatOpen) {
      console.log("Incrementing unread for conversation:", conversationId);
      dispatch(incrementUnread({ conversationId }));
    }
    // Update sidebar order
    updateSidebarOrder();
  };

  // handle message status updates from server
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

      // Update TanStack Query history cache!
      queryClient.setQueryData(["conversation", chatId], (old) => {
        if (!old) return old;
        const oldMessages = Array.isArray(old) ? old : old.messages || [];
        const updatedMessages = oldMessages.map((msg) =>
          msg.message_id === messageId
            ? { ...msg, readBy: [...(msg.readBy || []), userId] }
            : msg
        );
        return Array.isArray(old) ? updatedMessages : { ...old, messages: updatedMessages };
      });
    }
    dispatch(updateLastMessageStatus(data));
  };

  useEffect(() => {
    socket.on(SocketEvents.SERVER_CHAT_RECEIVE, (data) => {
      handleServerMessageReceive(data);
    });
    socket.on(SocketEvents.SERVER_CHAT_MESSAGE_STATUS, (data) => {
      // console.log("Message status update received:", data);
      handleServerChatMessageStatus(data);
    });
    socket.on("server:chat:deleteMessage", ({ messageId }) => {
      setMessages((prev) => prev.filter((m) => m.message_id !== messageId));
      queryClient.setQueryData(["conversation", chatId], (old) => {
        if (!old) return old;
        const oldMessages = Array.isArray(old) ? old : old.messages || [];
        const updatedMessages = oldMessages.filter((m) => m.message_id !== messageId);
        return Array.isArray(old) ? updatedMessages : { ...old, messages: updatedMessages };
      });
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
      socket.off("server:chat:deleteMessage");
    };
  }, [socket, chatId, emitTyping, queryClient]);

  useEffect(() => {
    if (!chatId || allMessages.length === 0) return;

    let hasUnread = false;

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
        hasUnread = true;
      }
    });

    if (hasUnread) {
      // Optimistically update our local TanStack Query cache to include loggedInUserId in readBy
      queryClient.setQueryData(["conversation", chatId], (old) => {
        if (!old) return old;
        const oldMessages = Array.isArray(old) ? old : old.messages || [];
        const updatedMessages = oldMessages.map((msg) => {
          if (
            msg.sender._id !== loggedInUserId &&
            !(msg.readBy || []).includes(loggedInUserId)
          ) {
            return { ...msg, readBy: [...(msg.readBy || []), loggedInUserId] };
          }
          return msg;
        });
        return Array.isArray(old) ? updatedMessages : { ...old, messages: updatedMessages };
      });
    }

    dispatch(clearUnread({ conversationId: chatId }));
  }, [chatId, allMessages, socket, loggedInUserId, queryClient]);

  useEffect(() => {
    if (chatId) {
      dispatch(setActiveChatId(chatId));
    }
    return () => {
      dispatch(clearActiveChatId());
    };
  }, [chatId, dispatch]);

  const convTyping = typingStatus?.[chatId] || {};
  
  const typingUserIds = useMemo(() => {
    return Object.keys(convTyping || {}).filter(
      (uid) => uid !== loggedInUserId && convTyping[uid]?.typing
    );
  }, [convTyping, loggedInUserId]);

  const isSomeoneTyping = typingUserIds.length > 0;

  const typingUserName = useMemo(() => {
    if (!isSomeoneTyping) return "";
    if (roomPageProps?.fullName && typingUserIds.includes(roomPageProps.userId)) {
      return roomPageProps.fullName;
    }
    const activeChats = queryClient.getQueryData(["userChat"]);
    const activeConversation = activeChats?.find((c) => c.conversationId === chatId);
    for (const uid of typingUserIds) {
      const participant = activeConversation?.participants?.find((p) => p._id === uid);
      if (participant?.full_name) {
        return participant.full_name;
      }
    }
    return "Someone";
  }, [isSomeoneTyping, typingUserIds, roomPageProps, chatId, queryClient]);

  // delete chat function
  const deleteChatMutation = useMutation({
    mutationFn: (chatId) => handleDeleteChat(chatId),
    onSuccess: (_, chatId) => {
      // Clear conversation messages (chatroom)
      queryClient.setQueryData(["conversation", chatId], { messages: [] });
      setMessages([]);

      // Clear sidebar lastMessage (Redux)
      dispatch(setLastMessage({ conversationId: chatId, message: null }));

      // Clear sidebar cache (React Query)
      queryClient.setQueryData(["userChat"], (old) =>
        old?.map((item) =>
          item.conversationId === chatId
            ? { ...item, lastMessage: null, updatedAt: null }
            : item
        )
      );
    },
  });

  // block chat function
  const blockChatMutation = useMutation({
    mutationFn: (chatId) => handleBlockChat(chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userChat"] });
      refetch();
    },
  });

  const handleClearChat = () => {
    setDialogType("clear");
    setDialogOpen(true);
    dispatch(setLastMessage({ conversationId, message: [] }));
  };

  const handleBlockUnblockChat = () => {
    setDialogType("block");
    setDialogOpen(true);
  };

  const isBlocked = blockedData?.blockedBy;

  // popover action buttons
  const popoverActions = [
    { label: "View Connection", icon: <Visibility /> },
    // { label: "Search", icon: <Search /> },
    {
      label: isBlocked === "you" ? "Unblock Chat" : "Block Chat",
      icon: <Block />,
      onClick: handleBlockUnblockChat,
    },
    { label: "Clear Chat", icon: <Delete />, onClick: handleClearChat },
  ];

  return (
    <>
      <Box
        sx={{
          display: { xs: chatId ? "flex" : "none", md: "flex" },
          flexDirection: "row",
          justifyContent: "center",
          flex: 1,
          height: "100vh",
          width: "100%",
        }}
      >
        {chatId ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              borderLeft: { xs: 0, md: 1 },
              borderRight: { xs: 0, md: 1 },
              borderColor: "divider",
              height: "100vh",
              width: "100%",
              bgcolor: "background.default",
            }}
          >
            {/* Header */}
            <ChatHeader
              roomPageProps={roomPageProps}
              usersStatus={usersStatus}
              handleOpen={handleOpen}
              id={id}
              onBack={onBack}
            />
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
                  gap: 0.5,
                  p: 1.5,
                  minWidth: "180px",
                }}
              >
                {popoverActions.map((item, i) => (
                  <Button
                    key={i}
                    startIcon={item.icon}
                    endIcon={<ChevronRight sx={{ ml: "auto", fontSize: "1.1rem", opacity: 0.7 }} />}
                    onClick={() => {
                      if (item.label === "Clear Chat") {
                        handleClearChat();
                      } else if (item.label === "Block Chat" || item.label === "Unblock Chat") {
                        handleBlockUnblockChat();
                      } else {
                        handleClickClose();
                      }
                    }}
                    sx={{
                      width: "100%",
                      justifyContent: "flex-start",
                      px: 2,
                      py: 1,
                      borderRadius: "10px",
                      color: item.label.includes("Delete") || item.label.includes("Block") || item.label.includes("Clear")
                        ? "#dc2626"
                        : "text.primary",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: item.label.includes("Delete") || item.label.includes("Block") || item.label.includes("Clear")
                          ? "rgba(220, 38, 38, 0.08)"
                          : "rgba(14, 116, 144, 0.08)",
                      },
                      "& .MuiButton-startIcon": {
                        color: "inherit",
                        mr: 1.5,
                      }
                    }}
                  >
                    <span style={{ flexGrow: 1, textAlign: "left" }}>{item.label}</span>
                  </Button>
                ))}
              </Box>
            </PopoverComp>

            {/* message list */}
            <MessageList
              isPending={isPending}
              allMessages={allMessages}
              loggedInUserId={loggedInUserId}
              roomPageProps={roomPageProps}
              messagesEndRef={messagesEndRef}
              chatId={chatId}
            />

            {/* typing indicator */}
            {isSomeoneTyping && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 3,
                  py: 1.5,
                  backgroundColor: "background.paper",
                  borderTop: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: 0.5,
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      backgroundColor: "primary.main",
                      animation: "bounce 1.4s infinite ease-in-out both",
                      animationDelay: "-0.32s",
                    }}
                  />
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      backgroundColor: "primary.main",
                      animation: "bounce 1.4s infinite ease-in-out both",
                      animationDelay: "-0.16s",
                    }}
                  />
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      backgroundColor: "primary.main",
                      animation: "bounce 1.4s infinite ease-in-out both",
                    }}
                  />
                </Box>
                <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 550, letterSpacing: "0.02em" }}>
                  {typingUserName} is typing
                </Typography>
                <style>{`
                  @keyframes bounce {
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1.0); }
                  }
                `}</style>
              </Box>
            )}

            {isBlocked && (
              <Box
                sx={{
                  mx: 2,
                  my: 1.5,
                  p: 2,
                  borderRadius: "16px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(239, 68, 68, 0.06)",
                  border: "1px solid rgba(239, 68, 68, 0.15)",
                  backdropFilter: "blur(8px)",
                  textAlign: "center",
                }}
              >
                {isBlocked === "you" ? (
                  <>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: "#ef4444" }}>
                      You have blocked this connection. Unblock to continue messaging.
                    </Typography>
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      sx={{
                        mt: 1.5,
                        textTransform: "none",
                        borderRadius: "8px",
                        fontWeight: 600,
                        boxShadow: "none",
                        "&:hover": { boxShadow: "none" },
                      }}
                      onClick={() => blockChatMutation.mutate(chatId)}
                    >
                      Unblock Chat
                    </Button>
                  </>
                ) : (
                  <Typography variant="body2" sx={{ fontWeight: 500, color: "#ef4444" }}>
                    Unable to send messages. You have been blocked by this user.
                  </Typography>
                )}
              </Box>
            )}

            {/* input box */}
            <ChatInput
              typeQuery={typeQuery}
              handleTyping={handleTyping}
              handleSendMessage={handleSendMessage}
              showEmojiPicker={showEmojiPicker}
              setShowEmojiPicker={setShowEmojiPicker}
              handleEmojiClick={handleEmojiClick}
              disabled={isBlocked}
            />
          </Box>
        ) : (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: 3,
              background: "radial-gradient(circle at 50% 50%, #151d30 0%, #0b0f19 100%)",
            }}
          >
            <Box
              sx={{
                p: 4,
                borderRadius: "24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "rgba(21, 30, 51, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 20px 25px -5px rgba(0,0,0,0.3), 0 10px 10px -5px rgba(0,0,0,0.2)",
                textAlign: "center",
                maxWidth: "400px",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 25px 30px -5px rgba(0,0,0,0.4), 0 15px 15px -5px rgba(0,0,0,0.3)",
                }
              }}
            >
              <Lottie
                animationData={emptyChat}
                loop={true}
                style={{ width: 180, height: 180 }}
              />
              <Typography
                variant="h6"
                color="primary"
                sx={{
                  fontWeight: 700,
                  mt: 2,
                  mb: 1,
                  background: "linear-gradient(45deg, #818cf8 30%, #22d3ee 90%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
              >
                Select a Chat
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ px: 2, lineHeight: 1.5 }}>
                Pick a conversation from the list to start exchanging messages, sharing media, and making calls.
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={handleClickClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: "20px",
            p: 1,
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)",
          }
        }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 700, pb: 1 }}>
          {dialogType === "clear"
            ? "Clear Chat History?"
            : isBlocked
              ? "Unblock Conversation?"
              : "Block Conversation?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" sx={{ color: "text.secondary" }}>
            {dialogType === "clear"
              ? "Are you sure you want to clear your chat history? This action will permanently remove all messages in this conversation."
              : isBlocked === "you"
                ? "Are you sure you want to unblock this conversation? You will start receiving messages and calls from this connection again."
                : "Are you sure you want to block this conversation? You will no longer receive any messages or calls from them."}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            size="medium"
            variant="outlined"
            onClick={handleClickClose}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              borderColor: "divider",
              color: "text.secondary",
              "&:hover": { borderColor: "text.primary" },
            }}
          >
            Cancel
          </Button>
          <Button
            size="medium"
            onClick={() => {
              console.log("Confirm clicked, chatId:", chatId);
              if (dialogType === "clear") {
                deleteChatMutation.mutate(chatId);
              } else {
                blockChatMutation.mutate(chatId);
              }
              handleClickClose();
              handleClose();
            }}
            variant="contained"
            color={dialogType === "clear" || !isBlocked ? "error" : "primary"}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "none",
              "&:hover": { boxShadow: "none" },
            }}
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChatRoomPage;
