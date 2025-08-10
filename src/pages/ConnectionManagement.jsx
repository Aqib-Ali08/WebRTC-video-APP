import { useState } from "react";
import {
  Box,
  CircularProgress,
  TablePagination,
  Typography,
} from "@mui/material";
import ConnectionCard from "../components/ConnectionCard";
import {
  handleActionBlock,
  handleActionDisconnectFriend,
  handleListConnectedUsers,
} from "../services";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { showToast } from "../redux/slices/appSlice";

const ConnectionManagement = () => {
  const queryClient = useQueryClient();

  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loadingAction, setLoadingAction] = useState({
    id: null,
    type: null,
  });

  const { data, isPending, isError } = useQuery({
    queryKey: ["connection", page, rowsPerPage],
    queryFn: () => handleListConnectedUsers(page + 1, rowsPerPage),
  });

  console.log("Connection Management", data?.data);

  const handleManageAction = async (userId, fullName, actionType) => {
    setLoadingAction({ id: userId, type: actionType });
    try {
      if (actionType === "remove") {
        await handleActionDisconnectFriend(userId);
        dispatch(showToast(`${fullName} is removed successfully!`, "success"));
      } else if (actionType === "BLOCK" || actionType === "UNBLOCK") {
        await handleActionBlock(userId, actionType);
        dispatch(
          showToast(
            actionType === "BLOCK"
              ? `${fullName} is blocked successfully!`
              : `${fullName} is unblocked successfully!`
          ),
          "success"
        );
      }
      queryClient.invalidateQueries(["connection"]);
    } catch (error) {
      console.error(`Failed to perform ${actionType}:`, error);
    } finally {
      setLoadingAction({ id: null, actionType: null });
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
        <Typography>No Connection(s) found!!</Typography>
      </Box>
    );
  }

  if (data?.data?.connectionManagement?.length === 0) {
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
      {data?.data?.map((user) => (
        <ConnectionCard
          key={user._id}
          id={user._id}
          name={user.full_name}
          image={user.profilePic}
          loadingBlock={
            loadingAction.id === user._id &&
            (loadingAction.type === "BLOCK" || loadingAction.type === "UNBLOCK")
          }
          loadingDisconnect={
            loadingAction.id === user._id && loadingAction.type === "remove"
          }
          type="manage"
          onAction={(id, actionType) =>
            handleManageAction(id, user.full_name, actionType)
          }
          isBlocked={user.isBlocked}
        />
      ))}
      <TablePagination
        component="div"
        count={data?.totalConnections || 0}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default ConnectionManagement;
