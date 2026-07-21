import { Box, Fab, Skeleton } from "@mui/material";
import MessageBubble from "./MessageBubble";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowDownward } from "@mui/icons-material";

export default function MessageList({
  isPending,
  loggedInUserId,
  roomPageProps,
  messagesEndRef,
  allMessages,
  chatId,
}) {
  const containerRef = useRef(null);
  const firstRenderRef = useRef(true);
  const [showNewMesgBtn, setShowNewMsgBtn] = useState(false);

  useLayoutEffect(() => {
    if (allMessages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      setShowNewMsgBtn(false);
    }
  }, [chatId, allMessages.length]);

  // handle new msgs
  useEffect(() => {
    if (firstRenderRef.current) return;

    if (allMessages.length > 0 && containerRef.current) {
      const container = containerRef.current;

      const isNearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        50;

      if (isNearBottom) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        setShowNewMsgBtn(false);
      } else {
        setShowNewMsgBtn(true);
      }
    }
  }, [allMessages]);

  const handleScroll = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      50;

    if (isNearBottom) {
      setShowNewMsgBtn(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowNewMsgBtn(false);
  };

  return (
    <Box
      ref={containerRef}
      flex={1}
      p={2}
      display="flex"
      flexDirection="column"
      gap={2.5}
      overflow="auto"
      bgcolor="background.default"
      onScroll={handleScroll}
      position="relative"
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
                    bgcolor: alignLeft ? "action.selected" : "action.hover",
                  }}
                />
              </Box>
            );
          })
        : allMessages.map((msg) => (
            <MessageBubble
              key={msg.message_id}
              msg={msg}
              loggedInUserId={loggedInUserId}
              roomPageProps={roomPageProps}
              messageId={msg.message_id}
            />
          ))}
      <div ref={messagesEndRef} />

      {/* Floating "New Messages" button */}
      {showNewMesgBtn && (
        <Fab
          size="small"
          color="primary"
          sx={{ position: "absolute", bottom: 16, right: 16 }}
          onClick={scrollToBottom}
        >
          <ArrowDownward />
        </Fab>
      )}
    </Box>
  );
}
