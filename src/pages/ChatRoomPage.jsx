import {
  Block,
  ChevronRight,
  Delete,
  Search,
  Visibility,
} from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUserId, handleGetUserChatHistory } from "../services";
import SocketEvents from "../constants/socketEvent";
import { useSocket } from "../context/socketContext";
import { debounce } from "lodash";
import {
  clearUnread,
  incrementUnread,
  setLastMessage,
  updateLastMessageStatus,
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
}) => {
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

    dispatch(clearUnread({ conversationId: chatId }));
  }, [chatId, allMessages, socket]);

  const convTyping = typingStatus?.[chatId] || {};
  const isSomeoneTyping =
    convTyping && Object.values(convTyping || {}).some((u) => u.typing);

  // popover action buttons
  const popoverActions = [
    { label: "View Connection", icon: <Visibility /> },
    { label: "Search", icon: <Search /> },
    { label: "Block Chat", icon: <Block /> },
    { label: "Delete Chat", icon: <Delete /> },
  ];

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
          <ChatHeader
            roomPageProps={roomPageProps}
            usersStatus={usersStatus}
            handleOpen={handleOpen}
            id={id}
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
            <Typography px={2} py={1} color="textSecondary">
              Typing...
            </Typography>
          )}

          {/* input box */}
          <ChatInput
            typeQuery={typeQuery}
            handleTyping={handleTyping}
            handleSendMessage={handleSendMessage}
            showEmojiPicker={showEmojiPicker}
            setShowEmojiPicker={setShowEmojiPicker}
            handleEmojiClick={handleEmojiClick}
          />
        </Box>
      ) : (
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          marginLeft="20rem"
        >
          <Lottie
            animationData={emptyChat}
            loop={true}
            style={{ width: 200, height: 200 }}
          />
          <Typography variant="h6" color="primary" sx={{ fontWeight: "bold" }}>
            Select a chat to start messaging
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ChatRoomPage;
