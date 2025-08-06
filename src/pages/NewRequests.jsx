import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import ConnectionCard from "../components/ConnectionCard";
import { handleActionAccept, handleActionCancel, handleGetUsers } from "../services";

const NewRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await handleGetUsers();
      if (res) {
        setRequests(res.data.receivedRequests);
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (userId, actionType) => {
    try {
      if (actionType === "accept") {
        await handleActionAccept(userId);
      } else if (actionType === "delete") {
        await handleActionCancel(userId);
      }
      fetchRequests();
    } catch (error) {
      console.error(`Failed to ${actionType} request:`, error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (requests.length === 0) {
    return (
      <Box mt={3} textAlign="center">
        <Typography>No new requests.</Typography>
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
      {requests.map((user) => (
        <ConnectionCard
          key={user._id}
          id={user._id}
          name={user.full_name}
          image={user.profilePic}
          type="request"
          onAction={(id, actionType) => handleRequestAction(id, actionType)}
        />
      ))}
    </Box>
  );
};

export default NewRequests;
