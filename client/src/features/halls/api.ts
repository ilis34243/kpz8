import {
	type UseMutationResult,
	type UseQueryResult,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { apiClient } from "@/lib/axios";
import { unwrap, type ApiSuccessBody } from "@/lib/api";
import type { Hall, HallFormValues } from "@/features/halls/types";

const getHalls = async (): Promise<Array<Hall>> =>
	unwrap(await apiClient.get<ApiSuccessBody<Array<Hall>>>("/halls"));

const getHall = async (id: number): Promise<Hall> =>
	unwrap(await apiClient.get<ApiSuccessBody<Hall>>(`/halls/${id}`));

const createHall = async (values: HallFormValues): Promise<Hall> =>
	unwrap(await apiClient.post<ApiSuccessBody<Hall>>("/halls", values));

const updateHall = async ({
	id,
	data,
}: {
	id: number;
	data: Partial<HallFormValues>;
}): Promise<Hall> =>
	unwrap(await apiClient.patch<ApiSuccessBody<Hall>>(`/halls/${id}`, data));

const deleteHall = async (id: number): Promise<void> => {
	await apiClient.delete<ApiSuccessBody<Hall>>(`/halls/${id}`);
};

export const useHalls = (): UseQueryResult<Array<Hall>> =>
	useQuery<Array<Hall>>({ queryKey: ["halls"], queryFn: getHalls });

export const useHall = (id: number): UseQueryResult<Hall> =>
	useQuery<Hall>({
		queryKey: ["halls", id],
		queryFn: () => getHall(id),
		enabled: id > 0,
	});

export const useCreateHall = (): UseMutationResult<
	Hall,
	Error,
	HallFormValues
> => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: createHall,
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["halls"] });
			void navigate({ to: "/halls" });
		},
	});
};

export const useUpdateHall = (): UseMutationResult<
	Hall,
	Error,
	{ id: number; data: Partial<HallFormValues> }
> => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: updateHall,
		onSuccess: (hall) => {
			void queryClient.invalidateQueries({ queryKey: ["halls"] });
			queryClient.setQueryData(["halls", hall.id], hall);
			void navigate({ to: "/halls" });
		},
	});
};

export const useDeleteHall = (): UseMutationResult<void, Error, number> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteHall,
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["halls"] });
		},
	});
};
