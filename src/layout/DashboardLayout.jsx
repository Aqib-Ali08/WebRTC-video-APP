import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

const DashboardLayout = () => {
  return (
    <Box display="flex">
      <Sidebar />
      <Box flex={1} p={3}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
