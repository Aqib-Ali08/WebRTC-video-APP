import { useState } from "react";
import {
  Box,
  CircularProgress,
  TablePagination,
  Typography,
} from "@mui/material";
import ConnectionCard from "../components/ConnectionCard";
import {
  handleActionAdd,
  getCurrentUserId,
  handleListOtherUsers,
} from "../services";
import { useSocket } from "../context/socketContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { showToast } from "../redux/slices/appSlice";

const AddNewConnection = () => {
  const socket = useSocket();
  const queryClient = useQueryClient();

  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loadingAction, setLoadingAction] = useState({
    id: null,
    type: null,
  });

  const { data, isPending, isError } = useQuery({
    queryKey: ["allUsers", page, rowsPerPage],
    queryFn: () => handleListOtherUsers(page + 1, rowsPerPage),
  });

  console.log("data", data?.data);

  const handleAddFriend = async (userId, fullName, actionType) => {
    try {
      setLoadingAction({ id: userId, type: actionType });
      if (actionType === "add" && socket) {
        const res = await handleActionAdd(userId);
        if (res) {
          socket.emit("friend:requestSent", {
            toUserId: userId,
            fromUserId: getCurrentUserId(),
          });
        }
        dispatch(showToast(`You have sent request to ${fullName}!`, "success"));
      }
      queryClient.invalidateQueries(["allUsers"]);
    } catch (error) {
      console.error(`Failed to ${actionType} request:`, error);
    } finally {
      setLoadingAction({ id: null, type: null });
    }
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isPending) {
    return (
      <Box sx={{ textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ textAlign: "center" }}>
        <Typography sx={{ fontWeight: "bold" }}>
          {"Oops! No Data(s) Found!" || error.message}
        </Typography>
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
      {data?.data?.map((user) => (
        <ConnectionCard
          key={user._id}
          id={user._id}
          name={user.full_name}
          image={user.profilePic}
          loadingAdd={
            loadingAction.id === user._id && loadingAction.type === "add"
          }
          type="add"
          onAction={(id, actionType) =>
            handleAddFriend(id, user.full_name, actionType)
          }
          sentRequest={user.sentRequest}
        />
      ))}
      <TablePagination
        component="div"
        count={data?.totalUsers || 0}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default AddNewConnection;
