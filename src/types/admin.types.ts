import type { User } from "./auth.types";

export interface AdminStats {
	totalUsers: number;
	totalCards: number;
	totalTasks: number;
	completedTasks: number;
	completionRate: number; // 0 - 100
}

export interface UserBoardStats {
	totalCards: number;
	completedCards: number;
	totalTasks: number;
	completedTasks: number;
}

export interface UserWithBoard {
	user: User;
	boardStats: UserBoardStats;
}
