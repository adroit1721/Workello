import { Routes, Route } from "react-router";
import WelcomePage from "./screens/WelcomePage";
import LoginPage from "./screens/LoginPage";
import Workspace from "./screens/workSpace";
import ProtectedRoute from "./screens/ProtectedRoute";
import AdminPanel from "./screens/admin/AdminPanel";
import "./output.css";

export default function App() {
	return (
		<Routes>
			<Route path="/" element={<WelcomePage />} />
			<Route path="/login/admin" element={<LoginPage role="admin" />} />
			<Route path="/login/user" element={<LoginPage role="user" />} />
			
			<Route
				path="/admin"
				element={
					<ProtectedRoute allowedRole="admin">
						<AdminPanel />
					</ProtectedRoute>
				}
			/>
			
			<Route
				path="/board"
				element={
					<ProtectedRoute allowedRole="user">
						<Workspace />
					</ProtectedRoute>
				}
			/>
		</Routes>
	);
}