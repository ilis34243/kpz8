import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import type { FunctionComponent } from "@/common/types";
import { ErrorMessage, Field, PageHeader } from "@/components/ui/Primitives";
import { inputClass } from "@/components/ui/inputClass";
import { useCreateHall } from "@/features/halls/api";
import {
	hallSchema,
	type HallFormInput,
	type HallFormValues,
} from "@/features/halls/types";
import { applyServerFieldErrors, describeApiError } from "@/lib/api";

export const HallCreatePage = (): FunctionComponent => {
	const createHall = useCreateHall();
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<HallFormInput, unknown, HallFormValues>({
		resolver: zodResolver(hallSchema),
		defaultValues: { name: "", description: "" },
	});

	const onSubmit = handleSubmit((values) => {
		createHall.mutate(values, {
			onError: (error) => {
				applyServerFieldErrors(setError, error);
			},
		});
	});

	return (
		<div className="p-4">
			<PageHeader title="Новий зал">
				<Link
					className="rounded border border-slate-300 px-4 py-2 hover:bg-slate-100"
					to="/halls"
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

				{createHall.isError ? (
					<ErrorMessage message={describeApiError(createHall.error)} />
				) : null}

				<button
					className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
					disabled={createHall.isPending}
					type="submit"
				>
					{createHall.isPending ? "Збереження…" : "Створити"}
				</button>
			</form>
		</div>
	);
};
