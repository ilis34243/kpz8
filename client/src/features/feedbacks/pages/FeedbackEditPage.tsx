import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useParams } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { FunctionComponent } from "@/common/types";
import {
	ErrorMessage,
	Field,
	Loading,
	PageHeader,
} from "@/components/ui/Primitives";
import { inputClass } from "@/components/ui/inputClass";
import { useClients } from "@/features/clients/api";
import { useEvents } from "@/features/events/api";
import { useFeedback, useUpdateFeedback } from "@/features/feedbacks/api";
import {
	feedbackSchema,
	type FeedbackFormInput,
	type FeedbackFormValues,
} from "@/features/feedbacks/types";
import { applyServerFieldErrors, describeApiError } from "@/lib/api";

export const FeedbackEditPage = (): FunctionComponent => {
	const { feedbackId } = useParams({ from: "/feedbacks/$feedbackId" });
	const id = Number(feedbackId);
	const { data: feedback, isLoading, isError, error } = useFeedback(id);
	const { data: events } = useEvents();
	const { data: clients } = useClients();
	const updateFeedback = useUpdateFeedback();

	const {
		register,
		handleSubmit,
		reset,
		setError,
		formState: { errors },
	} = useForm<FeedbackFormInput, unknown, FeedbackFormValues>({
		resolver: zodResolver(feedbackSchema),
		defaultValues: { client_id: 0, event_id: 0, rating: 5, comment: "" },
	});

	useEffect(() => {
		if (feedback) {
			reset({
				client_id: feedback.client_id ?? 0,
				event_id: feedback.event_id ?? 0,
				rating: feedback.rating,
				comment: feedback.comment ?? "",
			});
		}
	}, [feedback, reset]);

	const onSubmit = handleSubmit((values) => {
		updateFeedback.mutate(
			{
				id,
				data: {
					...values,
					comment: values.comment?.trim() ? values.comment.trim() : undefined,
				},
			},
			{
				onError: (mutationError) => {
					applyServerFieldErrors(setError, mutationError);
				},
			}
		);
	});

	if (isLoading) {
		return <Loading label="Завантаження відгуку…" />;
	}

	if (isError) {
		return <ErrorMessage message={describeApiError(error)} />;
	}

	return (
		<div className="p-4">
			<PageHeader title={`Відгук №${id}`}>
				<Link
					className="rounded border border-slate-300 px-4 py-2 hover:bg-slate-100"
					to="/feedbacks"
				>
					До списку
				</Link>
			</PageHeader>

			<form noValidate className="max-w-xl" onSubmit={onSubmit}>
				<Field
					error={errors.client_id?.message}
					htmlFor="client_id"
					label="Клієнт"
				>
					<select
						className={inputClass(Boolean(errors.client_id))}
						id="client_id"
						{...register("client_id")}
					>
						<option value={0}>— оберіть клієнта —</option>
						{clients?.map((client) => (
							<option key={client.id} value={client.id}>
								{client.full_name}
							</option>
						))}
					</select>
				</Field>

				<Field
					error={errors.event_id?.message}
					htmlFor="event_id"
					label="Подія"
				>
					<select
						className={inputClass(Boolean(errors.event_id))}
						id="event_id"
						{...register("event_id")}
					>
						<option value={0}>— оберіть подію —</option>
						{events?.map((event) => (
							<option key={event.id} value={event.id}>
								{event.name}
							</option>
						))}
					</select>
				</Field>

				<Field
					error={errors.rating?.message}
					htmlFor="rating"
					label="Оцінка (1–5)"
				>
					<input
						className={inputClass(Boolean(errors.rating))}
						id="rating"
						max={5}
						min={1}
						type="number"
						{...register("rating")}
					/>
				</Field>

				<Field
					error={errors.comment?.message}
					htmlFor="comment"
					label="Коментар"
				>
					<textarea
						className={inputClass(Boolean(errors.comment))}
						id="comment"
						rows={3}
						{...register("comment")}
					/>
				</Field>

				{updateFeedback.isError ? (
					<ErrorMessage message={describeApiError(updateFeedback.error)} />
				) : null}

				<button
					className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
					disabled={updateFeedback.isPending}
					type="submit"
				>
					{updateFeedback.isPending ? "Збереження…" : "Зберегти"}
				</button>
			</form>
		</div>
	);
};
