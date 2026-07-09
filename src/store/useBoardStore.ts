import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Card, List, PendingMove, BlockedMove, MoveOutcome, Task } from "../types/board.types";
import { redistributeCards, listsAreEqual } from "../hooks/useDistributeEffects";
import { initialMockCards, initialMockBoard } from "../data/mockData";

const TODO_LIST_ID = "list-1";
const IN_PROGRESS_LIST_ID = "list-2";
const DONE_LIST_ID = "list-3";
const BACKLOG_LIST_ID = "list-4";

function findListIdForCard(lists: List[], cardId: string) {
	return lists.find((l) => l.cardIds.includes(cardId))?.id;
}

function isCardFullyDone(cards: Record<string | number, Card>, cardId: string) {
	const card = cards[cardId];
	const total = card?.tasks.length ?? 0;
	const done = card?.tasks.filter((t) => t.isCompleted).length ?? 0;
	return total > 0 && done === total;
}

function isCardAllPending(cards: Record<string | number, Card>, cardId: string) {
	const card = cards[cardId];
	const total = card?.tasks.length ?? 0;
	const done = card?.tasks.filter((t) => t.isCompleted).length ?? 0;
	return total > 0 && done === 0;
}

function moveCardInLists(
	lists: List[],
	cardId: string,
	targetListId: string,
): List[] {
	const next = lists.map((l) => ({ ...l, cardIds: [...l.cardIds] }));
	const sourceList = next.find((l) => l.cardIds.includes(cardId));
	const targetList = next.find((l) => l.id === targetListId);

	if (!sourceList || !targetList || sourceList.id === targetListId) {
		return lists;
	}

	sourceList.cardIds = sourceList.cardIds.filter((id) => id !== cardId);
	if (!targetList.cardIds.includes(cardId)) {
		targetList.cardIds.push(cardId);
	}

	return next;
}

function decideMoveOutcome(
	cards: Record<string | number, Card>,
	cardId: string,
	sourceListId: string,
	targetListId: string,
): MoveOutcome {
	if (isCardFullyDone(cards, cardId) && targetListId !== DONE_LIST_ID) {
		return { kind: "blocked", reason: "done" };
	}

	if (sourceListId === IN_PROGRESS_LIST_ID && targetListId === TODO_LIST_ID) {
		return { kind: "blocked", reason: "backward" };
	}

	if (targetListId === IN_PROGRESS_LIST_ID && isCardAllPending(cards, cardId)) {
		return { kind: "confirm-start" };
	}

	if (sourceListId === TODO_LIST_ID && targetListId === BACKLOG_LIST_ID) {
		return { kind: "confirm-backlog" };
	}

	if (targetListId === DONE_LIST_ID && !isCardFullyDone(cards, cardId)) {
		return { kind: "confirm-completion" };
	}

	return { kind: "move" };
}

interface BoardData {
	cards: Record<string | number, Card>;
	lists: List[];
}

interface BoardStore {
	boards: Record<string, BoardData>;

	pendingCompletion: PendingMove;
	pendingConfirm: PendingMove;
	pendingStart: PendingMove;
	blockedMove: BlockedMove;
	openCardId: string | number | null;

	// Board state operations
	completeTask: (userId: string, cardId: string | number, taskId: string | number) => void;
	requestMove: (userId: string, cardId: string, targetListId: string) => void;
	confirmCompletion: (userId: string) => void;
	cancelCompletion: () => void;
	confirmBacklogMove: (userId: string) => void;
	cancelBacklogMove: () => void;
	confirmStartMove: (userId: string) => void;
	cancelStartMove: () => void;
	dismissBlockedMove: () => void;
	toggleCard: (cardId: string | number | null) => void;

	// CRUD
	addCard: (userId: string, listId: string, card: Omit<Card, "id" | "position">) => void;
	updateCard: (userId: string, cardId: string | number, patch: Partial<Card>) => void;
	deleteCard: (userId: string, cardId: string | number) => void;
	addTask: (userId: string, cardId: string | number, task: Omit<Task, "id" | "createdAt" | "isCompleted">) => void;
	updateTask: (userId: string, cardId: string | number, taskId: string | number, patch: Partial<Task>) => void;
	deleteTask: (userId: string, cardId: string | number, taskId: string | number) => void;
	initUserBoard: (userId: string) => void;
}

