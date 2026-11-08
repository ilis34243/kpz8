import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import type { FunctionComponent } from "@/common/types";
import { ErrorMessage, Field, PageHeader } from "@/components/ui/Primitives";
import { inputClass } from "@/components/ui/inputClass";
import { useCreateClient } from "@/features/clients/api";
import { clientSchema, type ClientFormValues } from "@/features/clients/types";
import { applyServerFieldErrors, describeApiError } from "@/lib/api";

export const ClientCreatePage = (): FunctionComponent => {
	const createClient = useCreateClient();
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<ClientFormValues>({
		resolver: zodResolver(clientSchema),
		defaultValues: { full_name: "", email: "", phone: "" },
	});

	const onSubmit = handleSubmit((values) => {
		createClient.mutate(values, {
			onError: (error) => {
				applyServerFieldErrors(setError, error);
			},
		});
	});

	return (
		<div className="p-4">
			<PageHeader title="Новий клієнт">
				<Link
					className="rounded border border-slate-300 px-4 py-2 hover:bg-slate-100"
					to="/clients"
				>
					Скасувати
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

				{createClient.isError ? (
					<ErrorMessage message={describeApiError(createClient.error)} />
				) : null}

				<button
					className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
					disabled={createClient.isPending}
					type="submit"
				>
					{createClient.isPending ? "Збереження…" : "Створити"}
				</button>
			</form>
		</div>
	);
};
