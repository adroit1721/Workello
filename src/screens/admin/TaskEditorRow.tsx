import { useState } from "react";
import { useBoardStore } from "../../store/useBoardStore";
import type { Task } from "../../types/board.types";

interface Props {
	userId: string;
	cardId: string | number;
	task: Task;
}

export default function TaskEditorRow({ userId, cardId, task }: Props) {
	const { updateTask, deleteTask } = useBoardStore();
	const [isEditing, setIsEditing] = useState(false);
	const [title, setTitle] = useState(task.title);
	const [description, setDescription] = useState(task.description);

	const handleSave = () => {
		if (!title.trim()) return;
		updateTask(userId, cardId, task.id, {
			title: title.trim(),
			description: description.trim(),
		});
		setIsEditing(false);
	};

	const handleToggleCompleted = (checked: boolean) => {
		updateTask(userId, cardId, task.id, {
			isCompleted: checked,
		});
	};

	const handleDelete = () => {
		if (window.confirm(`Delete task "${task.title}"?`)) {
			deleteTask(userId, cardId, task.id);
		}
	};

	if (isEditing) {
		return (
			<div className="bg-[#1e2235] border border-white/10 rounded-xl p-3 flex flex-col gap-2">
				<div className="grid grid-cols-2 gap-2">
					<input
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="px-2 py-1.5 bg-[#0f111a] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
					/>
					<input
						type="text"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className="px-2 py-1.5 bg-[#0f111a] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
					/>
				</div>
				<div className="flex justify-end gap-2">
					<button
						onClick={() => setIsEditing(false)}
						className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-[11px] font-semibold text-slate-300 rounded-lg cursor-pointer"
					>
						Cancel
					</button>
					<button
						onClick={handleSave}
						className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-[11px] font-semibold text-white rounded-lg cursor-pointer"
					>
						Save
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-[#1a1d2d] border border-white/5 rounded-xl p-3 flex items-center justify-between gap-4">
			<div className="flex items-center gap-3 min-w-0">
				<input
					type="checkbox"
					checked={task.isCompleted}
					onChange={(e) => handleToggleCompleted(e.target.checked)}
					className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900 focus:ring-2 cursor-pointer"
				/>
				<div className="min-w-0">
					<h5 className={`text-xs font-semibold text-white truncate ${task.isCompleted ? "line-through text-slate-500" : ""}`}>
						{task.title}
					</h5>
					{task.description && (
						<p className={`text-[10px] text-slate-400 truncate ${task.isCompleted ? "line-through text-slate-600" : ""}`}>
							{task.description}
						</p>
					)}
				</div>
			</div>

			<div className="flex gap-1 shrink-0">
				<button
					onClick={() => setIsEditing(true)}
					className="p-1 hover:bg-white/5 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
					title="Edit task"
				>
					<svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-2.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
					</svg>
				</button>
				<button
					onClick={handleDelete}
					className="p-1 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded transition-colors cursor-pointer"
					title="Delete task"
				>
					<svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
					</svg>
				</button>
			</div>
		</div>
	);
}
