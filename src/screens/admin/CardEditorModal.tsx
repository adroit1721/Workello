import { useState } from "react";
import { useBoardStore } from "../../store/useBoardStore";
import TaskEditorRow from "./TaskEditorRow";

interface Props {
	userId: string;
	listId: string;
	cardId: string | number | null; // null for ADD card mode
	onClose: () => void;
}

export default function CardEditorModal({ userId, listId, cardId, onClose }: Props) {
	const { boards, addCard, updateCard, addTask } = useBoardStore();

	const userBoard = boards[userId] || { cards: {}, lists: [] };
	const card = cardId ? userBoard.cards[cardId] : null;

	const [title, setTitle] = useState(card?.title || "");
	const [description, setDescription] = useState(card?.description || "");
	const [color, setColor] = useState(card?.color || "Blue");

	const [newTaskTitle, setNewTaskTitle] = useState("");
	const [newTaskDesc, setNewTaskDesc] = useState("");
	const [error, setError] = useState("");

	const colors = ["Blue", "Green", "Teal", "Red", "Black", "Orange", "Purple"];

	const handleSaveCard = (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!title.trim()) {
			setError("Card title is required.");
			return;
		}

		if (cardId && card) {
			updateCard(userId, cardId, {
				title: title.trim(),
				description: description.trim(),
				color,
			});
		} else {
			addCard(userId, listId, {
				title: title.trim(),
				description: description.trim(),
				color,
				tasks: [],
			});
		}

		onClose();
	};

	const handleAddTask = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newTaskTitle.trim()) return;

		if (!cardId) {
			alert("Please save the Card first before adding tasks.");
			return;
		}

		addTask(userId, cardId, {
			title: newTaskTitle.trim(),
			description: newTaskDesc.trim(),
		});

		setNewTaskTitle("");
		setNewTaskDesc("");
	};

	return (
		<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
			<div className="bg-[#161927] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-fade-in flex flex-col max-h-[90vh]">
				{/* Header */}
				<div className="px-6 py-4 border-b border-white/5 flex items-center justify-between shrink-0">
					<h3 className="font-bold text-lg text-white">
						{cardId ? `Edit Card: ${card?.title}` : "Add Card"}
					</h3>
					<button onClick={onClose} className="text-slate-500 hover:text-slate-300 cursor-pointer">
						<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				<div className="flex-1 overflow-y-auto p-6 space-y-6">
					{/* Card Details Form */}
					<form onSubmit={handleSaveCard} className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label htmlFor="card-title" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
									Card Title
								</label>
								<input
									id="card-title"
									type="text"
									placeholder="Define color tokens"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									className="w-full px-4 py-2.5 bg-[#0f111a] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
								/>
							</div>

							<div>
								<label htmlFor="card-color" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
									Color Tag
								</label>
								<select
									id="card-color"
									value={color}
									onChange={(e) => setColor(e.target.value)}
									className="w-full px-4 py-2.5 bg-[#0f111a] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
								>
									{colors.map((c) => (
										<option key={c} value={c}>
											{c}
										</option>
									))}
								</select>
							</div>
						</div>

						<div>
							<label htmlFor="card-desc" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
								Description
							</label>
							<textarea
								id="card-desc"
								placeholder="Enter card details..."
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								rows={3}
								className="w-full px-4 py-2.5 bg-[#0f111a] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 resize-none"
							/>
						</div>

						{error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">{error}</div>}

						<div className="flex justify-end gap-3 shrink-0">
							<button
								type="button"
								onClick={onClose}
								className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-semibold rounded-xl transition-all cursor-pointer"
							>
								Cancel
							</button>
							<button
								type="submit"
								className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-600/10"
							>
								Save Card Details
							</button>
						</div>
					</form>

					{/* Task List Management (Only active in Edit mode) */}
					{cardId && card ? (
						<div className="border-t border-white/5 pt-6 space-y-4">
							<h4 className="text-sm font-bold text-white uppercase tracking-wider">Subtasks Management</h4>

							{/* Tasks List */}
							<div className="space-y-2 max-h-60 overflow-y-auto pr-1">
								{card.tasks.map((task) => (
									<TaskEditorRow
										key={task.id}
										userId={userId}
										cardId={cardId}
										task={task}
									/>
								))}

								{card.tasks.length === 0 && (
									<div className="text-center py-6 text-xs text-slate-500">No tasks created yet for this card.</div>
								)}
							</div>

							{/* Add new task form */}
							<form onSubmit={handleAddTask} className="bg-[#0f111a] border border-white/5 p-4 rounded-xl space-y-3">
								<h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Add Subtask</h5>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									<input
										type="text"
										placeholder="Task title (e.g. Choose fonts)"
										value={newTaskTitle}
										onChange={(e) => setNewTaskTitle(e.target.value)}
										className="px-3 py-2 bg-[#161927] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
									/>
									<input
										type="text"
										placeholder="Short description"
										value={newTaskDesc}
										onChange={(e) => setNewTaskDesc(e.target.value)}
										className="px-3 py-2 bg-[#161927] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
									/>
								</div>
								<div className="flex justify-end">
									<button
										type="submit"
										className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white rounded-lg transition-colors cursor-pointer"
									>
										Add Task
									</button>
								</div>
							</form>
						</div>
					) : (
						<div className="text-center py-4 text-xs text-slate-500 bg-white/[0.01] rounded-xl border border-dashed border-white/5">
							Save card details first to enable adding subtasks.
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
