import axios from "axios";

const domain = "https://webrtc-backend-1ipj.onrender.com/api/v1";

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

export const handleGetUsers = async (refreshToken) => {
  try {
    const token = getTokenFromLocalStorage();

    const response = await axios.get(`${domain}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Users:", response.data);
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
    console.error("Get users failed:", error.response?.data || error.message);
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
    console.error("Get users failed:", error.response?.data || error.message);
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
    console.error("Get users failed:", error.response?.data || error.message);
    throw error;
  }
};
export const handleActionBlock = async (userId) => {
  try {
    const token = getTokenFromLocalStorage();

    const response = await axios.post(
      `${domain}/users/block`,
      {
        userId,
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
    console.error("Get users failed:", error.response?.data || error.message);
    throw error;
  }
};
