export interface User {
	id: string;
	userId: string;
	name: string;
	password?: string;
	role: "admin" | "user";
}
