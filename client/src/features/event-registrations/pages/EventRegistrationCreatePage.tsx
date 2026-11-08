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
import { useCreateEventRegistration } from "@/features/event-registrations/api";
import {
	eventRegistrationSchema,
	type EventRegistrationFormInput,
	type EventRegistrationFormValues,
} from "@/features/event-registrations/types";
import { useEvents } from "@/features/events/api";
import { applyServerFieldErrors, describeApiError } from "@/lib/api";

export const EventRegistrationCreatePage = (): FunctionComponent => {
	const createRegistration = useCreateEventRegistration();
	const { data: events, isLoading: eventsLoading } = useEvents();
	const { data: clients, isLoading: clientsLoading } = useClients();

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<EventRegistrationFormInput, unknown, EventRegistrationFormValues>(
		{
			resolver: zodResolver(eventRegistrationSchema),
			defaultValues: { event_id: 0, client_id: 0, seats: 1 },
		}
	);

	const onSubmit = handleSubmit((values) => {
		createRegistration.mutate(values, {
			onError: (error) => {
				applyServerFieldErrors(setError, error);
			},
		});
	});

	if (eventsLoading || clientsLoading) {
		return <Loading label="Завантаження довідників…" />;
	}

	return (
		<div className="p-4">
			<PageHeader title="Нова реєстрація">
				<Link
					className="rounded border border-slate-300 px-4 py-2 hover:bg-slate-100"
					to="/event-registrations"
				>
					Скасувати
				</Link>
			</PageHeader>

			<form noValidate className="max-w-xl" onSubmit={onSubmit}>
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

				<Field error={errors.seats?.message} htmlFor="seats" label="Місця">
					<input
						className={inputClass(Boolean(errors.seats))}
						id="seats"
						type="number"
						{...register("seats")}
					/>
				</Field>

				{createRegistration.isError ? (
					<ErrorMessage message={describeApiError(createRegistration.error)} />
				) : null}

				<button
					className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
					disabled={createRegistration.isPending}
					type="submit"
				>
					{createRegistration.isPending ? "Збереження…" : "Створити"}
				</button>
			</form>
		</div>
	);
};
