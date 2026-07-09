import { useState } from "react";
import { useAdminStore } from "../../store/useAdminStore";
import { useBoardStore } from "../../store/useBoardStore";
import type { User } from "../../types/auth.types";

export default function UsersTable() {
	const { users, addUser, updateUser, deleteUser, setSelectedUser, setAdminView } = useAdminStore();
	const { initUserBoard, boards } = useBoardStore();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingUser, setEditingUser] = useState<User | null>(null);

	const [name, setName] = useState("");
	const [userIdInput, setUserIdInput] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const openAddModal = () => {
		setEditingUser(null);
		setName("");
		setUserIdInput("");
		setPassword("");
		setError("");
		setIsModalOpen(true);
	};

	const openEditModal = (user: User) => {
		setEditingUser(user);
		setName(user.name);
		setUserIdInput(user.userId);
		setPassword(user.password || "");
		setError("");
		setIsModalOpen(true);
	};

	const handleSave = (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!name.trim() || !userIdInput.trim() || !password.trim()) {
			setError("All fields are required.");
			return;
		}

		if (editingUser) {
			updateUser(editingUser.id, { name: name.trim(), password });
			setIsModalOpen(false);
		} else {
			// Check if UserID is already taken (case-insensitive)
			const isTaken = users.some(
				(u) => u.userId.toLowerCase() === userIdInput.trim().toLowerCase(),
			);

			if (isTaken || userIdInput.trim().toLowerCase() === "admin") {
				setError("User ID is already taken.");
				return;
			}

			addUser({
				name: name.trim(),
				userId: userIdInput.trim(),
				password: password.trim(),
				role: "user",
			});

			initUserBoard(userIdInput.trim());
			setIsModalOpen(false);
		}
	};

	const handleDelete = (id: string, name: string) => {
		if (window.confirm(`Are you sure you want to delete ${name}? All board data will be lost.`)) {
			deleteUser(id);
		}
	};

	const handleViewBoard = (userId: string) => {
		setSelectedUser(userId);
		setAdminView("boards");
	};

	const displayUsers = users.filter((u) => u.role !== "admin");

	return (
		<div className="p-8 max-w-7xl mx-auto w-full space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-extrabold tracking-tight text-white">Manage Users</h1>
					<p className="mt-1 text-sm text-slate-400">Add, edit, or remove user accounts and credentials.</p>
				</div>
				<button
					onClick={openAddModal}
					className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-sm font-semibold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/10"
				>
					<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
						<path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
					</svg>
					Add User
				</button>
			</div>

			<div className="bg-[#161927] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
				<table className="w-full text-left border-collapse">
					<thead>
						<tr className="border-b border-white/5 bg-white/[0.02]">
							<th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">User ID</th>
							<th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</th>
							<th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</th>
							<th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Cards</th>
							<th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Tasks Completed</th>
							<th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-white/5 text-slate-300">
						{displayUsers.map((userObj) => {
							const board = boards[userObj.userId] || { cards: {}, lists: [] };
							const cardsCount = Object.keys(board.cards).length;
							let totalT = 0;
							let compT = 0;
							Object.values(board.cards).forEach((c) => {
								totalT += c.tasks.length;
								compT += c.tasks.filter((t) => t.isCompleted).length;
							});

							return (
								<tr key={userObj.id} className="hover:bg-white/[0.01] transition-colors">
									<td className="px-6 py-4 text-sm font-mono text-indigo-400 font-semibold">{userObj.userId}</td>
									<td className="px-6 py-4 text-sm font-medium text-white">{userObj.name}</td>
									<td className="px-6 py-4 text-sm font-mono text-slate-500">{userObj.password}</td>
									<td className="px-6 py-4 text-sm">{cardsCount}</td>
									<td className="px-6 py-4 text-sm">
										<span className="font-semibold text-slate-200">{compT}</span>
										<span className="text-slate-500">/{totalT}</span>
									</td>
									<td className="px-6 py-4 text-sm text-right space-x-2">
										<button
											onClick={() => handleViewBoard(userObj.userId)}
											className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-xs font-semibold rounded-lg transition-all cursor-pointer"
										>
											View Board
										</button>
										<button
											onClick={() => openEditModal(userObj)}
											className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold rounded-lg transition-all cursor-pointer"
										>
											Edit
										</button>
										<button
											onClick={() => handleDelete(userObj.id, userObj.name)}
											className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold rounded-lg transition-all cursor-pointer"
										>
											Delete
										</button>
									</td>
								</tr>
							);
						})}

						{displayUsers.length === 0 && (
							<tr>
								<td colSpan={6} className="px-6 py-12 text-center text-slate-500 text-sm">
									No users configured yet. Click "Add User" to set one up.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{/* User Modal */}
			{isModalOpen && (
				<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
					<div className="bg-[#161927] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
						<div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
							<h3 className="font-bold text-lg text-white">
								{editingUser ? "Edit User Details" : "Create New User"}
							</h3>
							<button
								onClick={() => setIsModalOpen(false)}
								className="text-slate-500 hover:text-slate-300 cursor-pointer"
							>
								<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>

						<form onSubmit={handleSave} className="p-6 space-y-4">
							<div>
								<label htmlFor="modal-name" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
									Full Name
								</label>
								<input
									id="modal-name"
									type="text"
									placeholder="e.g. Jane Doe"
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="w-full px-4 py-2.5 bg-[#0f111a] border border-white/10 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
								/>
							</div>

							<div>
								<label htmlFor="modal-userId" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
									User ID
								</label>
								<input
									id="modal-userId"
									type="text"
									placeholder="e.g. Jane"
									value={userIdInput}
									onChange={(e) => setUserIdInput(e.target.value)}
									disabled={!!editingUser}
									className="w-full px-4 py-2.5 bg-[#0f111a] border border-white/10 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								/>
							</div>

							<div>
								<label htmlFor="modal-pass" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
									Password
								</label>
								<input
									id="modal-pass"
									type="text"
									placeholder="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="w-full px-4 py-2.5 bg-[#0f111a] border border-white/10 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
								/>
							</div>

							{error && (
								<div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">
									{error}
								</div>
							)}

							<div className="pt-2 flex justify-end gap-3">
								<button
									type="button"
									onClick={() => setIsModalOpen(false)}
									className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-semibold rounded-xl transition-all cursor-pointer"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-600/10"
								>
									Save
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
