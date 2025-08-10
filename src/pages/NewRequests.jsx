import { useState } from "react";
import {
  Box,
  CircularProgress,
  TablePagination,
  Typography,
} from "@mui/material";
import ConnectionCard from "../components/ConnectionCard";
import {
  getCurrentUserId,
  handleActionAccept,
  handleActionCancel,
  handleListReceivedRequests,
} from "../services";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../context/socketContext";
import { useDispatch } from "react-redux";
import { showToast } from "../redux/slices/appSlice";

const NewRequests = () => {
  const queryClient = useQueryClient();
  const socket = useSocket();

  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loadingAction, setLoadingAction] = useState({ id: null, type: null });

  const { data, isPending, isError } = useQuery({
    queryKey: ["newRequests", page, rowsPerPage],
    queryFn: () => handleListReceivedRequests(page + 1, rowsPerPage),
  });

  console.log("New Requests", data?.data);

  const handleRequestAction = async (userId, fullName, actionType) => {
    try {
      setLoadingAction({ id: userId, type: actionType });
      if (actionType === "accept" && socket) {
        const res = await handleActionAccept(userId);
        if (res) {
          socket.emit("friend:requestAccepted", {
            toUserId: userId,
            fromUserId: getCurrentUserId(),
          });
        }
        dispatch(
          showToast(
            `You have accepted request from ${fullName}!`,
            "success"
          )
        );
      } else if (actionType === "reject") {
        await handleActionCancel(userId);
        dispatch(
          showToast(
            `You have rejected request from ${fullName}!`,
            "success"
          )
        );
      }
      queryClient.invalidateQueries(["newRequests"]);
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

  if (data?.data?.length === 0) {
    return (
      <Box mt={3} textAlign="center">
        <Typography>No new request(s).</Typography>
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
      {data?.data.map((user) => (
        <ConnectionCard
          key={user._id}
          id={user._id}
          name={user.full_name}
          loadingAccept={
            loadingAction.id === user._id && loadingAction.type === "accept"
          }
          loadingDelete={
            loadingAction.id === user._id && loadingAction.type === "reject"
          }
          image={user.profilePic}
          type="request"
          onAction={(id, actionType) => handleRequestAction(id, user.full_name, actionType)}
        />
      ))}
      <TablePagination
        component="div"
        count={data?.totalRequests || 0}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default NewRequests;
