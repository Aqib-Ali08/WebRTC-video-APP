import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import ConnectionCard from "../components/ConnectionCard";
import {
  handleGetUsers,
  handleActionBlock,
} from "../services";

const ConnectionManagement = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const res = await handleGetUsers();
      if (res) {
        setConnections(res.data.connectionManagement);
      }
    } catch (error) {
      console.error("Failed to fetch connections:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageAction = async (userId, actionType) => {
    try {
      if (actionType === "delete") {
        // await handleActionCancel(userId);
      } else if (actionType === "block") {
        await handleActionBlock(userId);
      }
      fetchConnections();
    } catch (error) {
      console.error(`Failed to perform ${actionType}:`, error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (connections.length === 0) {
    return (
      <Box mt={3} textAlign="center">
        <Typography>No current connections found.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        alignItems: "center",
      }}
    >
      {connections.map((user) => (
        <ConnectionCard
          key={user._id}
          id={user._id}
          name={user.full_name}
          image={user.profilePic}
          type="manage" 
          onAction={(id, actionType) => handleManageAction(id, actionType)}
        />
      ))}
    </Box>
  );
};

export default ConnectionManagement;
