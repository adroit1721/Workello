import { useAdminStore } from "../../store/useAdminStore";
import { useBoardStore } from "../../store/useBoardStore";

export default function AdminOverview() {
	const { users, setAdminView, setSelectedUser } = useAdminStore();
	const { boards } = useBoardStore();

	const totalUsers = users.filter((u) => u.role !== "admin").length;

	let totalCards = 0;
	let totalTasks = 0;
	let completedTasks = 0;

	// Calculate counts across all boards
	Object.values(boards).forEach((board) => {
		const cards = Object.values(board.cards);
		totalCards += cards.length;
		cards.forEach((card) => {
			totalTasks += card.tasks.length;
			completedTasks += card.tasks.filter((t) => t.isCompleted).length;
		});
	});

	const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

	const handleViewBoard = (userId: string) => {
		setSelectedUser(userId);
		setAdminView("boards");
	};

	return (
		<div className="p-8 max-w-7xl mx-auto w-full space-y-8">
			<div>
				<h1 className="text-3xl font-extrabold tracking-tight text-white">Dashboard Overview</h1>
				<p className="mt-1 text-sm text-slate-400">High-level statistics and workspace overview.</p>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				{/* Users */}
				<div className="bg-[#161927] border border-white/5 p-6 rounded-2xl relative overflow-hidden">
					<div className="absolute top-0 left-0 w-full h-[3px] bg-indigo-500" />
					<h3 className="text-sm font-semibold text-slate-400">Total Users</h3>
					<p className="text-4xl font-extrabold text-white mt-2">{totalUsers}</p>
					<p className="text-xs text-slate-500 mt-2">Active accounts (excluding Admin)</p>
				</div>

				{/* Cards */}
				<div className="bg-[#161927] border border-white/5 p-6 rounded-2xl relative overflow-hidden">
					<div className="absolute top-0 left-0 w-full h-[3px] bg-teal-500" />
					<h3 className="text-sm font-semibold text-slate-400">Total Cards</h3>
					<p className="text-4xl font-extrabold text-white mt-2">{totalCards}</p>
					<p className="text-xs text-slate-500 mt-2">Task cards across all boards</p>
				</div>

				{/* Tasks */}
				<div className="bg-[#161927] border border-white/5 p-6 rounded-2xl relative overflow-hidden">
					<div className="absolute top-0 left-0 w-full h-[3px] bg-purple-500" />
					<h3 className="text-sm font-semibold text-slate-400">Total Tasks</h3>
					<p className="text-4xl font-extrabold text-white mt-2">{totalTasks}</p>
					<p className="text-xs text-slate-500 mt-2">Subtasks created inside cards</p>
				</div>

				{/* Completion Rate */}
				<div className="bg-[#161927] border border-white/5 p-6 rounded-2xl relative overflow-hidden">
					<div className="absolute top-0 left-0 w-full h-[3px] bg-emerald-500" />
					<h3 className="text-sm font-semibold text-slate-400">Completion Rate</h3>
					<p className="text-4xl font-extrabold text-white mt-2">{completionRate}%</p>
					<div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
						<div className="bg-emerald-500 h-full rounded-full" style={{ width: `${completionRate}%` }} />
					</div>
				</div>
			</div>

			{/* User Board Quick list */}
			<div className="bg-[#161927] border border-white/5 rounded-2xl overflow-hidden">
				<div className="px-6 py-5 border-b border-white/5">
					<h3 className="font-bold text-white text-base">Users Progress Dashboard</h3>
				</div>
				<div className="divide-y divide-white/5">
					{users
						.filter((u) => u.role !== "admin")
						.map((userObj) => {
							const board = boards[userObj.userId] || { cards: {}, lists: [] };
							const cards = Object.values(board.cards);
							const cardCount = cards.length;
							let userTasks = 0;
							let userCompleted = 0;

							cards.forEach((c) => {
								userTasks += c.tasks.length;
								userCompleted += c.tasks.filter((t) => t.isCompleted).length;
							});

							const userRate = userTasks > 0 ? Math.round((userCompleted / userTasks) * 100) : 0;

							return (
								<div key={userObj.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.01] transition-colors">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
											{userObj.name.charAt(0)}
										</div>
										<div>
											<h4 className="font-semibold text-white">{userObj.name}</h4>
											<p className="text-xs text-slate-400">User ID: {userObj.userId}</p>
										</div>
									</div>

									<div className="flex items-center gap-8">
										<div className="text-right">
											<p className="text-xs text-slate-400 font-medium">Task Completion</p>
											<p className="text-sm font-semibold text-white mt-0.5">{userCompleted}/{userTasks} tasks ({userRate}%)</p>
										</div>
										<div className="text-right">
											<p className="text-xs text-slate-400 font-medium">Board Cards</p>
											<p className="text-sm font-semibold text-white mt-0.5">{cardCount} cards</p>
										</div>
										<button
											onClick={() => handleViewBoard(userObj.userId)}
											className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
										>
											View Board
										</button>
									</div>
								</div>
							);
						})}

					{users.filter((u) => u.role !== "admin").length === 0 && (
						<div className="p-8 text-center text-slate-500 text-sm">
							No users registered yet. Head to "Manage Users" to add some.
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
