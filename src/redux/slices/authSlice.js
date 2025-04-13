import { createSlice } from "@reduxjs/toolkit";


const storage =
  localStorage.getItem("authData") || sessionStorage.getItem("authData");

let authData = storage ? JSON.parse(storage) : null;

const initialState = {
  authData: authData || {
    user: null,
    token: null,
    refreshToken: null,
    expiresAt: null,
  },
  isAuthenticated: authData?.token ? true : false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { user, token, refreshToken, expiresAt, rememberMe } = action.payload;

      const authData = { user, token, refreshToken, expiresAt };
      state.authData = authData;
      state.isAuthenticated = true;

      const storageType = rememberMe ? localStorage : sessionStorage;
      storageType.setItem("authData", JSON.stringify(authData));
    },

    logout: (state) => {
      state.authData = {
        user: null,
        token: null,
        refreshToken: null,
        expiresAt: null,
      };
      state.isAuthenticated = false;

      localStorage.removeItem("authData");
      sessionStorage.removeItem("authData");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
export const selectAuthData = (state) => state.auth.authData;