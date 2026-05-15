import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  user,
  authLoading,
  allowedRoles,
  children,
}) {
  if (authLoading) {
    return (
      <div style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const roleId = Number(user.role_id);

  if (!allowedRoles.includes(roleId)) {
    return <Navigate to="/tools" replace />;
  }

  return children;
}