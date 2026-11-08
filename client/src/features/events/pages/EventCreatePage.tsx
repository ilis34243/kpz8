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
import { useCreateEvent } from "@/features/events/api";
import {
	eventSchema,
	type EventFormInput,
	type EventFormValues,
} from "@/features/events/types";
import { EVENT_TYPES } from "@/features/shared/types";
import { useHalls } from "@/features/halls/api";
import { applyServerFieldErrors, describeApiError } from "@/lib/api";
import { fromInputDateTime } from "@/lib/datetime";

export const EventCreatePage = (): FunctionComponent => {
	const createEvent = useCreateEvent();
	const { data: halls, isLoading: hallsLoading } = useHalls();
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<EventFormInput, unknown, EventFormValues>({
		resolver: zodResolver(eventSchema),
		defaultValues: {
			name: "",
			type: "MASTER_CLASS",
			start_datetime: "",
			end_datetime: "",
			hall_id: 0,
		},
	});

	const onSubmit = handleSubmit((values) => {
		createEvent.mutate(
			{
				...values,
				start_datetime: fromInputDateTime(values.start_datetime),
				end_datetime: fromInputDateTime(values.end_datetime),
			},
			{
				onError: (error) => {
					applyServerFieldErrors(setError, error);
				},
			}
		);
	});

	if (hallsLoading) {
		return <Loading label="Завантаження залів…" />;
	}

	return (
		<div className="p-4">
			<PageHeader title="Нова подія">
				<Link
					className="rounded border border-slate-300 px-4 py-2 hover:bg-slate-100"
					to="/events"
				>
					Скасувати
				</Link>
			</PageHeader>

			<form noValidate className="max-w-xl" onSubmit={onSubmit}>
				<Field error={errors.name?.message} htmlFor="name" label="Назва">
					<input
						className={inputClass(Boolean(errors.name))}
						id="name"
						{...register("name")}
					/>
				</Field>

				<Field error={errors.type?.message} htmlFor="type" label="Тип">
					<select
						className={inputClass(Boolean(errors.type))}
						id="type"
						{...register("type")}
					>
						{EVENT_TYPES.map((type) => (
							<option key={type} value={type}>
								{type}
							</option>
						))}
					</select>
				</Field>

				<Field
					error={errors.start_datetime?.message}
					htmlFor="start_datetime"
					label="Початок"
				>
					<input
						className={inputClass(Boolean(errors.start_datetime))}
						id="start_datetime"
						type="datetime-local"
						{...register("start_datetime")}
					/>
				</Field>

				<Field
					error={errors.end_datetime?.message}
					htmlFor="end_datetime"
					label="Завершення"
				>
					<input
						className={inputClass(Boolean(errors.end_datetime))}
						id="end_datetime"
						type="datetime-local"
						{...register("end_datetime")}
					/>
				</Field>

				<Field error={errors.hall_id?.message} htmlFor="hall_id" label="Зал">
					<select
						className={inputClass(Boolean(errors.hall_id))}
						id="hall_id"
						{...register("hall_id")}
					>
						<option value={0}>— оберіть зал —</option>
						{halls?.map((hall) => (
							<option key={hall.id} value={hall.id}>
								{hall.name} ({hall.capacity} місць)
							</option>
						))}
					</select>
				</Field>

				{createEvent.isError ? (
					<ErrorMessage message={describeApiError(createEvent.error)} />
				) : null}

				<button
					className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
					disabled={createEvent.isPending}
					type="submit"
				>
					{createEvent.isPending ? "Збереження…" : "Створити"}
				</button>
			</form>
		</div>
	);
};
