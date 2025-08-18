import { Box } from "@mui/material";
import ChatRoomPage from "./ChatRoomPage";
import { useSocket } from "../context/socketContext";
import { useEffect } from "react";
import SocketEvent from "../constants/socketEvent";
import { setUserOffline, setUserOnline, setUsersStatus } from "../redux/slices/chatSlice";
import { useDispatch, useSelector } from "react-redux";

const ChatSectionPage = () => {
  const socket = useSocket()
  const dispatch = useDispatch()



  return (
    <Box display="flex" height="100%">
      <ChatRoomPage />
    </Box>
  );
};

export default ChatSectionPage;
