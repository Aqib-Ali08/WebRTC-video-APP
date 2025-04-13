// src/components/Sidebar.jsx

import React from "react";
import { Box, Tabs, Tab, Tooltip } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

const navItems = [
  { path: "/dashboard/home", label: "Home", icon: "material-symbols:home" },
  {
    path: "/dashboard/meetings",
    label: "Meetings",
    icon: "material-symbols:calendar-month",
  },
  {
    path: "/dashboard/messages",
    label: "Messages",
    icon: "material-symbols:chat",
  },
  {
    path: "/dashboard/schedule",
    label: "Schedule",
    icon: "material-symbols:add-circle-outline",
  },
  {
    path: "/dashboard/profile",
    label: "Profile",
    icon: "material-symbols:person",
  },
  {
    path: "/dashboard/settings",
    label: "Settings",
    icon: "material-symbols:settings",
  },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentTab = navItems.findIndex((item) =>
    location.pathname.startsWith(item.path)
  );

  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        width: "80px",
        height: "100vh",
        background: "#f9fafb",
        boxShadow: "2px 0 6px rgba(0,0,0,0.05)",
        padding: "1rem 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        fontWeight={700}
        fontSize="1.3rem"
        mb={4}
        sx={{ fontFamily: "Poppins", color: "#667eea", cursor: "pointer" }}
        onClick={() => navigate("/dashboard/home")}
      >
        S
      </Box>

      <Tabs
        orientation="vertical"
        value={currentTab}
        onChange={(_, newValue) => navigate(navItems[newValue].path)}
        sx={{
          ".MuiTabs-flexContainer": {
            marginTop:'3rem',
            gap: "1rem",
          },
          ".MuiTabs-indicator": {
            backgroundColor: "#667eea",
            width: "4px",
          },
        }}
      >
        {navItems.map((item, index) => (
          <Tooltip key={index} title={item.label} placement="right">
            <Tab
              icon={
                <Icon
                  icon={item.icon}
                  width="24"
                  color={currentTab === index ? "#667eea" : "rgba(0,0,0,0.6)"}
                />
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
