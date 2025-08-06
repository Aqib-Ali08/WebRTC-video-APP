import { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import AddNewConnection from "./AddNewConnections";
import NewRequests from "./NewRequests";
import ConnectionManagement from "./ConnectionManagement";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from '@mui/icons-material/Clear';

function TabPanel({ children, value, index }) {
  return (
    value === index && (
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mt: 2,
          borderRadius: 2,
          backgroundColor: "#fff",
        }}
      >
        <Typography>{children}</Typography>
      </Paper>
    )
  );
}

export default function Connections() {
  const [tabIndex, setTabIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Box
      sx={{
        p: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Tabs */}
        <Tabs
          value={tabIndex}
          onChange={(e, newIndex) => setTabIndex(newIndex)}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            "& .MuiTab-root": {
              textTransform: "capitalize", // apply capitalize to all tabs
              fontWeight: "bold",
            },
          }}
        >
          <Tab label="Add New Connections" />
          <Tab label="New Requests" />
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

      {/* Tab Contents */}
      <TabPanel value={tabIndex} index={0}>
        <AddNewConnection />
      </TabPanel>

      <TabPanel value={tabIndex} index={1}>
        <NewRequests />
      </TabPanel>

      <TabPanel value={tabIndex} index={2}>
        <ConnectionManagement />
      </TabPanel>
    </Box>
  );
}
