import { type UseMutationResult, useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { apiClient } from "@/lib/axios";
import { unwrap, type ApiSuccessBody } from "@/lib/api";
import { readJwtClaims, useAuthStore } from "@/store/authStore";
import type { AuthUser, LoginFormValues } from "@/features/auth/types";

const stripBearer = (value: string): string => value.replace(/^Bearer\s+/i, "");

const login = async (values: LoginFormValues): Promise<string> => {
	const data = unwrap(
		await apiClient.post<ApiSuccessBody<string>>("/auth/login", values)
	);
	return stripBearer(data);
};

export const useLogin = (): UseMutationResult<
	string,
	Error,
	LoginFormValues
> => {
	const signIn = useAuthStore((state) => state.signIn);
	const navigate = useNavigate();

	return useMutation({
		mutationFn: login,
		onSuccess: (token) => {
			signIn(token);
			void navigate({ to: "/halls" });
		},
	});
};

export const useCurrentUser = (): AuthUser | null => {
	const token = useAuthStore((state) => state.token);
	if (!token) {
		return null;
	}
	const claims = readJwtClaims(token);
	if (!claims?.email) {
		return null;
	}
	return {
		email: claims.email,
		name: claims.name ?? claims.email,
		role: claims.role ?? "user",
		expiresAt: claims.exp ? claims.exp * 1000 : null,
	};
};
