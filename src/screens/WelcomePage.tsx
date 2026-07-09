import { useAuthStore } from "../store/useAuthStore";
import { Navigate } from "react-router";

export default function WelcomePage() {
	const { isAuthenticated, user } = useAuthStore();

	if (isAuthenticated && user) {
		if (user.role === "admin") {
			return <Navigate to="/admin" replace />;
		}
		return <Navigate to="/board" replace />;
	}

	return (
		<div className="min-h-screen bg-[#0f1117] flex flex-col justify-center items-center px-4 relative overflow-hidden">
			{/* Decorative background grid and gradients */}
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.08),transparent_50%)]" />
			<div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-indigo-500/20 to-transparent" />

			<div className="w-full max-w-md text-center z-10">
				{/* Logo */}
				<div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 shadow-[0_0_50px_rgba(99,102,241,0.15)] mb-8">
					<span className="text-4xl font-black text-indigo-400 select-none">W</span>
				</div>

				<h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl mb-3">
					Welcome to <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400">Workello</span>
				</h1>
				<p className="text-base text-slate-400 mb-10 max-w-sm mx-auto leading-relaxed">
					A collaborative Kanban + Canvas workspace. Organize tasks, track progress, and manage users.
				</p>

				<div className="flex flex-col gap-4">
					<a
						href="/login/admin"
						className="flex items-center justify-center w-full px-6 py-3.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 cursor-pointer"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="w-4 h-4 mr-2"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
							<path d="M7 11V7a5 5 0 0 1 10 0v4" />
						</svg>
						Log in as Admin
					</a>

					<a
						href="/login/user"
						className="flex items-center justify-center w-full px-6 py-3.5 text-sm font-semibold text-slate-300 hover:text-white bg-[#1a1d2d] hover:bg-[#22263a] border border-white/5 hover:border-white/10 active:bg-[#161825] rounded-xl transition-all duration-200 cursor-pointer"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="w-4 h-4 mr-2 text-indigo-400"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
							<circle cx="12" cy="7" r="4" />
						</svg>
						Log in as User
					</a>
				</div>
			</div>
		</div>
	);
}
