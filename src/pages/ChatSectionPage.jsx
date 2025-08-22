import { Add, MoreVert } from "@mui/icons-material";
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
import { setTypingStatus } from "../redux/slices/chatSlice";

const ChatSectionPage = () => {
  const socket = useSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const usersStatus = useSelector((state) => state.chat.usersStatus);
  const typingStatus = useSelector((state) => state.chat.typingStatus);
  const selectedC_IdRef = useRef();
  const [roomPageProps, setRoomPageProps] = useState({});

  useEffect(() => {
    console.log("usersStatus", usersStatus);
  }, [usersStatus]);

  const { data, isPending, isError } = useQuery({
    queryKey: ["userChat"],
    queryFn: handleGetUsersChat,
    refetchOnWindowFocus: false,
  });

  console.log("Data", data);

  const handleChatClick = (conversation_id) => {
    if (!socket) return;

    if (
      selectedC_IdRef.current &&
      selectedC_IdRef.current !== conversation_id
    ) {
      // console.log("Leaving Room", selectedC_IdRef.current);
      socket.emit(SocketEvents.CLIENT_CHAT_LEAVE, {
        conversationId: selectedC_IdRef.current,
      });
    }

    // console.log("Joining Room", conversation_id);
    selectedC_IdRef.current = conversation_id;

    socket.emit(SocketEvents.CLIENT_CHAT_JOIN, {
      conversationId: conversation_id,
    });
    // console.log("Joined Room", selectedC_IdRef.current);
  };

  const clientChatLeave = () => {
    return socket.emit(SocketEvents.CLIENT_CHAT_LEAVE, {
      conversationId: selectedC_IdRef.current,
    });
  };

  useEffect(() => {
    return () => {
      clientChatLeave();
    };
  }, []);

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
              const participant = item.participants?.[0];

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

              const convTyping = typingStatus?.[item.conversation_id] || {};
              const isSomeoneTyping =
                convTyping &&
                Object.values(convTyping).some((u) => u.typing === true);

              return (
                <ListItem
                  key={i}
                  disablePadding
                  sx={{ "&:hover .hoverIcon": { opacity: 1 } }}
                  onClick={() => {
                    handleChatClick(item.conversation_id);
                    setRoomPageProps({
                      fullName: participant?.full_name,
                      profilePic: participant?.profilePic,
                      userId: participant?._id,
                    });
                  }}
                >
                  <ListItemButton>
                    <ListItemAvatar>
                      <Badge
                        overlap="circular"
                        variant="dot"
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        color={
                          usersStatus?.[participant?._id]?.online
                            ? "success"
                            : "default"
                        }
                        // color="success"
                      >
                        <Avatar
                          src={
                            isDirect
                              ? participant?.profilePic
                              : item.groupAvatar
                          }
                          sx={{ bgcolor: "#0e7490" }}
                        >
                          {(isDirect
                            ? participant?.full_name?.[0]
                            : item.groupName?.[0]) || ""}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body1">
                          {isDirect ? participant?.full_name : item.groupName}
                        </Typography>
                      }
                      secondary={
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 2,
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: 100,
                            }}
                          >
                            {isSomeoneTyping
                              ? "Typing..."
                              : item?.lastMessage?.content}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            {formattedPaymentTime}
                          </Typography>
                        </Box>
                      }
                    />
                    <IconButton
                      size="small"
                      className="hoverIcon"
                      sx={{ opacity: 0, transition: "opacity 0.2s ease" }}
                    >
                      <MoreVert sx={{ fontSize: "20px" }} />
                    </IconButton>
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
      />
    </Box>
  );
};

export default ChatSectionPage;
