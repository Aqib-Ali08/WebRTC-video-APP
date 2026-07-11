import { Add } from "@mui/icons-material";
import {
  Box,
  Button,
  List,
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
import {
  incrementUnread,
  setLastMessage,
  setTypingStatus,
  setUnreadCount,
} from "../redux/slices/chatSlice";
import ChatListItem from "../components/ChatListItem";

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
      dispatch(
        setUnreadCount({
          conversationId: item.conversationId,
          count: item.unreadCount || 0,
        })
      );
    });
  }, [data, dispatch]);

  useEffect(() => {
    if (!socket) return;

    const handleMessageReceive = () => {
      refetch();
    };

    socket.on(SocketEvents.SERVER_CHAT_RECEIVE, handleMessageReceive);

    return () => {
      socket.off(SocketEvents.SERVER_CHAT_RECEIVE, handleMessageReceive);
    };
  }, [socket, refetch]);

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

  const handleChatClick = (conversationId, participants, blockedBy) => {
    selectedC_IdRef.current = conversationId;
    setRoomPageProps({
      fullName: participants?.full_name,
      profilePic: participants?.profilePic,
      userId: participants?._id,
      blockedBy,
    });
  };

  const handleBackToChats = () => {
    selectedC_IdRef.current = null;
    setRoomPageProps({});
  };

  const isChatOpen = !!selectedC_IdRef.current;

  return (
    <Box display="flex" height="100%" sx={{ overflow: "hidden", width: "100%" }}>
      <Paper
        elevation={3}
        sx={{
          width: { xs: "100%", md: 300 },
          p: 2,
          display: { xs: isChatOpen ? "none" : "flex", md: "flex" },
          flexDirection: "column",
          boxSizing: "border-box",
        }}
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
              return (
                <ChatListItem
                  key={i}
                  item={item}
                  myUserId={myUserId}
                  lastMessages={lastMessages}
                  typingStatus={typingStatus}
                  unreadCounts={unreadCounts}
                  usersStatus={usersStatus}
                  onChatClick={(conversationId, participants) =>
                    handleChatClick(
                      conversationId,
                      participants,
                      item.blockedBy
                    )
                  }
                />
              );
            })}
          </List>
        )}
      </Paper>
      <ChatRoomPage
        selectedC_IdRef={selectedC_IdRef}
        roomPageProps={roomPageProps}
        updateSidebarOrder={refetch}
        onBack={handleBackToChats}
      />
    </Box>
  );
};

export default ChatSectionPage;
