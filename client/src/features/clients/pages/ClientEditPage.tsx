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
import { useClient, useUpdateClient } from "@/features/clients/api";
import { clientSchema, type ClientFormValues } from "@/features/clients/types";
import { applyServerFieldErrors, describeApiError } from "@/lib/api";

export const ClientEditPage = (): FunctionComponent => {
	const { clientId } = useParams({ from: "/clients/$clientId" });
	const id = Number(clientId);
	const { data: client, isLoading, isError, error } = useClient(id);
	const updateClient = useUpdateClient();

	const {
		register,
		handleSubmit,
		reset,
		setError,
		formState: { errors },
	} = useForm<ClientFormValues>({
		resolver: zodResolver(clientSchema),
		defaultValues: { full_name: "", email: "", phone: "" },
	});

	useEffect(() => {
		if (client) {
			reset({
				full_name: client.full_name,
				email: client.email,
				phone: client.phone,
			});
		}
	}, [client, reset]);

	const onSubmit = handleSubmit((values) => {
		updateClient.mutate(
			{ id, data: values },
			{
				onError: (mutationError) => {
					applyServerFieldErrors(setError, mutationError);
				},
			}
		);
	});

	if (isLoading) {
		return <Loading label="Завантаження клієнта…" />;
	}

	if (isError) {
		return <ErrorMessage message={describeApiError(error)} />;
	}

	return (
		<div className="p-4">
			<PageHeader title={`Клієнт №${id}`}>
				<Link
					className="rounded border border-slate-300 px-4 py-2 hover:bg-slate-100"
					to="/clients"
				>
					До списку
				</Link>
			</PageHeader>

			<form noValidate className="max-w-xl" onSubmit={onSubmit}>
				<Field
					error={errors.full_name?.message}
					htmlFor="full_name"
					label="ПІБ"
				>
					<input
						className={inputClass(Boolean(errors.full_name))}
						id="full_name"
						{...register("full_name")}
					/>
				</Field>

				<Field error={errors.email?.message} htmlFor="email" label="Email">
					<input
						className={inputClass(Boolean(errors.email))}
						id="email"
						type="email"
						{...register("email")}
					/>
				</Field>

				<Field error={errors.phone?.message} htmlFor="phone" label="Телефон">
					<input
						className={inputClass(Boolean(errors.phone))}
						id="phone"
						{...register("phone")}
					/>
				</Field>

				{updateClient.isError ? (
					<ErrorMessage message={describeApiError(updateClient.error)} />
				) : null}

				<button
					className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
					disabled={updateClient.isPending}
					type="submit"
				>
					{updateClient.isPending ? "Збереження…" : "Зберегти"}
				</button>
			</form>
		</div>
	);
};
