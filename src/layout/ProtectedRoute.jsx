import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuthData } from "../redux/slices/authSlice";

const ProtectedRoute = () => {
  const { token, expiresAt } = useSelector(selectAuthData);
  const isTokenValid = token && expiresAt && new Date().getTime() < expiresAt;
  return isTokenValid ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
