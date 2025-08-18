import SocketEvents from "../constants/socketEvent";
import { setUsersStatus, setUserOnline, setUserOffline } from "../redux/slices/chatSlice"
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

    socket.on(SocketEvents.SERVER_PRESENCE_INIT, handlePresenceInit);
    socket.on(SocketEvents.SERVER_USER_ONLINE, handleUserOnline);
    socket.on(SocketEvents.SERVER_USER_OFFLINE, handleUserOffline);

    return () => {
        socket.off(SocketEvents.SERVER_PRESENCE_INIT, handlePresenceInit);
        socket.off(SocketEvents.SERVER_USER_ONLINE, handleUserOnline);
        socket.off(SocketEvents.SERVER_USER_OFFLINE, handleUserOffline);
    };
}