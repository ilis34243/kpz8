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
import type { Client, ClientFormValues } from "@/features/clients/types";

const getClients = async (): Promise<Array<Client>> =>
	unwrap(await apiClient.get<ApiSuccessBody<Array<Client>>>("/clients"));

const getClient = async (id: number): Promise<Client> =>
	unwrap(await apiClient.get<ApiSuccessBody<Client>>(`/clients/${id}`));

const createClient = async (values: ClientFormValues): Promise<Client> =>
	unwrap(await apiClient.post<ApiSuccessBody<Client>>("/clients", values));

const updateClient = async ({
	id,
	data,
}: {
	id: number;
	data: Partial<ClientFormValues>;
}): Promise<Client> =>
	unwrap(await apiClient.patch<ApiSuccessBody<Client>>(`/clients/${id}`, data));

const deleteClient = async (id: number): Promise<void> => {
	await apiClient.delete<ApiSuccessBody<Client>>(`/clients/${id}`);
};

export const useClients = (): UseQueryResult<Array<Client>> =>
	useQuery<Array<Client>>({ queryKey: ["clients"], queryFn: getClients });

export const useClient = (id: number): UseQueryResult<Client> =>
	useQuery<Client>({
		queryKey: ["clients", id],
		queryFn: () => getClient(id),
		enabled: id > 0,
	});

export const useCreateClient = (): UseMutationResult<
	Client,
	Error,
	ClientFormValues
> => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: createClient,
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["clients"] });
			void navigate({ to: "/clients" });
		},
	});
};

export const useUpdateClient = (): UseMutationResult<
	Client,
	Error,
	{ id: number; data: Partial<ClientFormValues> }
> => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: updateClient,
		onSuccess: (client) => {
			void queryClient.invalidateQueries({ queryKey: ["clients"] });
			queryClient.setQueryData(["clients", client.id], client);
			void navigate({ to: "/clients" });
		},
	});
};

export const useDeleteClient = (): UseMutationResult<void, Error, number> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteClient,
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["clients"] });
		},
	});
};