export const useBoardStore = create<BoardStore>()(
	persist(
		(set, get) => ({
			// Seed Alice with mock cards & lists as default template
			boards: {
				Alice: {
					cards: initialMockCards,
					lists: redistributeCards(initialMockBoard.lists, initialMockCards),
				},
				Bob: {
					cards: {},
					lists: initialMockBoard.lists.map(l => ({ ...l, cardIds: [] })),
				}
			},
			pendingCompletion: null,
			pendingConfirm: null,
			pendingStart: null,
			blockedMove: null,
			openCardId: null,

			completeTask: (userId, cardId, taskId) => {
				const userBoard = get().boards[userId];
				if (!userBoard) return;

				const card = userBoard.cards[cardId];
				if (!card) return;

				const task = card.tasks.find((t) => t.id === taskId);
				if (!task || task.isCompleted) return;

				const updatedCards = {
					...userBoard.cards,
					[cardId]: {
						...card,
						tasks: card.tasks.map((t) =>
							t.id === taskId ? { ...t, isCompleted: true } : t,
						),
					},
				};

				const redistributed = redistributeCards(userBoard.lists, updatedCards);
				const updatedLists = listsAreEqual(userBoard.lists, redistributed)
					? userBoard.lists
					: redistributed;

				set((state) => ({
					boards: {
						...state.boards,
						[userId]: {
							cards: updatedCards,
							lists: updatedLists,
						},
					},
				}));
			},

			requestMove: (userId, cardId, targetListId) => {
				const userBoard = get().boards[userId];
				if (!userBoard) return;

				const sourceListId = String(findListIdForCard(userBoard.lists, cardId));
				if (!sourceListId || sourceListId === targetListId) return;

				const outcome = decideMoveOutcome(
					userBoard.cards,
					cardId,
					sourceListId,
					targetListId,
				);

				switch (outcome.kind) {
					case "blocked":
						set({ blockedMove: { cardId, reason: outcome.reason } });
						break;
					case "confirm-backlog":
						set({ pendingConfirm: { cardId, targetListId } });
						break;
					case "confirm-completion":
						set({ pendingCompletion: { cardId, targetListId } });
						break;
					case "confirm-start":
						set({ pendingStart: { cardId, targetListId } });
						break;
					case "move":
						set((state) => ({
							boards: {
								...state.boards,
								[userId]: {
									...state.boards[userId],
									lists: moveCardInLists(state.boards[userId].lists, cardId, targetListId),
								},
							},
						}));
						break;
				}
			},

			confirmCompletion: (userId) => {
				const pending = get().pendingCompletion;
				if (!pending) return;
				const { cardId, targetListId } = pending;
				set((state) => ({
					boards: {
						...state.boards,
						[userId]: {
							...state.boards[userId],
							lists: moveCardInLists(state.boards[userId].lists, cardId, targetListId),
						},
					},
					pendingCompletion: null,
				}));
			},

			cancelCompletion: () => set({ pendingCompletion: null }),

			confirmBacklogMove: (userId) => {
				const pending = get().pendingConfirm;
				if (!pending) return;
				const { cardId, targetListId } = pending;
				set((state) => ({
					boards: {
						...state.boards,
						[userId]: {
							...state.boards[userId],
							lists: moveCardInLists(state.boards[userId].lists, cardId, targetListId),
						},
					},
					pendingConfirm: null,
				}));
			},

			cancelBacklogMove: () => set({ pendingConfirm: null }),

			confirmStartMove: (userId) => {
				const pending = get().pendingStart;
				if (!pending) return;
				const { cardId, targetListId } = pending;
				const userBoard = get().boards[userId];
				if (userBoard && isCardAllPending(userBoard.cards, cardId)) return;

				set((state) => ({
					boards: {
						...state.boards,
						[userId]: {
							...state.boards[userId],
							lists: moveCardInLists(state.boards[userId].lists, cardId, targetListId),
						},
					},
					pendingStart: null,
				}));
			},

			cancelStartMove: () => set({ pendingStart: null }),

			dismissBlockedMove: () => set({ blockedMove: null }),

			toggleCard: (cardId) => set({ openCardId: cardId }),

			addCard: (userId, listId, cardData) => {
				const userBoard = get().boards[userId];
				if (!userBoard) return;

				const id = "card-" + Date.now();
				const position = userBoard.lists.find((l) => l.id === listId)?.cardIds.length ?? 0;

				const newCard: Card = {
					id,
					position,
					...cardData,
				};

				const updatedCards = {
					...userBoard.cards,
					[id]: newCard,
				};

				const updatedLists = userBoard.lists.map((list) => {
					if (list.id === listId) {
						return {
							...list,
							cardIds: [...list.cardIds, id],
						};
					}
					return list;
				});

				set((state) => ({
					boards: {
						...state.boards,
						[userId]: {
							cards: updatedCards,
							lists: updatedLists,
						},
					},
				}));
			},

			updateCard: (userId, cardId, patch) => {
				const userBoard = get().boards[userId];
				if (!userBoard) return;

				const card = userBoard.cards[cardId];
				if (!card) return;

				const updatedCards = {
					...userBoard.cards,
					[cardId]: {
						...card,
						...patch,
					},
				};

				set((state) => ({
					boards: {
						...state.boards,
						[userId]: {
							...state.boards[userId],
							cards: updatedCards,
						},
					},
				}));
			},

			deleteCard: (userId, cardId) => {
				const userBoard = get().boards[userId];
				if (!userBoard) return;

				const updatedCards = { ...userBoard.cards };
				delete updatedCards[cardId];

				const updatedLists = userBoard.lists.map((list) => ({
					...list,
					cardIds: list.cardIds.filter((id) => id !== cardId),
				}));

				set((state) => ({
					boards: {
						...state.boards,
						[userId]: {
							cards: updatedCards,
							lists: updatedLists,
						},
					},
				}));
			},

			addTask: (userId, cardId, taskData) => {
				const userBoard = get().boards[userId];
				if (!userBoard) return;

				const card = userBoard.cards[cardId];
				if (!card) return;

				const newTask: Task = {
					id: "task-" + Date.now(),
					isCompleted: false,
					createdAt: new Date().toISOString(),
					...taskData,
				};

				const updatedCards = {
					...userBoard.cards,
					[cardId]: {
						...card,
						tasks: [...card.tasks, newTask],
					},
				};

				const redistributed = redistributeCards(userBoard.lists, updatedCards);
				const updatedLists = listsAreEqual(userBoard.lists, redistributed)
					? userBoard.lists
					: redistributed;

				set((state) => ({
					boards: {
						...state.boards,
						[userId]: {
							cards: updatedCards,
							lists: updatedLists,
						},
					},
				}));
			},

			updateTask: (userId, cardId, taskId, patch) => {
				const userBoard = get().boards[userId];
				if (!userBoard) return;

				const card = userBoard.cards[cardId];
				if (!card) return;

				const updatedCards = {
					...userBoard.cards,
					[cardId]: {
						...card,
						tasks: card.tasks.map((task) => {
							if (task.id === taskId) {
								return { ...task, ...patch };
							}
							return task;
						}),
					},
				};

				const redistributed = redistributeCards(userBoard.lists, updatedCards);
				const updatedLists = listsAreEqual(userBoard.lists, redistributed)
					? userBoard.lists
					: redistributed;

				set((state) => ({
					boards: {
						...state.boards,
						[userId]: {
							cards: updatedCards,
							lists: updatedLists,
						},
					},
				}));
			},

			deleteTask: (userId, cardId, taskId) => {
				const userBoard = get().boards[userId];
				if (!userBoard) return;

				const card = userBoard.cards[cardId];
				if (!card) return;

				const updatedCards = {
					...userBoard.cards,
					[cardId]: {
						...card,
						tasks: card.tasks.filter((task) => task.id !== taskId),
					},
				};

				const redistributed = redistributeCards(userBoard.lists, updatedCards);
				const updatedLists = listsAreEqual(userBoard.lists, redistributed)
					? userBoard.lists
					: redistributed;

				set((state) => ({
					boards: {
						...state.boards,
						[userId]: {
							cards: updatedCards,
							lists: updatedLists,
						},
					},
				}));
			},

			initUserBoard: (userId) => {
				set((state) => {
					if (state.boards[userId]) return {}; // board already exists
					return {
						boards: {
							...state.boards,
							[userId]: {
								cards: {},
								lists: initialMockBoard.lists.map(l => ({ ...l, cardIds: [] })),
							},
						},
					};
				});
			},
		}),
		{
			name: "workello:board",
		},
	),
);
