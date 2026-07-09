import { useState } from "react";
import { useNavigate, Navigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";

interface Props {
	role: "admin" | "user";
}

export default function LoginPage({ role }: Props) {
	const navigate = useNavigate();
	const { login, isAuthenticated, user } = useAuthStore();
	const [userId, setUserId] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	if (isAuthenticated && user) {
		if (user.role === "admin") {
			return <Navigate to="/admin" replace />;
		}
		return <Navigate to="/board" replace />;
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!userId.trim() || !password.trim()) {
			setError("Please enter both User ID and password.");
			return;
		}

		const result = login(userId.trim(), password);

		if (result.success) {
			if (result.role === "admin") {
				navigate("/admin");
			} else {
				navigate("/board");
			}
		} else {
			setError(result.error || "Authentication failed.");
		}
	};

	return (
		<div className="min-h-screen bg-[#0f1117] flex flex-col justify-center items-center px-4 relative overflow-hidden">
			{/* Background details */}
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.05),transparent_50%)]" />

			<div className="w-full max-w-md z-10">
				<div className="text-center mb-8">
					<a href="/" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-6 transition-colors text-sm">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="w-4 h-4"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<line x1="19" y1="12" x2="5" y2="12" />
							<polyline points="12 19 5 12 12 5" />
						</svg>
						Back to main page
					</a>
					<h2 className="text-3xl font-extrabold text-white tracking-tight">
						{role === "admin" ? "Admin Portal" : "User Workspace"}
					</h2>
					<p className="mt-2 text-sm text-slate-400">
						Please enter your credentials below to log in.
					</p>
				</div>

				<div className="bg-[#161927] border border-white/5 rounded-2xl p-8 shadow-xl backdrop-blur-md">
					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label htmlFor="userId" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
								User ID
							</label>
							<input
								id="userId"
								type="text"
								placeholder={role === "admin" ? "e.g., Admin" : "e.g., Alice"}
								value={userId}
								onChange={(e) => setUserId(e.target.value)}
								className="w-full px-4 py-3 bg-[#0f111a] border border-white/10 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
								autoComplete="username"
							/>
						</div>

						<div>
							<label htmlFor="password" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
								Password
							</label>
							<input
								id="password"
								type="password"
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full px-4 py-3 bg-[#0f111a] border border-white/10 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
								autoComplete="current-password"
							/>
						</div>

						{error && (
							<div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 leading-relaxed">
								{error}
							</div>
						)}

						<button
							type="submit"
							className="w-full py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-xl transition-all duration-200 shadow-md shadow-indigo-600/10"
						>
							Log In
						</button>
					</form>
				</div>

			</div>
		</div>
	);
}
