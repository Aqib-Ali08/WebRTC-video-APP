// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import appSlice from './slices/appSlice'
export const store = configureStore({
  reducer: {
    auth: authSlice,
    app: appSlice,
  },
});
