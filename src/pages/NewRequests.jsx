import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  TablePagination,
  Typography,
} from "@mui/material";
import ConnectionCard from "../components/ConnectionCard";
import { handleListReceivedRequests } from "../services";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import useFriendActions from "../hooks/useFriendActions";

const NewRequests = ({ setNewRequestsCount }) => {
  // const queryClient = useQueryClient();
  // const socket = useSocket();

  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // const [loadingAction, setLoadingAction] = useState({ id: null, type: null });

  const { data, isPending, isError } = useQuery({
    queryKey: ["newRequestsData", page, rowsPerPage],
    queryFn: () => handleListReceivedRequests(page + 1, rowsPerPage),
  });

  useEffect(() => {
    if (data?.totalRequests !== undefined) {
      setNewRequestsCount(data?.totalRequests);
    }
  }, [data, setNewRequestsCount]);

  console.log("New Requests", data?.data);

  const { loadingAction, acceptFriend, rejectFriend } = useFriendActions();

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
          // onAction={(id, actionType) =>
          //   handleRequestAction(id, user.full_name, actionType)
          // }
          onAction={(id, actionType) => {
            if (actionType === "accept") {
              acceptFriend(id, user.full_name);
            } else if (actionType === "reject") {
              rejectFriend(id, user.full_name);
            }
          }}
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
