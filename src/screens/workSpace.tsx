import { useAuthStore } from "../store/useAuthStore";
import Board from "./board_components/Board";
import Navbar from "./board_components/Navbar";

export default function Workspace() {
	const { user } = useAuthStore();
	const boardTitle = user ? `${user.name}'s Workspace` : "My Workspace";
	const boardDesc = "Manage your tasks and optimize your workflow.";

	return (
		<div className="min-h-screen bg-[#0f1117]">
			<Navbar />

			{/* Header */}
			<div className="text-center pt-10 pb-2">
				<h2 className="text-3xl font-bold text-white tracking-tight">
					{boardTitle}
				</h2>
				<p className="mt-1 text-sm text-slate-400">{boardDesc}</p>
			</div>

			<Board />
		</div>
	);
}
