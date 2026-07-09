export interface Task {
	id: number | string;
	title: string;
	description: string;
	image?: string;
	isCompleted: boolean;
	createdAt: string;
}

export interface Card {
	id: number | string;
	title: string;
	description: string;
	tasks: Task[];
	position: number;
	color: string;
}

export interface List {
	id: number | string;
	title: string;
	cardIds: (number | string)[];
	position: number;
	color: string;
}

export interface Board {
	id: number | string;
	userId: string; // Board is owned by a user
	title: string;
	description: string;
	lists: List[];
}

export type PendingMove = {
	cardId: string;
	targetListId: string;
} | null;

export type BlockedMove = {
	cardId: string;
	reason: "done" | "overdue" | "backward" | "not-started";
} | null;

export interface BoardState {
	cards: Record<string | number, Card>;
	lists: List[];
	pendingCompletion: PendingMove;
	pendingConfirm: PendingMove;
	pendingStart: PendingMove;
	blockedMove: BlockedMove;
}

export interface DragOperationEvent {
	operation: {
		source: { id: string | number } | null;
		target: { id: string | number } | null;
	};
}

export type MoveOutcome =
	| { kind: "move" }
	| { kind: "confirm-backlog" }
	| { kind: "confirm-completion" }
	| { kind: "confirm-start" }
	| { kind: "blocked"; reason: NonNullable<BlockedMove>["reason"] };

