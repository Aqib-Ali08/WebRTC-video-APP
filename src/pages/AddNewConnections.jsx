import { useEffect, useMemo, useState } from "react";
import { Box, CircularProgress, TablePagination } from "@mui/material";
import ConnectionCard from "../components/ConnectionCard";
import { handleGetUsers, handleActionAdd, getCurrentUserId } from "../services";
import { useSocket } from "../context/socketContext";

const AddNewConnection = () => {
  // const socket = useMemo(() => {
  //   getSocket();
  // }, []);
  const socket = useSocket();
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await handleGetUsers();
      if (res) {
        setUsersData(res.data.addNewConnection);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async (userId) => {
    try {
      const response = await handleActionAdd(userId);
      if (response) {
        // Emit socket event
        if (typeof socket !== "undefined") {
          socket.emit("friend:requestSent", {
            toUserId: userId,
            fromUserId: getCurrentUserId(),
            message: "You have a new friend request!",
          });
        }
      }
    } catch (error) {
      console.error("Add friend failed:", error);
    }
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={3}>
        <CircularProgress />
      </Box>
    );
  }

  const paginatedUsers = usersData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        alignItems: "center",
      }}
    >
      {paginatedUsers.map((user) => (
        <ConnectionCard
          key={user._id}
          id={user._id}
          name={user.full_name}
          image={user.profilePic}
          type="add"
          onAction={(id, actionType) => {
            if (actionType === "add") handleAddFriend(id);
          }}
        />
      ))}
      <TablePagination
        component="div"
        count={usersData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default AddNewConnection;
