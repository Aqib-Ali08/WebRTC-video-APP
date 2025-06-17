import React, { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import ConnectionCard from "../components/ConnectionCard";
import { handleActionAccept, handleActionAdd, handleActionBlock, handleActionCancel, handleGetUsers } from "../services";
import Loader from "../components/Loader";

function TabPanel({ children, value, index }) {
  return (
    <div style={{ height: "89%" }} hidden={value !== index} role="tabpanel">
      {value === index && (
        <Paper
          elevation={2}
          sx={{
            backgroundColor: "#fff",
            borderRadius: 2,
            p: 3,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
            height: "95%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2.5,
            }}
          >
            {children}
          </Box>
        </Paper>
      )}
    </div>
  );
}

export default function Connections() {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [usersData, setUsersData] = useState([]); // add new connection
  const [requestedUser, setRequestedUser] = useState([]);
  const [blockedUser, setBlockedUser] = useState([]);
  const [sentRequestedUser, setSentRequestedUser] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loader, setLoader] = useState(false);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    async function getUser() {
      try {
        setLoader(true);
        const res = await handleGetUsers();
        if (res) {
          setUsersData(res.data.addNewConnection);
          setSentRequestedUser(res.data.sentRequests);
          setRequestedUser(res.data.receivedRequests);
          setFriends(res.data.connectionManagement);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoader(false);
      }
    }

    getUser();
  }, []);
  const handleAction = async (ID, actionType) => {
    console.log("payloadID",ID)
    try {
      switch (actionType) {
        case "accept":
          await handleActionAccept(ID)
          break;

        case "delete":
          await handleActionCancel(ID)
          break;

        case "add":
          await handleActionAdd(ID);
          break;

        case "block":
          await handleActionBlock(ID)
          break;

        case "unblock":
          console.log("Unblocking...");
          break;

        default:
          console.log("Unknown action");
      }
    } catch (error) {
      console.error("An error occurred while handling the action:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100%", bgcolor: "#f5f7fa" }}>
      <Box sx={{ flexGrow: 1, p: 4 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 4,
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            sx={{
              "& .MuiTab-root": {
                textTransform: "capitalize",
                fontWeight: "bold",
                fontSize: "16px",
              },
            }}
          >
            <Tab label="Add New Connection" />
            <Tab label="New Request" />
            <Tab label="Connection Management" />
          </Tabs>

          <TextField
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search connection"
            size="small"
            sx={{
              ml: "auto",
              maxWidth: 350,
              backgroundColor: "#fff",
              borderRadius: 3,
              boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSearchQuery("")}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Tab Panels */}
        {/* Add new Connection */}
        <TabPanel value={tabValue} index={0}>
          {loader ? (
            <Box
              sx={{
                mt: "8rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Loader />
            </Box>
          ) : (
            usersData.map((user) => (
              <ConnectionCard
                key={user._id}
                id={user._id}
                name={user.full_name}
                image={user.profilePic}
                type="add"
                onAction={handleAction}
              />
            ))
          )}
        </TabPanel>
        {/* New Request */}

        <TabPanel value={tabValue} index={1}>
          {loader ? (
            <Box
              sx={{
                mt: "8rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Loader />
            </Box>
          ) : (
            requestedUser.map((user) => (
              <ConnectionCard
                key={user._id}
                id={user._id}
                name={user.full_name}
                image={user.profilePic}
                type="request"
                onAction={handleAction}
              />
            ))
          )}
        </TabPanel>
        {/* Connection Management */}
        <TabPanel value={tabValue} index={2}>
          {/* Content for Connection Management */}
          {loader ? (
            <Box
              sx={{
                mt: "8rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Loader />
            </Box>
          ) : (
            friends.map((user) => (
              <ConnectionCard
                key={user._id}
                id={user._id}
                name={user.full_name}
                image={user.profilePic}
                type="manage"
                onAction={handleAction}
              />
            ))
          )}
        </TabPanel>
      </Box>
    </Box>
  );
}
