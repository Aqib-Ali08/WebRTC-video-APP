import SocketEvents from "../constants/socketEvent";
import {
  setUsersStatus,
  setUserOnline,
  setUserOffline,
  setLastMessage,
  incrementUnread,
} from "../redux/slices/chatSlice";
export const registerPresenceSocketHandlers = (socket, dispatch) => {
  const handlePresenceInit = (users) => {
    // console.log("already available users", users);
    dispatch(setUsersStatus(users.online_users));
  };

  const handleUserOnline = (users) => {
    // console.log("newly available users", users);
    dispatch(setUserOnline(users));
  };

  const handleUserOffline = (users) => {
    // console.log("offline users", users);
    dispatch(setUserOffline(users));
  };

  const handleMessageReceive = (data) => {
    const newMessage = data.recieved_message;
    // If user is currently viewing this chat → mark as read
    console.log("New message received at sidebar:", newMessage);
    dispatch(
      setLastMessage({
        conversationId: newMessage.conversation,
        message: newMessage,
      })
    );
    // Skip if it's my own message
    if (newMessage.sender._id === myUserId) return;

    dispatch(incrementUnread({ conversationId: newMessage.conversation }));
    // to update the sidebar
    refetch?.();
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
