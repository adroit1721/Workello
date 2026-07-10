import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types/auth.types";
import { useAdminStore } from "./useAdminStore";

interface AuthStore {
	user: User | null;
	isAuthenticated: boolean;
	loginAs: "admin" | "user" | null;
	adminCredentials: { userId: string; password: string; name: string };
	login: (userId: string, password: string) => { success: boolean; role?: "admin" | "user"; error?: string };
	logout: () => void;
	updateAdminCredentials: (patch: { userId?: string; password?: string; name?: string }) => void;
}

export const useAuthStore = create<AuthStore>()(
	persist(
		(set, get) => ({
			user: null,
			isAuthenticated: false,
			loginAs: null,
			adminCredentials: { userId: "Admin", password: "Admin123", name: "Workello Administrator" },
			login: (userId, password) => {
				// Read dynamic admin credentials
				const { adminCredentials } = get();
				if (userId === adminCredentials.userId && password === adminCredentials.password) {
					const adminUser: User = {
						id: "admin-id",
						userId: adminCredentials.userId,
						name: adminCredentials.name,
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
			updateAdminCredentials: (patch) => {
				set((state) => {
					const updated = { ...state.adminCredentials, ...patch };
					// Also update the live user session if currently logged in as admin
					const newUser =
						state.user?.role === "admin"
							? { ...state.user, userId: updated.userId, name: updated.name }
							: state.user;
					return { adminCredentials: updated, user: newUser };
				});
			},
		}),
		{
			name: "workello:auth",
		},
	),
);
