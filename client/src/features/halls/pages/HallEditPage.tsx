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
import { useHall, useUpdateHall } from "@/features/halls/api";
import {
	hallSchema,
	type HallFormInput,
	type HallFormValues,
} from "@/features/halls/types";
import { applyServerFieldErrors, describeApiError } from "@/lib/api";

export const HallEditPage = (): FunctionComponent => {
	const { hallId } = useParams({ from: "/halls/$hallId" });
	const id = Number(hallId);
	const { data: hall, isLoading, isError, error } = useHall(id);
	const updateHall = useUpdateHall();

	const {
		register,
		handleSubmit,
		reset,
		setError,
		formState: { errors },
	} = useForm<HallFormInput, unknown, HallFormValues>({
		resolver: zodResolver(hallSchema),
		defaultValues: { name: "", description: "" },
	});

	useEffect(() => {
		if (hall) {
			reset({
				name: hall.name,
				capacity: hall.capacity,
				description: hall.description ?? "",
			});
		}
	}, [hall, reset]);

	const onSubmit = handleSubmit((values) => {
		updateHall.mutate(
			{ id, data: values },
			{
				onError: (mutationError) => {
					applyServerFieldErrors(setError, mutationError);
				},
			}
		);
	});

	if (isLoading) {
		return <Loading label="Завантаження залу…" />;
	}

	if (isError) {
		return <ErrorMessage message={describeApiError(error)} />;
	}

	return (
		<div className="p-4">
			<PageHeader title={`Зал №${id}`}>
				<Link
					className="rounded border border-slate-300 px-4 py-2 hover:bg-slate-100"
					to="/halls"
				>
					До списку
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

				<Field
					error={errors.capacity?.message}
					htmlFor="capacity"
					label="Місткість"
				>
					<input
						className={inputClass(Boolean(errors.capacity))}
						id="capacity"
						type="number"
						{...register("capacity")}
					/>
				</Field>

				<Field
					error={errors.description?.message}
					htmlFor="description"
					label="Опис"
				>
					<textarea
						className={inputClass(Boolean(errors.description))}
						id="description"
						rows={3}
						{...register("description")}
					/>
				</Field>

				{updateHall.isError ? (
					<ErrorMessage message={describeApiError(updateHall.error)} />
				) : null}

				<button
					className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
					disabled={updateHall.isPending}
					type="submit"
				>
					{updateHall.isPending ? "Збереження…" : "Зберегти"}
				</button>
			</form>
		</div>
	);
};
