import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
	token: string | null;
	signIn: (token: string) => void;
	signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			token: null,
			signIn: (token: string): void => {
				set({ token });
			},
			signOut: (): void => {
				set({ token: null });
			},
		}),
		{ name: "kpz8-auth" }
	)
);

export const readStoredToken = (): string | null =>
	useAuthStore.getState().token;

interface JwtClaims {
	email?: string;
	name?: string;
	role?: string;
	exp?: number;
}

export const readJwtClaims = (token: string): JwtClaims | null => {
	const payload = token.split(".")[1];
	if (!payload) {
		return null;
	}
	try {
		return JSON.parse(
			atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
		) as JwtClaims;
	} catch {
		return null;
	}
};
