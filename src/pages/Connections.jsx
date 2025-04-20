import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import ConnectionCard from "../components/ConnectionCard";

const dummyUsers = [
  { id: 1, name: "Alice Sharma", image: "", type: "request" },
  { id: 2, name: "Bob Kumar", image: "", type: "request" },
  { id: 3, name: "Charlie Das", image: "", type: "add" },
  { id: 4, name: "David Roy", image: "", type: "add" },
  { id: 5, name: "Eva Bose", image: "", type: "manage" },
  { id: 6, name: "Fahim", image: "", type: "manage" },
];

export default function Connections() {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const tabKey = ["request", "add", "manage"][tabValue];

  const filteredUsers = dummyUsers.filter(
    (user) =>
      user.type === tabKey &&
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                fontWeight:"bold",
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

        {/* Content Area */}
        <Paper
          elevation={2}
          sx={{
            backgroundColor: "#fff",
            borderRadius: 2,
            p: 3,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
            height:"95%"
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
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <ConnectionCard
                  key={user.id}
                  name={user.name}
                  image={user.image}
                  type={user.type}
                />
              ))
            ) : (
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mt: 2 }}
              >
                No users found
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
