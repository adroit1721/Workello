import type { Board, Card } from "../types/board.types";
import type { User } from "../types/auth.types";

const now = Date.now();
const daysAgo = (n: number) =>
	new Date(now - n * 24 * 60 * 60 * 1000).toISOString();

// Template cards
export const initialMockCards: Record<string | number, Card> = {
	"card-1": {
		id: "card-1",
		title: "Design system setup",
		description:
			"Define color tokens, typography scale, and spacing units for the whole app.",
		color: "Blue",
		position: 0,
		tasks: [
			{
				id: "task-1",
				title: "Pick primary font",
				description: "Choose between Inter and Geist",
				isCompleted: true,
				createdAt: daysAgo(1),
			},
			{
				id: "task-2",
				title: "Define color palette",
				description: "5 neutrals + 2 accent colors",
				isCompleted: false,
				createdAt: daysAgo(1),
			},
		],
	},
	"card-2": {
		id: "card-2",
		title: "Set up Vite + React",
		description:
			"Scaffold the project, install dependencies, clean up default files.",
		color: "Green",
		position: 1,
		tasks: [
			{
				id: "task-3",
				title: "Run create vite",
				description: "Use react-ts template",
				isCompleted: true,
				createdAt: daysAgo(2),
			},
			{
				id: "task-4",
				title: "Install Zustand",
				description: "npm install zustand",
				isCompleted: true,
				createdAt: daysAgo(2),
			},
		],
	},
	"card-3": {
		id: "card-3",
		title: "Write TypeScript interfaces",
		description:
			"Board, List, Card, Task — all interfaces defined and exported.",
		color: "Teal",
		position: 2,
		tasks: [
			{
				id: "task-5",
				title: "Board interface",
				description: "Includes lists array",
				isCompleted: true,
				createdAt: daysAgo(1),
			},
			{
				id: "task-6",
				title: "Card interface",
				description: "Includes tasks and color",
				isCompleted: false,
				createdAt: daysAgo(1),
			},
		],
	},
	"card-4": {
		id: "card-4",
		title: "Build Zustand board store",
		description: "Create the global store slice with lists and cards state.",
		color: "Red",
		position: 0,
		tasks: [
			{
				id: "task-7",
				title: "Create store file",
				description: "src/store/index.ts",
				isCompleted: false,
				createdAt: daysAgo(5),
			},
			{
				id: "task-8",
				title: "Load mock data on init",
				description: "Seed store from mockBoard.ts",
				isCompleted: false,
				createdAt: daysAgo(5),
			},
		],
	},
};

export const initialMockBoard: Board = {
	id: "board-1",
	userId: "Alice",
	title: "Workello Workspace",
	description: "A collaborative Kanban + Canvas workspace.",
	lists: [
		{
			id: "list-1",
			title: "To Do",
			color: "#e8f4fd",
			position: 0,
			cardIds: ["card-1", "card-2", "card-3"],
		},
		{
			id: "list-2",
			title: "In Progress",
			color: "#fff8e6",
			position: 1,
			cardIds: ["card-4"],
		},
		{
			id: "list-3",
			title: "Done",
			color: "#edf7ed",
			position: 2,
			cardIds: [],
		},
		{
			id: "list-4",
			title: "Backlog",
			color: "#f3eefe",
			position: 3,
			cardIds: [],
		},
	],
};

// Seed mock users
export const defaultMockUsers: User[] = [
	{
		id: "admin-id",
		userId: "Admin",
		name: "Workello Administrator",
		password: "Admin123",
		role: "admin",
	},
	{
		id: "alice-id",
		userId: "Alice",
		name: "Alice Smith",
		password: "Alice123",
		role: "user",
	},
	{
		id: "bob-id",
		userId: "Bob",
		name: "Bob Jones",
		password: "Bob123",
		role: "user",
	},
];
