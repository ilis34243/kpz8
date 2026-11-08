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
import type {
	EventRegistration,
	EventRegistrationFormValues,
} from "@/features/event-registrations/types";

const getEventRegistrations = async (): Promise<Array<EventRegistration>> =>
	unwrap(
		await apiClient.get<ApiSuccessBody<Array<EventRegistration>>>(
			"/event-registrations"
		)
	);

const getEventRegistration = async (id: number): Promise<EventRegistration> =>
	unwrap(
		await apiClient.get<ApiSuccessBody<EventRegistration>>(
			`/event-registrations/${id}`
		)
	);

const createEventRegistration = async (
	values: EventRegistrationFormValues
): Promise<EventRegistration> =>
	unwrap(
		await apiClient.post<ApiSuccessBody<EventRegistration>>(
			"/event-registrations",
			values
		)
	);

const updateEventRegistration = async ({
	id,
	data,
}: {
	id: number;
	data: Partial<EventRegistrationFormValues>;
}): Promise<EventRegistration> =>
	unwrap(
		await apiClient.patch<ApiSuccessBody<EventRegistration>>(
			`/event-registrations/${id}`,
			data
		)
	);

const deleteEventRegistration = async (id: number): Promise<void> => {
	await apiClient.delete<ApiSuccessBody<EventRegistration>>(
		`/event-registrations/${id}`
	);
};

export const useEventRegistrations = (): UseQueryResult<
	Array<EventRegistration>
> =>
	useQuery<Array<EventRegistration>>({
		queryKey: ["event-registrations"],
		queryFn: getEventRegistrations,
	});

export const useEventRegistration = (
	id: number
): UseQueryResult<EventRegistration> =>
	useQuery<EventRegistration>({
		queryKey: ["event-registrations", id],
		queryFn: () => getEventRegistration(id),
		enabled: id > 0,
	});

export const useCreateEventRegistration = (): UseMutationResult<
	EventRegistration,
	Error,
	EventRegistrationFormValues
> => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: createEventRegistration,
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["event-registrations"] });
			void queryClient.invalidateQueries({ queryKey: ["events"] });
			void navigate({ to: "/event-registrations" });
		},
	});
};

export const useUpdateEventRegistration = (): UseMutationResult<
	EventRegistration,
	Error,
	{ id: number; data: Partial<EventRegistrationFormValues> }
> => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: updateEventRegistration,
		onSuccess: (registration) => {
			void queryClient.invalidateQueries({ queryKey: ["event-registrations"] });
			queryClient.setQueryData(
				["event-registrations", registration.id],
				registration
			);
			void navigate({ to: "/event-registrations" });
		},
	});
};

export const useDeleteEventRegistration = (): UseMutationResult<
	void,
	Error,
	number
> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteEventRegistration,
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["event-registrations"] });
			void queryClient.invalidateQueries({ queryKey: ["events"] });
		},
	});
};
