import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/axios";
import { unwrap, type ApiSuccessBody } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import type { User } from "@/features/users/types";

const listUsers = async (): Promise<Array<User>> =>
	unwrap(await apiClient.get<ApiSuccessBody<Array<User>>>("/users"));

export const useUsers = (): UseQueryResult<Array<User>> => {
	const token = useAuthStore((state) => state.token);

	return useQuery<Array<User>>({
		queryKey: ["users"],
		queryFn: listUsers,
		enabled: token !== null,
	});
};
