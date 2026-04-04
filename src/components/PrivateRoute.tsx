import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "@/lib/auth";

const PrivateRoute = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  return <Outlet />;
};

export default PrivateRoute;
