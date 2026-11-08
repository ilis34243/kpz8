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
import type { EventFormValues, LeisureEvent } from "@/features/events/types";

const getEvents = async (): Promise<Array<LeisureEvent>> =>
	unwrap(await apiClient.get<ApiSuccessBody<Array<LeisureEvent>>>("/events"));

const getEvent = async (id: number): Promise<LeisureEvent> =>
	unwrap(await apiClient.get<ApiSuccessBody<LeisureEvent>>(`/events/${id}`));

const createEvent = async (values: EventFormValues): Promise<LeisureEvent> =>
	unwrap(await apiClient.post<ApiSuccessBody<LeisureEvent>>("/events", values));

const updateEvent = async ({
	id,
	data,
}: {
	id: number;
	data: Partial<EventFormValues>;
}): Promise<LeisureEvent> =>
	unwrap(
		await apiClient.patch<ApiSuccessBody<LeisureEvent>>(`/events/${id}`, data)
	);

const deleteEvent = async (id: number): Promise<void> => {
	await apiClient.delete<ApiSuccessBody<LeisureEvent>>(`/events/${id}`);
};

export const useEvents = (): UseQueryResult<Array<LeisureEvent>> =>
	useQuery<Array<LeisureEvent>>({ queryKey: ["events"], queryFn: getEvents });

export const useEvent = (id: number): UseQueryResult<LeisureEvent> =>
	useQuery<LeisureEvent>({
		queryKey: ["events", id],
		queryFn: () => getEvent(id),
		enabled: id > 0,
	});

export const useCreateEvent = (): UseMutationResult<
	LeisureEvent,
	Error,
	EventFormValues
> => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: createEvent,
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["events"] });
			void navigate({ to: "/events" });
		},
	});
};

export const useUpdateEvent = (): UseMutationResult<
	LeisureEvent,
	Error,
	{ id: number; data: Partial<EventFormValues> }
> => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: updateEvent,
		onSuccess: (event) => {
			void queryClient.invalidateQueries({ queryKey: ["events"] });
			queryClient.setQueryData(["events", event.id], event);
			void navigate({ to: "/events" });
		},
	});
};

export const useDeleteEvent = (): UseMutationResult<void, Error, number> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteEvent,
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["events"] });
		},
	});
};
