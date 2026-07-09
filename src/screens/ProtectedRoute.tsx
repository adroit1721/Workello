import { Navigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";

interface Props {
	children: React.ReactNode;
	allowedRole?: "admin" | "user";
}

export default function ProtectedRoute({ children, allowedRole }: Props) {
	const { isAuthenticated, user } = useAuthStore();

	if (!isAuthenticated || !user) {
		return <Navigate to="/" replace />;
	}

	if (allowedRole && user.role !== allowedRole) {
		// Unauthorized role redirection
		if (user.role === "admin") {
			return <Navigate to="/admin" replace />;
		}
		return <Navigate to="/board" replace />;
	}

	return <>{children}</>;
}
