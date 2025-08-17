// src/components/Sidebar.jsx
import {
  Tabs,
  Tab,
  Tooltip,
  Avatar,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  AddBox,
  CalendarMonth,
  ChatBubble,
  Dashboard,
  PersonAdd,
  Settings,
} from "@mui/icons-material";

const navItems = [
  {
    path: "/dashboard/home",
    label: "Home",
    icon: (
      <Badge
        badgeContent={4}
        color="primary"
        sx={{ marginTop: "0.5rem", marginRight: "0.5rem" }}
      >
        <span style={{ paddingRight: "0.5rem" }}>
          <Dashboard />
        </span>
      </Badge>
    ),
  },
  {
    path: "/dashboard/connections",
    label: "Connections",
    icon: (
      <span style={{ paddingRight: "0.5rem" }}>
        <PersonAdd />
      </span>
    ),
  },
  {
    path: "/dashboard/meetings",
    label: "Meetings",
    icon: (
      <span style={{ paddingRight: "0.5rem" }}>
        <CalendarMonth />
      </span>
    ),
  },
  {
    path: "/dashboard/messages",
    label: "Messages",
    icon: (
      <span style={{ paddingRight: "0.5rem" }}>
        <ChatBubble />
      </span>
    ),
  },
  {
    path: "/dashboard/schedule",
    label: "Schedule",
    icon: (
      <span style={{ paddingRight: "0.5rem" }}>
        <AddBox />
      </span>
    ),
  },
  {
    path: "/dashboard/settings",
    label: "Settings",
    icon: (
      <span style={{ paddingRight: "0.5rem" }}>
        <Settings />
      </span>
    ),
  },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


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
        height: "100vh",
        // height: "auto",
        background: "#f9fafb",
        boxShadow: "2px 0 6px rgba(0,0,0,0.05)",
        padding: "1rem 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflowY: "auto",
      }}
    >
      <Tooltip title={userName.toUpperCase()}>
        <Avatar
          sx={{
            // backgroundColor: "#667eea",
            backgroundColor: "#0e7490",
            cursor: "pointer",
          }}
          onClick={handleClickOpen}
        >
          {firstName}
        </Avatar>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Profile Details</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <TextField
              margin="dense"
              label="Username"
              name="username"
              fullWidth
            />
            <TextField margin="dense" label="Email" name="email" fullWidth />
            <TextField
              margin="dense"
              label="Contact"
              name="contact"
              type="number"
              fullWidth
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" size="small" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleClose}
            autoFocus
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

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
              icon={item.icon}
              sx={{
                minWidth: "auto",
                padding: "8px",
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
