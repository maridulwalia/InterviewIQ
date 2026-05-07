import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");
  const isValid = token && token !== "undefined" && token !== "null";

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
