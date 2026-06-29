import { Navigate } from "react-router-dom";
import PageSkeleton from "./PageSkeleton";
import { useAuth } from "../context/AuthContext";

function AdminRoute({ children }) {
    const { isAuthenticated, loadingUser, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (loadingUser || !user) {
        return <PageSkeleton />;
    }

    if (user.role !== "ADMIN") {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

export default AdminRoute;
