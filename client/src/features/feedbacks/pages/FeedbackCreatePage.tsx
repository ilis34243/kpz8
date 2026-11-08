import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
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
import { useCreateFeedback } from "@/features/feedbacks/api";
import {
	feedbackSchema,
	type FeedbackFormInput,
	type FeedbackFormValues,
} from "@/features/feedbacks/types";
import { applyServerFieldErrors, describeApiError } from "@/lib/api";

export const FeedbackCreatePage = (): FunctionComponent => {
	const createFeedback = useCreateFeedback();
	const { data: events, isLoading: eventsLoading } = useEvents();
	const { data: clients, isLoading: clientsLoading } = useClients();

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<FeedbackFormInput, unknown, FeedbackFormValues>({
		resolver: zodResolver(feedbackSchema),
		defaultValues: { client_id: 0, event_id: 0, rating: 5, comment: "" },
	});

	const onSubmit = handleSubmit((values) => {
		createFeedback.mutate(
			{
				...values,
				comment: values.comment?.trim() ? values.comment.trim() : undefined,
			},
			{
				onError: (error) => {
					applyServerFieldErrors(setError, error);
				},
			}
		);
	});

	if (eventsLoading || clientsLoading) {
		return <Loading label="Завантаження довідників…" />;
	}

	return (
		<div className="p-4">
			<PageHeader title="Новий відгук">
				<Link
					className="rounded border border-slate-300 px-4 py-2 hover:bg-slate-100"
					to="/feedbacks"
				>
					Скасувати
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

				{createFeedback.isError ? (
					<ErrorMessage message={describeApiError(createFeedback.error)} />
				) : null}

				<button
					className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
					disabled={createFeedback.isPending}
					type="submit"
				>
					{createFeedback.isPending ? "Збереження…" : "Створити"}
				</button>
			</form>
		</div>
	);
};
