import { useAdminStore } from "../../store/useAdminStore";
import { useAuthStore } from "../../store/useAuthStore";
import AdminOverview from "./AdminOverview";
import UsersTable from "./UsersTable";
import UserBoardView from "./UserBoardView";
import "./admin.css";

export default function AdminPanel() {
	const { logout, user } = useAuthStore();
	const { adminView, setAdminView, setSelectedUser } = useAdminStore();

	const handleLogout = () => {
		logout();
	};

	const handleViewChange = (view: "overview" | "users" | "boards") => {
		setAdminView(view);
		if (view !== "boards") {
			setSelectedUser(null);
		}
	};

	return (
		<div className="flex h-screen bg-[#0f1117] text-slate-100 overflow-hidden font-sans">
			{/* Admin Sidebar */}
			<aside className="w-64 bg-[#161927] border-r border-white/5 flex flex-col justify-between shrink-0">
				<div>
					{/* Logo brand */}
					<div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
						<span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 font-black text-white text-base">W</span>
						<span className="font-bold text-lg tracking-tight">Workello Admin</span>
					</div>

					{/* Navigation tabs */}
					<nav className="p-4 space-y-1">
						<button
							onClick={() => handleViewChange("overview")}
							className={`flex items-center w-full gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
								adminView === "overview"
									? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10"
									: "text-slate-400 hover:bg-white/5 hover:text-white"
							}`}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="w-5 h-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth="2"
							>
								<rect x="3" y="3" width="7" height="9" rx="1" />
								<rect x="14" y="3" width="7" height="5" rx="1" />
								<rect x="14" y="12" width="7" height="9" rx="1" />
								<rect x="3" y="16" width="7" height="5" rx="1" />
							</svg>
							Overview
						</button>

						<button
							onClick={() => handleViewChange("users")}
							className={`flex items-center w-full gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
								adminView === "users"
									? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10"
									: "text-slate-400 hover:bg-white/5 hover:text-white"
							}`}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="w-5 h-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
								<circle cx="9" cy="7" r="4" />
								<path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75" />
							</svg>
							Manage Users
						</button>

						<button
							onClick={() => handleViewChange("boards")}
							className={`flex items-center w-full gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
								adminView === "boards"
									? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10"
									: "text-slate-400 hover:bg-white/5 hover:text-white"
							}`}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="w-5 h-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth="2"
							>
								<rect x="3" y="3" width="18" height="18" rx="2" />
								<line x1="9" y1="3" x2="9" y2="21" />
								<line x1="15" y1="3" x2="15" y2="21" />
							</svg>
							User Boards
						</button>
					</nav>
				</div>

				{/* User Profile and Logout */}
				<div className="p-4 border-t border-white/5 space-y-3">
					<div className="flex items-center gap-3 px-2">
						<div className="w-9 h-9 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-sm">
							AD
						</div>
						<div className="overflow-hidden">
							<p className="text-sm font-semibold truncate">{user?.name || "Administrator"}</p>
							<p className="text-xs text-slate-500 truncate">{user?.userId || "Admin"}</p>
						</div>
					</div>

					<button
						onClick={handleLogout}
						className="flex items-center w-full gap-3 px-4 py-2.5 text-sm font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="w-5 h-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
						</svg>
						Sign Out
					</button>
				</div>
			</aside>

			{/* Main Workspace content */}
			<main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
				{adminView === "overview" && <AdminOverview />}
				{adminView === "users" && <UsersTable />}
				{adminView === "boards" && <UserBoardView />}
			</main>
		</div>
	);
}
