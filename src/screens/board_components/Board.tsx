import { DragDropProvider } from "@dnd-kit/react";
import List from "./List";
import ConfirmMoveModal from "./confirmMoveModal";
import TaskCompletionModal from "./taskCompletionModal";
import BlockedMoveModal from "./blockedMoveModal";
import { useBoardStore } from "../../store/useBoardStore";
import { useAuthStore } from "../../store/useAuthStore";

export default function Board() {
	const { user } = useAuthStore();
	const activeUserId = user?.userId || "Alice"; // fallback safety

	const {
		boards,
		completeTask,
		requestMove,
		pendingCompletion,
		pendingConfirm,
		pendingStart,
		confirmCompletion,
		cancelCompletion,
		confirmBacklogMove,
		cancelBacklogMove,
		confirmStartMove,
		cancelStartMove,
		blockedMove,
		dismissBlockedMove,
	} = useBoardStore();

	const userBoard = boards[activeUserId] || { cards: {}, lists: [] };
	const { cards, lists } = userBoard;

	const handleDragEnd = (event: any) => {
		const { source, target } = event.operation;
		if (!source || !target) return;
		requestMove(activeUserId, String(source.id), String(target.id));
	};

	const hydratedLists = lists.map((list) => {
		const listCards = list.cardIds
			.map((id) => cards[id])
			.filter(Boolean)
			.sort((a, b) => a.position - b.position);

		const totalDone = listCards.reduce(
			(sum, card) => sum + card.tasks.filter((t) => t.isCompleted).length,
			0,
		);

		return { list, listCards, totalDone };
	});

	return (
		<>
			<DragDropProvider onDragEnd={handleDragEnd}>
				<div className="flex gap-4 overflow-x-auto items-start pb-6 px-8 py-10">
					{hydratedLists.map(({ list, listCards, totalDone }) => (
						<List
							key={list.id}
							list={list}
							cards={listCards}
							totalDone={totalDone}
						/>
					))}
				</div>
			</DragDropProvider>

			{pendingCompletion && cards[pendingCompletion.cardId] && (
				<TaskCompletionModal
					card={cards[pendingCompletion.cardId]}
					onCompleteTask={(cardId, taskId) => completeTask(activeUserId, cardId, taskId)}
					onCancel={cancelCompletion}
					onConfirm={() => confirmCompletion(activeUserId)}
					targetListLabel="Done"
					requireAllTasks
				/>
			)}

			{pendingStart && cards[pendingStart.cardId] && (
				<TaskCompletionModal
					card={cards[pendingStart.cardId]}
					onCompleteTask={(cardId, taskId) => completeTask(activeUserId, cardId, taskId)}
					onCancel={cancelStartMove}
					onConfirm={() => confirmStartMove(activeUserId)}
					targetListLabel="In Progress"
					requireAllTasks={false}
				/>
			)}

			{pendingConfirm && cards[pendingConfirm.cardId] && (
				<ConfirmMoveModal
					card={cards[pendingConfirm.cardId]}
					message="Move this card to Backlog? It hasn't been finished."
					onCancel={cancelBacklogMove}
					onConfirm={() => confirmBacklogMove(activeUserId)}
				/>
			)}

			{blockedMove && cards[blockedMove.cardId] && (
				<BlockedMoveModal
					card={cards[blockedMove.cardId]}
					reason={blockedMove.reason}
					onDismiss={dismissBlockedMove}
				/>
			)}
		</>
	);
}
