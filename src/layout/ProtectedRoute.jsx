import { Outlet, Navigate } from "react-router-dom";

export const getAuthData = () => {
  const authData =
    localStorage.getItem("authData") || sessionStorage.getItem("authData");
  if (!authData) return { token: null, expiresAt: null };

  try {
    const parsed = JSON.parse(authData);
    console.log(parsed);
    console.log(new Date().getTime());
    return {
      token: parsed.token || null,
      expiresAt: parsed.expiresAt || null,
    };
  } catch {
    return { token: null, expiresAt: null };
  }
};

const ProtectedRoute = () => {
  const { token, expiresAt } = getAuthData();

  const isTokenValid = token && expiresAt && new Date().getTime() < expiresAt;
  console.log(isTokenValid);
  return isTokenValid ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
