import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types/auth.types";
import { defaultMockUsers } from "../data/mockData";

interface AdminStore {
	users: User[];
	selectedUserId: string | null;
	adminView: "overview" | "users" | "boards" | "settings";
	addUser: (user: Omit<User, "id"> & { userId: string; password?: string }) => void;
	updateUser: (userId: string, patch: Partial<User & { password?: string }>) => void;
	deleteUser: (userId: string) => void;
	setSelectedUser: (userId: string | null) => void;
	setAdminView: (view: "overview" | "users" | "boards" | "settings") => void;
}

export const useAdminStore = create<AdminStore>()(
	persist(
		(set) => ({
			users: defaultMockUsers,
			selectedUserId: null,
			adminView: "overview",
			addUser: (userData) => {
				const newUser: User = {
					id: "user-" + Date.now(),
					userId: userData.userId,
					name: userData.name,
					password: userData.password,
					role: userData.role || "user",
				};
				set((state) => ({
					users: [...state.users, newUser],
				}));
			},
			updateUser: (userId, patch) => {
				set((state) => ({
					users: state.users.map((u) => {
						if (u.id === userId || u.userId === userId) {
							return { ...u, ...patch };
						}
						return u;
					}),
				}));
			},
			deleteUser: (userId) => {
				set((state) => ({
					users: state.users.filter((u) => u.id !== userId && u.userId !== userId),
				}));
			},
			setSelectedUser: (userId) => set({ selectedUserId: userId }),
			setAdminView: (view) => set({ adminView: view }),
		}),
		{
			name: "workello:admin",
		},
	),
);
