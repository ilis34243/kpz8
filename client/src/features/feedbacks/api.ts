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
import type { Feedback, FeedbackFormValues } from "@/features/feedbacks/types";

const getFeedbacks = async (): Promise<Array<Feedback>> =>
	unwrap(await apiClient.get<ApiSuccessBody<Array<Feedback>>>("/feedbacks"));

const getFeedback = async (id: number): Promise<Feedback> =>
	unwrap(await apiClient.get<ApiSuccessBody<Feedback>>(`/feedbacks/${id}`));

const createFeedback = async (values: FeedbackFormValues): Promise<Feedback> =>
	unwrap(await apiClient.post<ApiSuccessBody<Feedback>>("/feedbacks", values));

const updateFeedback = async ({
	id,
	data,
}: {
	id: number;
	data: Partial<FeedbackFormValues>;
}): Promise<Feedback> =>
	unwrap(
		await apiClient.patch<ApiSuccessBody<Feedback>>(`/feedbacks/${id}`, data)
	);

const deleteFeedback = async (id: number): Promise<void> => {
	await apiClient.delete<ApiSuccessBody<Feedback>>(`/feedbacks/${id}`);
};

export const useFeedbacks = (): UseQueryResult<Array<Feedback>> =>
	useQuery<Array<Feedback>>({ queryKey: ["feedbacks"], queryFn: getFeedbacks });

export const useFeedback = (id: number): UseQueryResult<Feedback> =>
	useQuery<Feedback>({
		queryKey: ["feedbacks", id],
		queryFn: () => getFeedback(id),
		enabled: id > 0,
	});

export const useCreateFeedback = (): UseMutationResult<
	Feedback,
	Error,
	FeedbackFormValues
> => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: createFeedback,
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
			void queryClient.invalidateQueries({ queryKey: ["events"] });
			void navigate({ to: "/feedbacks" });
		},
	});
};

export const useUpdateFeedback = (): UseMutationResult<
	Feedback,
	Error,
	{ id: number; data: Partial<FeedbackFormValues> }
> => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: updateFeedback,
		onSuccess: (feedback) => {
			void queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
			queryClient.setQueryData(["feedbacks", feedback.id], feedback);
			void navigate({ to: "/feedbacks" });
		},
	});
};

export const useDeleteFeedback = (): UseMutationResult<void, Error, number> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteFeedback,
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
			void queryClient.invalidateQueries({ queryKey: ["events"] });
		},
	});
};
