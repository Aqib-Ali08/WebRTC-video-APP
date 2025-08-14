// src/components/Sidebar.jsx
import { Tabs, Tab, Tooltip, Avatar } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  AddBox,
  CalendarMonth,
  ChatBubble,
  Dashboard,
  Notifications,
  Person,
  PersonAdd,
  Settings,
} from "@mui/icons-material";

const navItems = [
  {
    path: "/dashboard/home",
    label: "Home",
    // icon: "material-symbols:home"
    icon: <Dashboard />,
  },
  {
    path: "/dashboard/connections",
    label: "Connections",
    // icon: "basil:user-plus-solid",
    icon: <PersonAdd />,
  },
  {
    path: "/dashboard/notifications",
    label: "Notifications",
    icon: <Notifications />,
  },
  {
    path: "/dashboard/meetings",
    label: "Meetings",
    // icon: "material-symbols:calendar-month",
    icon: <CalendarMonth />,
  },
  {
    path: "/dashboard/messages",
    label: "Messages",
    // icon: "material-symbols:chat",
    icon: <ChatBubble />,
  },
  {
    path: "/dashboard/schedule",
    label: "Schedule",
    // icon: "material-symbols:add-circle-outline",
    icon: <AddBox />,
  },
  {
    path: "/dashboard/profile",
    label: "Profile",
    // icon: "material-symbols:person",
    icon: <Person />,
  },
  {
    path: "/dashboard/settings",
    label: "Settings",
    // icon: "material-symbols:settings",
    icon: <Settings />,
  },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const sessionStorageData = sessionStorage.getItem("authData");
    const localStorageData = localStorage.getItem("authData");

    if (sessionStorageData || localStorageData) {
      try {
        const authData = JSON.parse(sessionStorageData || localStorageData);
        const user = authData.user;
        console.log("user", user);
        setUserName(user);
      } catch (e) {
        console.error("Error parsing authData from sessionStorage", err);
      }
    }
  }, []);

  const currentTab = navItems.findIndex((item) =>
    location.pathname.startsWith(item.path)
  );

  const firstName =
    userName
      .split()
      .map((firstname) => firstname[0])
      .join("")
      .toUpperCase() || "User";

  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        width: "80px",
        // height: "100vh",
        height: "auto",
        background: "#f9fafb",
        boxShadow: "2px 0 6px rgba(0,0,0,0.05)",
        padding: "1rem 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* <Box
        fontWeight={700}
        fontSize="1.3rem"
        mb={4}
        sx={{ fontFamily: "Poppins", color: "#667eea", cursor: "pointer" }}
        onClick={() => navigate("/dashboard/home")}
      >
        S
      </Box> */}
      <Tooltip title={userName.toUpperCase()}>
        <Avatar
          sx={{
            fontFamily: "Poppins",
            // backgroundColor: "#667eea",
            backgroundColor: "#0e7490",
            cursor: "pointer",
          }}
        >
          {firstName}
        </Avatar>
      </Tooltip>

      <Tabs
        orientation="vertical"
        value={currentTab}
        onChange={(_, newValue) => navigate(navItems[newValue].path)}
        sx={{
          ".MuiTabs-flexContainer": {
            marginTop: "3rem",
            gap: "1rem",
          },
          ".MuiTabs-indicator": {
            // backgroundColor: "#667eea",
            backgroundColor: "#0e7490",
            width: "4px",
          },
        }}
      >
        {navItems.map((item, index) => (
          <Tooltip key={index} title={item.label} placement="right">
            <Tab
              icon={
                // <Icon
                //   icon={item.icon}
                //   width="24"
                //   color={
                //     currentTab === index
                //       ? // "#667eea"
                //         "#0e7490"
                //       : "rgba(0,0,0,0.6)"
                //   }
                // />
                item.icon
              }
              sx={{
                minWidth: "auto",
                padding: "12px",
                borderRadius: "10px",
                "&:hover": {
                  backgroundColor: "rgba(102, 126, 234, 0.1)",
                },
              }}
            />
          </Tooltip>
        ))}
      </Tabs>
    </motion.aside>
  );
};

export default Sidebar;
