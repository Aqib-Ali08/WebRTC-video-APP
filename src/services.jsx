import axios from "axios";
import { jwtDecode } from "jwt-decode";

// const domain = "https://webrtc-backend-1ipj.onrender.com/api/v1";
const domain = "https://webrtc-backend-xmll.onrender.com/api/v1";

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
