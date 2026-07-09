import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types/auth.types";
import { useAdminStore } from "./useAdminStore";

interface AuthStore {
	user: User | null;
	isAuthenticated: boolean;
	loginAs: "admin" | "user" | null;
	login: (userId: string, password: string) => { success: boolean; role?: "admin" | "user"; error?: string };
	logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
	persist(
		(set) => ({
			user: null,
			isAuthenticated: false,
			loginAs: null,
			login: (userId, password) => {
				// Admin hardcoded check
				if (userId === "Admin" && password === "Admin123") {
					const adminUser: User = {
						id: "admin-id",
						userId: "Admin",
						name: "Workello Administrator",
						role: "admin",
					};
					set({ user: adminUser, isAuthenticated: true, loginAs: "admin" });
					return { success: true, role: "admin" };
				}

				// Check store users (admin dynamically creates them)
				const storeUsers = useAdminStore.getState().users;
				const found = storeUsers.find(
					(u) => u.userId.toLowerCase() === userId.toLowerCase() && u.password === password,
				);

				if (found) {
					const userObj: User = {
						id: found.id,
						userId: found.userId,
						name: found.name,
						role: found.role,
					};
					set({
						user: userObj,
						isAuthenticated: true,
						loginAs: found.role,
					});
					return { success: true, role: found.role };
				}

				return { success: false, error: "Invalid User ID or password." };
			},
			logout: () => {
				set({ user: null, isAuthenticated: false, loginAs: null });
			},
		}),
		{
			name: "workello:auth",
		},
	),
);
