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
import {
	useHallRental,
	useUpdateHallRental,
} from "@/features/hall-rentals/api";
import {
	hallRentalSchema,
	type HallRentalFormInput,
	type HallRentalFormValues,
} from "@/features/hall-rentals/types";
import { useHalls } from "@/features/halls/api";
import { RENTAL_STATUSES } from "@/features/shared/types";
import { applyServerFieldErrors, describeApiError } from "@/lib/api";
import { fromInputDateTime, toInputDateTime } from "@/lib/datetime";

export const HallRentalEditPage = (): FunctionComponent => {
	const { rentalId } = useParams({ from: "/hall-rentals/$rentalId" });
	const id = Number(rentalId);
	const { data: rental, isLoading, isError, error } = useHallRental(id);
	const { data: halls } = useHalls();
	const { data: clients } = useClients();
	const updateRental = useUpdateHallRental();

	const {
		register,
		handleSubmit,
		reset,
		setError,
		formState: { errors },
	} = useForm<HallRentalFormInput, unknown, HallRentalFormValues>({
		resolver: zodResolver(hallRentalSchema),
		defaultValues: {
			hall_id: 0,
			client_id: 0,
			start_datetime: "",
			end_datetime: "",
			total_cost: 0,
			status: "RESERVED",
		},
	});

	useEffect(() => {
		if (rental) {
			reset({
				hall_id: rental.hall_id ?? 0,
				client_id: rental.client_id ?? 0,
				start_datetime: toInputDateTime(rental.start_datetime),
				end_datetime: toInputDateTime(rental.end_datetime),
				total_cost: rental.total_cost,
				status: rental.status,
			});
		}
	}, [rental, reset]);

	const onSubmit = handleSubmit((values) => {
		updateRental.mutate(
			{
				id,
				data: {
					...values,
					start_datetime: fromInputDateTime(values.start_datetime),
					end_datetime: fromInputDateTime(values.end_datetime),
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
		return <Loading label="Завантаження оренди…" />;
	}

	if (isError) {
		return <ErrorMessage message={describeApiError(error)} />;
	}

	return (
		<div className="p-4">
			<PageHeader title={`Оренда №${id}`}>
				<Link
					className="rounded border border-slate-300 px-4 py-2 hover:bg-slate-100"
					to="/hall-rentals"
				>
					До списку
				</Link>
			</PageHeader>

			<form noValidate className="max-w-xl" onSubmit={onSubmit}>
				<Field error={errors.hall_id?.message} htmlFor="hall_id" label="Зал">
					<select
						className={inputClass(Boolean(errors.hall_id))}
						id="hall_id"
						{...register("hall_id")}
					>
						<option value={0}>— оберіть зал —</option>
						{halls?.map((hall) => (
							<option key={hall.id} value={hall.id}>
								{hall.name}
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

				<Field
					error={errors.total_cost?.message}
					htmlFor="total_cost"
					label="Вартість"
				>
					<input
						className={inputClass(Boolean(errors.total_cost))}
						id="total_cost"
						step="0.01"
						type="number"
						{...register("total_cost")}
					/>
				</Field>

				<Field error={errors.status?.message} htmlFor="status" label="Статус">
					<select
						className={inputClass(Boolean(errors.status))}
						id="status"
						{...register("status")}
					>
						{RENTAL_STATUSES.map((status) => (
							<option key={status} value={status}>
								{status}
							</option>
						))}
					</select>
				</Field>

				{updateRental.isError ? (
					<ErrorMessage message={describeApiError(updateRental.error)} />
				) : null}

				<button
					className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
					disabled={updateRental.isPending}
					type="submit"
				>
					{updateRental.isPending ? "Збереження…" : "Зберегти"}
				</button>
			</form>
		</div>
	);
};
