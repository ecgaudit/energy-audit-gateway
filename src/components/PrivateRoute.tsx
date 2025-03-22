import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface PrivateRouteProps {
  children: React.ReactNode;
  requireManager?: boolean;
}

export default function PrivateRoute({ children, requireManager = false }: PrivateRouteProps) {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="text-lg font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requireManager && userRole !== 'manager') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
