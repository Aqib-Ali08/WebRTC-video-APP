import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

const DashboardLayout = () => {
  return (
    <Box display="flex" sx={{ overflow: "hidden" }}>
      <Sidebar />
      <Box flex={1} height={"100vh"}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
