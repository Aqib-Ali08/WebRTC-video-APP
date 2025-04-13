import axios from "axios";

const domain = "https://webrtc-backend-1ipj.onrender.com/api/v1/";

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
