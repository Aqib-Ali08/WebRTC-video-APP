// hooks/useFriendActions.js
import { useState } from "react";
import { useSocket } from "../context/socketContext";
import { useDispatch } from "react-redux";
import { showToast } from "../redux/slices/appSlice";
import { useQueryClient } from "@tanstack/react-query";
import {
  handleActionAdd,
  getCurrentUserId,
  handleActionAccept,
  handleActionCancel,
  handleActionBlock,
  handleActionDisconnectFriend,
} from "../services";

export default function useFriendActions() {
  const socket = useSocket();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [loadingAction, setLoadingAction] = useState({
    id: null,
    type: null,
  });

  const addFriend = async (userId, fullName) => {
    try {
      setLoadingAction({ id: userId, type: "add" });
      const res = await handleActionAdd(userId);
      if (res && socket) {
        socket.emit("friend:requestSent", {
          toUserId: userId,
          fromUserId: getCurrentUserId(),
        });
        dispatch(showToast(`You have sent request to ${fullName}!`, "success"));
      }
      queryClient.invalidateQueries();
    } catch (err) {
      console.error("Add friend failed:", err);
    } finally {
      setLoadingAction({ id: null, type: null });
    }
  };

  const acceptFriend = async (userId, fullName) => {
    try {
      setLoadingAction({ id: userId, type: "accept" });
      const res = await handleActionAccept(userId);
      if (res && socket) {
        socket.emit("friend:requestAccepted", {
          toUserId: userId,
          fromUserId: getCurrentUserId(),
        });
        dispatch(
          showToast(`You have accepted request from ${fullName}!`, "success")
        );
      }
      queryClient.invalidateQueries();
    } catch (err) {
      console.error("Accept friend failed:", err);
    } finally {
      setLoadingAction({ id: null, type: null });
    }
  };

  const rejectFriend = async (userId, fullName) => {
    try {
      setLoadingAction({ id: userId, type: "reject" });
      await handleActionCancel(userId);
      dispatch(
        showToast(`You have rejected request from ${fullName}!`, "success")
      );
      queryClient.invalidateQueries();
    } catch (err) {
      console.error("Reject friend failed:", err);
    } finally {
      setLoadingAction({ id: null, type: null });
    }
  };

  const removeFriend = async (userId, fullName) => {
    try {
      setLoadingAction({ id: userId, type: "remove" });
      await handleActionDisconnectFriend(userId);
      dispatch(showToast(`You have removed ${fullName}!`, "success"));
      queryClient.invalidateQueries();
    } catch (err) {
      console.error("Remove friend failed:", err);
    } finally {
      setLoadingAction({ id: null, type: null });
    }
  };

  const blockFriend = async (userId, fullName, debouncedQuery) => {
    try {
      setLoadingAction({ id: userId, type: "BLOCK" });
      await handleActionBlock(userId, "BLOCK");
      dispatch(showToast(`${fullName} is blocked successfully!`, "success"));
      queryClient.invalidateQueries({ queryKey: ["connection"] });
      queryClient.invalidateQueries(["searchResults", debouncedQuery]);
    } catch (err) {
      console.error("Block friend failed:", err);
    } finally {
      setLoadingAction({ id: null, type: null });
    }
  };

  const unblockFriend = async (userId, fullName, debouncedQuery) => {
    try {
      setLoadingAction({ id: userId, type: "UNBLOCK" });
      await handleActionBlock(userId, "UNBLOCK");
      dispatch(showToast(`${fullName} is unblocked successfully!`, "success"));
      queryClient.invalidateQueries({ queryKey: ["connection"] });
      queryClient.invalidateQueries(["searchResults", debouncedQuery]);
    } catch (err) {
      console.error("Unblock friend failed!");
    } finally {
      setLoadingAction({ id: null, type: null });
    }
  };

  return {
    loadingAction,
    addFriend,
    acceptFriend,
    rejectFriend,
    removeFriend,
    blockFriend,
    unblockFriend,
  };
}
