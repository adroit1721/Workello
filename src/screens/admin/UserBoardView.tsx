import { useState } from "react";
import { useAdminStore } from "../../store/useAdminStore";
import { useBoardStore } from "../../store/useBoardStore";
import CardEditorModal from "./CardEditorModal";

export default function UserBoardView() {
	const { users, selectedUserId, setSelectedUser } = useAdminStore();
	const { boards, deleteCard } = useBoardStore();

	const [editingCardId, setEditingCardId] = useState<string | number | null>(null);
	const [activeListId, setActiveListId] = useState<string | null>(null);
	const [isCardModalOpen, setIsCardModalOpen] = useState(false);

	const activeUserId = selectedUserId || (users.filter((u) => u.role !== "admin")[0]?.userId ?? null);

	if (!activeUserId) {
		return (
			<div className="p-8 text-center text-slate-500 text-sm">
				No users available. Create a user first in "Manage Users" to see their boards.
			</div>
		);
	}

	const board = boards[activeUserId] || { cards: {}, lists: [] };

	const handleOpenAddCard = (listId: string) => {
		setActiveListId(listId);
		setEditingCardId(null);
		setIsCardModalOpen(true);
	};

	const handleOpenEditCard = (listId: string, cardId: string | number) => {
		setActiveListId(listId);
		setEditingCardId(cardId);
		setIsCardModalOpen(true);
	};

	const handleDeleteCard = (cardId: string | number) => {
		if (window.confirm("Are you sure you want to delete this card and all its tasks?")) {
			deleteCard(activeUserId, cardId);
		}
	};

	return (
		<div className="p-8 space-y-6 w-full flex flex-col h-full overflow-hidden">
			{/* Top Bar / Select dropdown */}
			<div className="flex justify-between items-center shrink-0">
				<div>
					<h1 className="text-3xl font-extrabold tracking-tight text-white">User Boards</h1>
					<p className="mt-1 text-sm text-slate-400">
						View and edit the workspace cards/tasks for any user in real-time.
					</p>
				</div>

				<div className="flex items-center gap-3">
					<label htmlFor="user-select" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
						Select User:
					</label>
					<select
						id="user-select"
						value={activeUserId}
						onChange={(e) => setSelectedUser(e.target.value)}
						className="px-4 py-2 bg-[#161927] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
					>
						{users
							.filter((u) => u.role !== "admin")
							.map((u) => (
								<option key={u.id} value={u.userId}>
									{u.name} ({u.userId})
								</option>
							))}
					</select>
				</div>
			</div>

			{/* Board columns representation */}
			<div className="flex-1 flex gap-6 overflow-x-auto items-start pb-6 py-4">
				{board.lists.map((list) => {
					const listCards = list.cardIds
						.map((id) => board.cards[id])
						.filter(Boolean)
						.sort((a, b) => a.position - b.position);

					return (
						<div key={list.id} className="w-80 bg-[#161927] border border-white/5 rounded-2xl flex flex-col max-h-full shrink-0">
							{/* Header */}
							<div className="p-4 border-b border-white/5 flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div className="w-3 h-3 rounded-full" style={{ backgroundColor: list.color }} />
									<h3 className="font-bold text-white text-sm">{list.title}</h3>
								</div>
								<span className="text-xs font-mono text-slate-500 bg-white/5 rounded px-2 py-0.5">
									{listCards.length}
								</span>
							</div>

							{/* Card List */}
							<div className="flex-1 overflow-y-auto p-4 space-y-3">
								{listCards.map((card) => {
									const completedCount = card.tasks.filter((t) => t.isCompleted).length;
									const totalCount = card.tasks.length;
									return (
										<div
											key={card.id}
											className="bg-[#22263a] border border-white/5 rounded-xl p-4 hover:border-indigo-500/30 transition-all flex flex-col justify-between space-y-3"
										>
											<div>
												<div className="flex items-start justify-between gap-2">
													<h4 className="font-bold text-sm text-slate-100 leading-snug">{card.title}</h4>
													<span className="text-[10px] font-mono text-slate-500 bg-white/5 rounded px-1.5 py-0.5">
														#{card.position + 1}
													</span>
												</div>
												<p className="text-xs text-slate-400 mt-1 line-clamp-2">{card.description}</p>
											</div>

											{totalCount > 0 && (
												<div className="flex items-center justify-between text-[10px] text-slate-500">
													<span>
														{completedCount}/{totalCount} tasks completed
													</span>
													<span>{Math.round((completedCount / totalCount) * 100)}%</span>
												</div>
											)}

											<div className="flex justify-end gap-2 pt-2 border-t border-white/5">
												<button
													onClick={() => handleOpenEditCard(list.id as string, card.id)}
													className="px-2.5 py-1 bg-white/5 hover:bg-white/10 active:bg-white/20 text-[11px] font-semibold text-slate-300 rounded-lg transition-colors cursor-pointer"
												>
													Edit
												</button>
												<button
													onClick={() => handleDeleteCard(card.id)}
													className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 active:bg-rose-500/35 text-[11px] font-semibold text-rose-400 rounded-lg transition-colors cursor-pointer"
												>
													Delete
												</button>
											</div>
										</div>
									);
								})}

								{listCards.length === 0 && (
									<div className="text-center py-8 text-xs text-slate-600">No cards in this list.</div>
								)}
							</div>

							{/* Add Card action */}
							<div className="p-3 border-t border-white/5">
								<button
									onClick={() => handleOpenAddCard(list.id as string)}
									className="w-full py-2 bg-white/5 hover:bg-white/10 active:bg-white/15 text-xs font-semibold text-slate-300 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
								>
									<svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
										<path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
									</svg>
									Add Card
								</button>
							</div>
						</div>
					);
				})}
			</div>

			{/* Card details edit modal */}
			{isCardModalOpen && (
				<CardEditorModal
					userId={activeUserId}
					listId={activeListId!}
					cardId={editingCardId}
					onClose={() => setIsCardModalOpen(false)}
				/>
			)}
		</div>
	);
}
