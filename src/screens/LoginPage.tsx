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
	const [showPassword, setShowPassword] = useState(false);
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
							<div className="relative">
								<input
									id="password"
									type={showPassword ? "text" : "password"}
									placeholder="••••••••"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="w-full px-4 py-3 pr-12 bg-[#0f111a] border border-white/10 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
									autoComplete="current-password"
								/>
								<button
									type="button"
									onClick={() => setShowPassword((v) => !v)}
									className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
									tabIndex={-1}
									aria-label={showPassword ? "Hide password" : "Show password"}
								>
									{showPassword ? (
										<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
											<path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
										</svg>
									) : (
										<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
											<path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
											<path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
										</svg>
									)}
								</button>
							</div>
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
