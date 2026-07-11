import SocketEvents from "../constants/socketEvent";
import {
  setUsersStatus,
  setUserOnline,
  setUserOffline,
  setLastMessage,
  incrementUnread,
} from "../redux/slices/chatSlice";
import { getCurrentUserId } from "../services";
import { store } from "../redux/store";
import { toast } from "react-toastify";
import { queryClient } from "../queryClient";

export const registerPresenceSocketHandlers = (
  socket,
  dispatch
) => {
  const handlePresenceInit = (users) => {
    dispatch(setUsersStatus(users.online_users));
  };

  const handleUserOnline = (users) => {
    dispatch(setUserOnline(users));
  };

  const handleUserOffline = (users) => {
    dispatch(setUserOffline(users));
  };

  const handleMessageReceive = (data) => {
    const newMessage = data.recieved_message;
    console.log("New message received globally:", newMessage);

    const state = store.getState();
    const myUserId = getCurrentUserId();
    const activeChatId = state.chat.activeChatId;

    // Always update last message in redux
    dispatch(
      setLastMessage({
        conversationId: newMessage.conversation,
        message: newMessage,
      })
    );

    // Skip if it's my own message
    if (newMessage.sender?._id === myUserId) return;

    const isCurrentChatOpen = newMessage.conversation === activeChatId;

    if (!isCurrentChatOpen) {
      // Increment unread count in redux
      dispatch(incrementUnread({ conversationId: newMessage.conversation }));

      // Find sender name from TanStack query cache
      let senderName = "Someone";
      try {
        const activeChats = queryClient.getQueryData(["userChat"]);
        const activeConversation = activeChats?.find((c) => c.conversationId === newMessage.conversation);
        if (activeConversation) {
          const participant = activeConversation.participants?.find((p) => p._id === newMessage.sender?._id);
          senderName = participant?.full_name || activeConversation.participants?.[0]?.full_name || "Someone";
        }
      } catch (err) {
        console.error("Error finding sender name:", err);
      }

      // Show toast notification
      const textContent = newMessage.content || "Sent a message";
      toast.info(`New message from ${senderName}: "${textContent.length > 40 ? textContent.substring(0, 40) + '...' : textContent}"`, {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    }
  };

  socket.on(SocketEvents.SERVER_PRESENCE_INIT, handlePresenceInit);
  socket.on(SocketEvents.SERVER_USER_ONLINE, handleUserOnline);
  socket.on(SocketEvents.SERVER_USER_OFFLINE, handleUserOffline);
  socket.on(SocketEvents.SERVER_CHAT_RECEIVE, handleMessageReceive);

  return () => {
    socket.off(SocketEvents.SERVER_PRESENCE_INIT, handlePresenceInit);
    socket.off(SocketEvents.SERVER_USER_ONLINE, handleUserOnline);
    socket.off(SocketEvents.SERVER_USER_OFFLINE, handleUserOffline);
    socket.off(SocketEvents.SERVER_CHAT_RECEIVE, handleMessageReceive);
  };
};
