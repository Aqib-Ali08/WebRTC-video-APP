import axios from "axios";
import { jwtDecode } from "jwt-decode";

// const domain = "https://webrtc-backend-1ipj.onrender.com/api/v1";
const domain = `${import.meta.env.VITE_SERVER_URL || "http://localhost:3000"}/api/v1`;

export function getTokenFromLocalStorage() {
  const authData =
    localStorage.getItem("authData") || sessionStorage.getItem("authData");

  if (!authData) return null;

  try {
    const parsed = JSON.parse(authData);
    return parsed.token || null;
  } catch (error) {
    console.error("Failed to parse auth data:", error);
    return null;
  }
}

export const getCurrentUserId = () => {
  try {
    const token = getTokenFromLocalStorage();
    if (!token) return null;

    const decoded = jwtDecode(token);
    console.log(decoded);
    return decoded.id || decoded.userId || null;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

export const getCurrentUserFullName = () => {
  try {
    const token = getTokenFromLocalStorage();
    if (!token) return null;

    const decoded = jwtDecode(token);
    return decoded.full_name || null;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

export const handleLogin = async (username, password) => {
  try {
    const response = await axios.post(`${domain}/auth/login`, {
      username,
      password,
    });
    console.log("Login successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }
};

export const handleRegister = async (full_name, username, password) => {
  try {
    const response = await axios.post(`${domain}/auth/register`, {
      full_name,
      username,
      password,
    });
    console.log("register successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("register failed:", error.response?.data || error.message);
    throw error;
  }
};

export const handleRefreshToken = async (refreshToken) => {
  try {
    const response = await axios.post(`${domain}/auth/refreshToken`, {
      refreshToken,
    });
    console.log("register successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("register failed:", error.response?.data || error.message);
    throw error;
  }
};

export const handleSearchList = async (searchQuery) => {
  try {
    const token = getTokenFromLocalStorage();

    const response = await axios.get(
      `${domain}/search/searchUser?q=${searchQuery}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Search List Users:", response.data);
    return response.data.results;
  } catch (error) {
    console.error(
      "Get search users failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const handleListOtherUsers = async (page, rowsPerPage) => {
  try {
    const token = getTokenFromLocalStorage();

    const response = await axios.post(
      `${domain}/users/list_other_users`,
      {
        page: page,
        limit: rowsPerPage,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("List Other Users:", response.data);
    return response.data;
  } catch (error) {
    console.error("Get users failed:", error.response?.data || error.message);
    throw error;
  }
};

export const handleListReceivedRequests = async (page, rowsPerPage) => {
  try {
    const token = getTokenFromLocalStorage();

    const response = await axios.post(
      `${domain}/users/list_recieved_requests`,
      {
        page: page,
        limit: rowsPerPage,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("List Received Requests:", response.data);
    return response.data;
  } catch (error) {
    console.error("Get users failed:", error.response?.data || error.message);
    throw error;
  }
};

export const handleListConnectedUsers = async (page, rowsPerPage) => {
  try {
    const token = getTokenFromLocalStorage();

    const response = await axios.post(
      `${domain}/users/list_connected_users`,
      {
        page: page,
        limit: rowsPerPage,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("List Connected Users:", response.data);
    return response.data;
  } catch (error) {
    console.error("Get users failed:", error.response?.data || error.message);
    throw error;
  }
};

export const handleActionAdd = async (receiverId) => {
  try {
    const token = getTokenFromLocalStorage();

    const response = await axios.post(
      `${domain}/connect/sendRequest`,
      {
        receiverId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // console.log("Users:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Add request users failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const handleActionAccept = async (senderId) => {
  try {
    const token = getTokenFromLocalStorage();

    const response = await axios.post(
      `${domain}/connect/acceptRequest`,
      {
        senderId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // console.log("Users:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Accept request users failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const handleActionCancel = async (senderId) => {
  try {
    const token = getTokenFromLocalStorage();

    const response = await axios.post(
      `${domain}/connect/cancelRequest`,
      {
        senderId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // console.log("Users:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Cancel request users failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const handleActionBlock = async (userId, actionType) => {
  try {
    const token = getTokenFromLocalStorage();

    const response = await axios.post(
      `${domain}/connect/toggleUserBlock`,
      {
        userId,
        action_type: actionType,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // console.log("Users:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Block/Unblock users failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const handleActionDisconnectFriend = async (userId) => {
  try {
    const token = getTokenFromLocalStorage();

    const response = await axios.post(
      `${domain}/connect/disconnectFriend`,
      {
        targetUserId: userId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Disconnect user request failed:",
      error.response?.data || error.message
    );
  }
};

export const handleGetUsersChat = async () => {
  try {
    const token = getTokenFromLocalStorage();

    const response = await axios.get(`${domain}/chats/get_users_for_chats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Get Users Chat:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Get users chats failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const handleGetUserChatHistory = async (chatId) => {
  try {
    const token = getTokenFromLocalStorage();

    const response = await axios.get(
      `${domain}/chats/get_users_chat_history?conversation_id=${chatId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Get Users Chat History", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Get users chat history failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const handleGetUserBlockStatus = async (chatId) => {
  try {
    const token = getTokenFromLocalStorage();

    const response = await axios.get(
      `${domain}/chats/get_users_block_status?conversation_id=${chatId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Get Users Block Chat Status", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Get users block chat status failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const handleDeleteChat = async (chatId) => {
  try {
    const token = getTokenFromLocalStorage();

    const response = await axios.post(
      `${domain}/chats/clear_chat_history`,
      {
        conversationId: chatId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Chat Deleted Successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Unable to delete chat:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const handleBlockChat = async (chatId) => {
  try {
    const token = getTokenFromLocalStorage();

    const response = await axios.post(
      `${domain}/chats/toggle_chat_block_unblock`,
      {
        conversationId: chatId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Chat Blocked Successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Unable to block chat:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const handleDeleteMessage = async (messageId, dialogType) => {
  try {
    const token = getTokenFromLocalStorage();

    const response = await axios.post(
      `${domain}/chats/delete_message`,
      {
        messageId,
        actionType: dialogType
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Message Deleted Successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Unable to delete message:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ==========================================
// NOTES & SHARING APIS
// ==========================================

export const handleGetNotes = async () => {
  try {
    const token = getTokenFromLocalStorage();
    const response = await axios.get(`${domain}/notes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Get notes failed:", error.response?.data || error.message);
    throw error;
  }
};

export const handleCreateNote = async (noteData) => {
  try {
    const token = getTokenFromLocalStorage();
    const response = await axios.post(`${domain}/notes`, noteData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Create note failed:", error.response?.data || error.message);
    throw error;
  }
};

export const handleUpdateNote = async (noteId, noteData) => {
  try {
    const token = getTokenFromLocalStorage();
    const response = await axios.put(`${domain}/notes/${noteId}`, noteData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Update note failed:", error.response?.data || error.message);
    throw error;
  }
};

export const handleDeleteNote = async (noteId) => {
  try {
    const token = getTokenFromLocalStorage();
    const response = await axios.delete(`${domain}/notes/${noteId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Delete note failed:", error.response?.data || error.message);
    throw error;
  }
};

export const handleGetSharedNotes = async () => {
  try {
    const token = getTokenFromLocalStorage();
    const response = await axios.get(`${domain}/notes/shared`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Get shared notes failed:", error.response?.data || error.message);
    throw error;
  }
};

export const handleShareNote = async (noteId, recipientId) => {
  try {
    const token = getTokenFromLocalStorage();
    const response = await axios.post(
      `${domain}/notes/shared`,
      { noteId, recipientId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Share note failed:", error.response?.data || error.message);
    throw error;
  }
};

export const handleUnshareNote = async (sharedId) => {
  try {
    const token = getTokenFromLocalStorage();
    const response = await axios.delete(`${domain}/notes/shared/${sharedId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Unshare note failed:", error.response?.data || error.message);
    throw error;
  }
};

export const handleGetNotifications = async () => {
  try {
    const token = getTokenFromLocalStorage();
    const response = await axios.get(`${domain}/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Get notifications failed:", error.response?.data || error.message);
    throw error;
  }
};

export const handleMarkNotificationAsRead = async (id) => {
  try {
    const token = getTokenFromLocalStorage();
    const response = await axios.put(`${domain}/notifications/${id}/read`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Mark notification as read failed:", error.response?.data || error.message);
    throw error;
  }
};

export const handleMarkAllNotificationsAsRead = async () => {
  try {
    const token = getTokenFromLocalStorage();
    const response = await axios.put(`${domain}/notifications/mark-all-read`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Mark all notifications as read failed:", error.response?.data || error.message);
    throw error;
  }
};



// --- Meeting APIs ---
export const handleCreateMeeting = async (data) => {
  try {
    const token = getTokenFromLocalStorage();
    const response = await axios.post(`${domain}/meetings`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating meeting', error);
    throw error;
  }
};

export const handleGetMeetings = async () => {
  try {
    const token = getTokenFromLocalStorage();
    const response = await axios.get(`${domain}/meetings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching meetings', error);
    throw error;
  }
};

export const handleGetMeetingById = async (roomId) => {
  try {
    const token = getTokenFromLocalStorage();
    const response = await axios.get(`${domain}/meetings/${roomId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching meeting details', error);
    throw error;
  }
};
