import { Add, Done, DoneAll, MoreVert } from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/socketContext";
import { getCurrentUserId, handleGetUsersChat } from "../services";
import ChatRoomPage from "./ChatRoomPage";
import SocketEvents from "../constants/socketEvent";
import { incrementUnread, setLastMessage, setTypingStatus, setUnreadCount } from "../redux/slices/chatSlice";

const ChatSectionPage = () => {
  const socket = useSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const usersStatus = useSelector((state) => state.chat.usersStatus);
  const typingStatus = useSelector((state) => state.chat.typingStatus);
  const lastMessages = useSelector((state) => state.chat.lastMessages);
  const unreadCounts = useSelector((state) => state.chat.unreadCounts);
  const selectedC_IdRef = useRef();
  const myUserId = getCurrentUserId();
  const [roomPageProps, setRoomPageProps] = useState({});

  useEffect(() => {
    console.log("usersStatus", usersStatus);
  }, [usersStatus]);

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["userChat"],
    queryFn: handleGetUsersChat,
    refetchOnWindowFocus: false,
  });

  console.log("Data", data);

  useEffect(() => {
    if (!data) return;

    data.forEach((item) => {
      // dispatch(setUnreadCount({
      //   conversationId: item.conversationId,
      //   count: item.unreadCount || 0,
      // }));
      dispatch(setUnreadCount({ conversationId: item.conversationId, count: item.unreadCount || 0 }))

    });
  }, [data, dispatch]);

  const handleServerMessageReceive = (data) => {
    const newMessage = data.recieved_message
    // If user is currently viewing this chat → mark as read
    console.log("New message received at sidebar:", newMessage);
    dispatch(setLastMessage({
      conversationId: newMessage.conversation, message: newMessage
    }))
    if (newMessage.sender._id === myUserId)
      return;
    else
      dispatch(incrementUnread({ conversationId: newMessage.conversation }));
    // to update the sidebar 
    refetch();
  }
  useEffect(() => {
    if (!socket || !data?.length) return;

    // Map conversation objects to array of IDs
    const conversationIds = data.map(c => c.conversationId);

    // Fire join all event
    // socket.emit(SocketEvents.CLIENT_CHAT_JOIN_ALL, { conversationIds });
    socket.on(SocketEvents.SERVER_CHAT_RECEIVE, (data) => {
      handleServerMessageReceive(data);
    });
    return () => {
      // Fire leave all event on cleanup
      // socket.emit(SocketEvents.CLIENT_CHAT_LEAVE_ALL, { conversationIds });
      socket.off(SocketEvents.SERVER_CHAT_RECEIVE);

    }
  }, [socket, data]);


  const handleChatClick = (conversationId) => {
    if (!socket) return;
    // console.log("Joining Room", conversationId);
    selectedC_IdRef.current = conversationId;
  };

  // const clientChatLeave = () => {
  //   return socket.emit(SocketEvents.CLIENT_CHAT_LEAVE, {
  //     conversationId: selectedC_IdRef.current,
  //   });
  // };

  // useEffect(() => {
  //   return () => {
  //     clientChatLeave();
  //   };
  // }, []);

  useEffect(() => {
    if (!socket) return;

    const handleTyping = (data) => {
      const { conversationId, userId } = data;
      dispatch(
        setTypingStatus({
          conversationId,
          userId,
          typing: true,
        })
      );
    };

    const handleStopTyping = (data) => {
      const { conversationId, userId } = data;
      dispatch(
        setTypingStatus({
          conversationId,
          userId,
          typing: false,
        })
      );
    };

    socket.on(SocketEvents.SERVER_CHAT_TYPING, handleTyping);
    socket.on(SocketEvents.SERVER_CHAT_STOP_TYPING, handleStopTyping);

    return () => {
      socket.off(SocketEvents.SERVER_CHAT_TYPING, handleTyping);
      socket.off(SocketEvents.SERVER_CHAT_STOP_TYPING, handleStopTyping);
    };
  }, [socket, dispatch]);

  return (
    <Box display="flex" height="100%">
      <Paper
        elevation={3}
        sx={{ width: 300, p: 2, display: "flex", flexDirection: "column" }}
      >
        <TextField
          placeholder="Search Friends"
          size="small"
          fullWidth
          variant="outlined"
        />

        {isError && (
          <Typography sx={{ marginTop: 2, textAlign: "center" }}>
            Oops! No data found
          </Typography>
        )}

        {data?.length === 0 ? (
          <Box
            sx={{
              mt: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography sx={{ textAlign: "center" }}>
              It seems like you have no connections yet!
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<Add />}
              onClick={() => navigate("/dashboard/connections")}
            >
              Add Connections
            </Button>
          </Box>
        ) : isPending ? (
          <Stack
            spacing={1}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 1,
              gap: 2,
            }}
          >
            <Skeleton variant="circular" width={50} height={50} />
            <Skeleton variant="rounded" width={200} height={50} />
          </Stack>
        ) : (
          <List sx={{ overflowY: "auto", flex: 1 }}>
            {data?.map((item, i) => {
              const isDirect = item.type === "direct";
              const participants = item.participants?.[0];

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

              const convTyping = typingStatus?.[item.conversationId] || {};
              const isSomeoneTyping =
                convTyping &&
                Object.values(convTyping).some((u) => u.typing === true);
              const lastMessage = lastMessages[item.conversationId] || item?.lastMessage;
              const isMine = lastMessage?.sender._id === myUserId
              console.log("unreadCounts", unreadCounts);
              return (
                <ListItem
                  key={i}
                  disablePadding
                  sx={{ "&:hover .hoverIcon": { opacity: 1 } }}
                  onClick={() => {
                    handleChatClick(item.conversationId);
                    setRoomPageProps({
                      fullName: participants?.full_name,
                      profilePic: participants?.profilePic,
                      userId: participants?._id,
                    });
                  }}
                >
                  <ListItemButton sx={{ px: 1 }}>
                    <ListItemAvatar>
                      <Badge
                        overlap="circular"
                        variant="dot"
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        color={
                          usersStatus?.[participants?._id]?.online
                            ? "success"
                            : "default"
                        }
                      // color="success"
                      >
                        <Avatar
                          src={
                            isDirect
                              ? participants?.profilePic
                              : item.groupAvatar
                          }
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
                          <Box
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            {unreadCounts[item.conversationId] > 0 && (
                              <Badge
                                badgeContent={unreadCounts[item.conversationId] > 99 ? "99+" : unreadCounts[item.conversationId]}
                                color="error"
                                overlap="circular"
                                anchorOrigin={{
                                  vertical: "top",
                                  horizontal: "right",
                                }}
                              />
                            )}
                            <IconButton
                              size="small"
                              className="hoverIcon"
                              sx={{ opacity: 0, transition: "opacity 0.2s ease" }}
                            >
                              <MoreVert sx={{ fontSize: "20px" }} />
                            </IconButton>
                          </Box>
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
                            {lastMessage && lastMessage.sender._id === myUserId && !isSomeoneTyping && (
                              <Typography
                                component="span"
                                variant="caption"
                                sx={{ color: "text.secondary", flexShrink: 0 }}
                              >
                                {lastMessage.readBy?.includes(participants?._id) ?
                                  <DoneAll
                                    fontSize="small"
                                    sx={{ color: "#4fc3f7", fontSize: "1rem" }} // blue double tick if read
                                  /> : <Done
                                    fontSize="small"
                                    sx={{ color: isMine ? "rgba(0, 0, 0, 0.7)" : "gray", fontSize: "1rem" }}
                                  />}
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
                                fontWeight:
                                  isSomeoneTyping
                                    ? 800 // bold italic for typing
                                    : lastMessage && lastMessage.sender._id !== myUserId && !lastMessage.readBy?.includes(myUserId)
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
                            sx={{ whiteSpace: "nowrap", color: "text.secondary" }}
                          >
                            {formattedPaymentTime}
                          </Typography>
                        </Box>

                      }
                    />

                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        )}
      </Paper>
      <ChatRoomPage
        selectedC_IdRef={selectedC_IdRef}
        roomPageProps={roomPageProps}
        updateSidebarOrder={refetch}
      />
    </Box>
  );
};

export default ChatSectionPage;
