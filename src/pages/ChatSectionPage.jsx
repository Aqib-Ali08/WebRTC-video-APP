import { Box, Typography } from "@mui/material";

import ChatRoomPage from "./ChatRoomPage";
import ChatSidebarList from "./ChatSidebarList";
import ChatProfilePanel from "./ChatProfilePanel";
import { useParams } from "react-router-dom";

const ChatSectionPage = () => {
  const { chatId } = useParams();

  return (
    <Box display="flex" height="100%">
      {/* Sidebar */}
      {/* <ChatSidebarList /> */}

      {/* Chat Section */}

      <ChatRoomPage />

      {/* Profile Panel */}
      {/* <ChatProfilePanel /> */}
    </Box>
  );
};

export default ChatSectionPage;
